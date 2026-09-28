<?php
declare(strict_types=1);

function lead_config(): array {
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) throw new RuntimeException('Not configured');
    $cfg = require $path;
    if (!is_array($cfg) || empty($cfg['enabled']) ||
        !filter_var($cfg['recipient'] ?? '', FILTER_VALIDATE_EMAIL) ||
        strlen($cfg['consent_text'] ?? '') < 100 ||
        !preg_match('/^[a-zA-Z0-9.-]+$/D', $cfg['consent_version'] ?? '') ||
        (int)($cfg['retention_days'] ?? 0) < 2 || (int)$cfg['retention_days'] > 90) {
        throw new RuntimeException('Not configured');
    }
    return $cfg;
}

function lead_field(array $form, string $key, int $max): string {
    // PHP normalizes spaces in multipart field names to underscores.
    $value = $form[$key] ?? $form[str_replace(' ', '_', $key)] ?? '';
    if (!is_string($value) || strlen($value) > $max ||
        !preg_match('//u', $value) || preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f]/', $value)) {
        throw new InvalidArgumentException('Invalid field');
    }
    return trim($value);
}

function lead_validate(array $form, array $cfg, int $now): array {
    if (lead_field($form, 'website', 500) !== '' || lead_field($form, 'confirm_order', 10) !== '') {
        throw new InvalidArgumentException('Invalid form');
    }
    $id = lead_field($form, 'submission_id', 36);
    $phone = lead_field($form, 'Телефон', 64);
    $category = lead_field($form, 'Тип мебели', 100);
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iD', $id) ||
        !preg_match('/^[+0-9() .-]+$/D', $phone) ||
        !preg_match('/^[0-9]{10,15}$/D', preg_replace('/\D/', '', $phone)) ||
        !in_array($category, ['Кухня', 'Шкаф или гардеробная', 'Корпусная мебель', 'Комплексный заказ', 'Дизайн-проект', 'Консультация'], true) ||
        lead_field($form, 'consent', 8) !== 'true' ||
        lead_field($form, 'consent_version', 64) !== $cfg['consent_version'] ||
        lead_field($form, 'consent_document', 32) !== '/consent/') {
        throw new InvalidArgumentException('Invalid form');
    }
    $page = lead_field($form, 'Страница', 1000);
    $parts = parse_url($page);
    $origin = is_array($parts) ? ($parts['scheme'] ?? '') . '://' . ($parts['host'] ?? '') : '';
    $page = in_array($origin, $cfg['origins'], true) ? $origin . ($parts['path'] ?? '/') : $cfg['origins'][0] . '/';
    $sketch = lead_field($form, 'Ссылка на эскиз', 2000);
    if ($sketch !== '' && $sketch !== 'Не указана' &&
        (!filter_var($sketch, FILTER_VALIDATE_URL) || !in_array(parse_url($sketch, PHP_URL_SCHEME), ['http', 'https'], true))) {
        throw new InvalidArgumentException('Invalid link');
    }
    return [
        'id' => strtolower($id), 'phone' => $phone, 'category' => $category,
        'message' => lead_field($form, 'Пожелания', 6000), 'sketch_url' => $sketch,
        'source' => lead_field($form, 'Источник формы', 500),
        'calculator_summary' => lead_field($form, 'Параметры калькулятора', 6000),
        'page' => $page, 'created_at' => $now,
        'consent_version' => $cfg['consent_version'], 'consent_text' => $cfg['consent_text'],
        'consent_sha256' => hash('sha256', $cfg['consent_text']),
        'notified_at' => null, 'attempts' => 0, 'next_attempt' => $now,
    ];
}

// The private directory MUST be a sibling of public_html, not inside it.
function lead_directory(array $cfg): string {
    $dir = $cfg['data_dir'];
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) throw new RuntimeException('Storage unavailable');
    $real = realpath($dir);
    $root = !empty($_SERVER['DOCUMENT_ROOT']) ? realpath($_SERVER['DOCUMENT_ROOT']) : null;
    if ($real === false || ($root && ($real === $root || str_starts_with($real, $root . DIRECTORY_SEPARATOR)))) {
        throw new RuntimeException('Private storage must be outside document root');
    }
    return $real;
}

function lead_atomic_write(string $path, string $content): void {
    $tmp = tempnam(dirname($path), '.write-');
    if ($tmp === false) throw new RuntimeException('Storage unavailable');
    try {
        chmod($tmp, 0600);
        $handle = fopen($tmp, 'wb');
        if ($handle === false) throw new RuntimeException('Storage unavailable');
        try {
            $offset = 0;
            while ($offset < strlen($content)) {
                $written = fwrite($handle, substr($content, $offset));
                if ($written === false || $written === 0) throw new RuntimeException('Storage unavailable');
                $offset += $written;
            }
            if (!fflush($handle) || !fsync($handle)) throw new RuntimeException('Storage unavailable');
        } finally { fclose($handle); }
        if (!rename($tmp, $path)) throw new RuntimeException('Storage unavailable');
    } finally { if (is_file($tmp)) unlink($tmp); }
}

function lead_read(string $path): array {
    if (!is_file($path)) return [];
    return json_decode(file_get_contents($path), true, 32, JSON_THROW_ON_ERROR);
}

function lead_enqueue(array $lead, array $cfg, string $ip, int $now): void {
    $dir = lead_directory($cfg);
    $lock = fopen($dir . '/queue.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) throw new RuntimeException('Storage unavailable');
    try {
        $path = $dir . '/' . $lead['id'] . '.json';
        $old = lead_read($path);
        if ($old) {
            foreach (['phone','category','message','sketch_url','source','calculator_summary','page','consent_version','consent_sha256'] as $field) {
                if ($old[$field] !== $lead[$field]) throw new InvalidArgumentException('Submission ID reused');
            }
            return; // Identical retry does not send another email.
        }
        $keyPath = $dir . '/rate.key';
        if (!is_file($keyPath)) lead_atomic_write($keyPath, bin2hex(random_bytes(32)));
        $secret = file_get_contents($keyPath);
        $ipHash = hash_hmac('sha256', $ip, $secret);
        $phoneHash = hash_hmac('sha256', preg_replace('/\D/', '', $lead['phone']), $secret);
        $rate = array_values(array_filter(lead_read($dir . '/rate.json'), fn($r) => $r['at'] > $now - 600));
        if (count($rate) >= 100 || count(array_filter($rate, fn($r) => $r['ip'] === $ipHash)) >= 10 ||
            count(array_filter($rate, fn($r) => $r['phone'] === $phoneHash)) >= 3) {
            throw new OverflowException('Rate limit');
        }
        $rate[] = ['ip' => $ipHash, 'phone' => $phoneHash, 'at' => $now];
        lead_atomic_write($dir . '/rate.json', json_encode($rate, JSON_THROW_ON_ERROR));
        lead_atomic_write($path, json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
    } finally { flock($lock, LOCK_UN); fclose($lock); }
}

function lead_send(array $lead, array $cfg): bool {
    $headers = ['MIME-Version' => '1.0', 'Content-Type' => 'text/plain; charset=UTF-8'];
    if (!empty($cfg['sender'])) {
        if (!filter_var($cfg['sender'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $cfg['sender'])) return false;
        $headers['From'] = $cfg['sender'];
    }
    $subject = '=?UTF-8?B?' . base64_encode('Заявка ПитерМебель: ' . $lead['category']) . '?=';
    $body = implode("\n", [
        'Заявка: ' . $lead['id'], 'Телефон: ' . $lead['phone'], 'Тип мебели: ' . $lead['category'],
        'Пожелания: ' . $lead['message'], 'Эскиз: ' . $lead['sketch_url'],
        'Источник: ' . $lead['source'], 'Калькулятор: ' . $lead['calculator_summary'],
        'Страница: ' . $lead['page'], 'Время UTC: ' . gmdate('c', $lead['created_at']),
        'Согласие: ' . $lead['consent_version'], 'SHA256 согласия: ' . $lead['consent_sha256'],
        '', $lead['consent_text'],
    ]);
    return mail($cfg['recipient'], $subject, $body, $headers);
}

function lead_worker(array $cfg, callable $send, int $now): array {
    $dir = lead_directory($cfg);
    $lock = fopen($dir . '/worker.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) throw new RuntimeException('Worker already running');
    $result = ['sent' => 0, 'pending' => 0, 'deleted' => 0];
    try {
        foreach (glob($dir . '/*.json') as $path) {
            if (!preg_match('/^[0-9a-f-]{36}\.json$/D', basename($path))) continue;
            $lead = lead_read($path);
            // Delete at 89 days, leaving a day for scheduled-job delays (policy: 90).
            if ($lead['created_at'] <= $now - max(0, (int)$cfg['retention_days'] - 1) * 86400) {
                if (!unlink($path)) throw new RuntimeException('Cannot expire lead');
                $result['deleted']++;
                continue;
            }
            if ($lead['notified_at'] !== null) continue;
            if ($lead['next_attempt'] <= $now) {
                try { $accepted = $send($lead, $cfg); } catch (Throwable $e) { $accepted = false; }
                $lead['attempts']++;
                $lead['next_attempt'] = $now + min(3600, 60 * (2 ** min(6, $lead['attempts'])));
                if ($accepted) { $lead['notified_at'] = $now; $result['sent']++; }
                lead_atomic_write($path, json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
            }
            if ($lead['notified_at'] === null) $result['pending']++;
        }
        // Rate records contain only HMACs and expire after 10 minutes.
        $queueLock = fopen($dir . '/queue.lock', 'c');
        if (!$queueLock || !flock($queueLock, LOCK_EX)) throw new RuntimeException('Storage unavailable');
        try {
            $rate = array_values(array_filter(lead_read($dir . '/rate.json'), fn($r) => $r['at'] > $now - 600));
            lead_atomic_write($dir . '/rate.json', json_encode($rate, JSON_THROW_ON_ERROR));
        } finally { flock($queueLock, LOCK_UN); fclose($queueLock); }
        lead_atomic_write($dir . '/heartbeat', (string)$now);
        return $result;
    } finally { flock($lock, LOCK_UN); fclose($lock); }
}
