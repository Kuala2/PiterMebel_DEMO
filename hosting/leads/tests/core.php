<?php
declare(strict_types=1);
require dirname(__DIR__) . '/private/core.php';
$dir = sys_get_temp_dir() . '/pitermebel-leads-test-' . bin2hex(random_bytes(6));
$cfg = ['origins' => ['https://pitermebel.com'], 'recipient' => 'test@example.invalid',
    'sender' => '', 'data_dir' => $dir, 'retention_days' => 90,
    'consent_version' => '2026-09-27', 'consent_text' => str_repeat('Тестовое согласие. ', 20)];
$now = 1800000000;
$form = ['submission_id' => '11111111-1111-4111-8111-111111111111', 'Телефон' => '+70000000000',
    'Тип_мебели' => 'Консультация', 'consent' => 'true', 'consent_version' => $cfg['consent_version'],
    'consent_document' => '/consent/', 'Страница' => 'https://pitermebel.com/contacts/?phone=secret#private'];
$checks = 0;
function check(bool $condition, string $label): void {
    global $checks;
    if (!$condition) throw new RuntimeException($label);
    $checks++;
}
function rejects(callable $fn, string $type): void {
    try { $fn(); } catch (Throwable $e) { check($e instanceof $type, 'wrong exception: ' . get_class($e)); return; }
    throw new RuntimeException('Expected rejection');
}
try {
    $lead = lead_validate($form, $cfg, $now);
    check($lead['page'] === 'https://pitermebel.com/contacts/', 'URLs minimized');
    check($lead['consent_sha256'] === hash('sha256', $cfg['consent_text']), 'consent snapshot');
    foreach ([['consent' => 'false'], ['consent_version' => 'old'], ['website' => 'spam'],
        ['Телефон' => '123'], ['Телефон' => ['array']], ['Тип_мебели' => 'unknown'],
        ['submission_id' => '../../bad'], ['Пожелания' => str_repeat('a', 6001)],
        ['Ссылка_на_эскиз' => 'file:///private']] as $change) {
        rejects(fn() => lead_validate(array_replace($form, $change), $cfg, $now), InvalidArgumentException::class);
    }
    lead_enqueue($lead, $cfg, '192.0.2.1', $now);
    lead_enqueue($lead, $cfg, '192.0.2.1', $now);
    check(count(glob($dir . '/????????-*.json')) === 1, 'duplicate submission');
    rejects(fn() => lead_enqueue(array_replace($lead, ['message' => 'changed']), $cfg, '192.0.2.1', $now), InvalidArgumentException::class);
    $rate = file_get_contents($dir . '/rate.json');
    check(!str_contains($rate, '192.0.2.1') && !str_contains($rate, '70000000000'), 'HMAC rate storage');
    $result = lead_worker($cfg, fn() => false, $now);
    check($result['pending'] === 1 && $result['sent'] === 0, 'mail failure stays pending');
    check(is_file($dir . '/' . $lead['id'] . '.json'), 'mail failure keeps lead');
    $calls = 0;
    $send = function() use (&$calls) { $calls++; return true; };
    lead_worker($cfg, $send, $now + 1);
    check($calls === 0, 'retry backoff');
    lead_worker($cfg, $send, $now + 121);
    lead_worker($cfg, $send, $now + 300);
    check($calls === 1, 'sent mail not resent');
    for ($i = 2; $i <= 3; $i++) lead_enqueue(array_replace($lead, ['id' => sprintf('%08d-1111-4111-8111-111111111111', $i)]), $cfg, '192.0.2.1', $now);
    rejects(fn() => lead_enqueue(array_replace($lead, ['id' => '44444444-1111-4111-8111-111111111111']), $cfg, '192.0.2.1', $now), OverflowException::class);
    lead_worker($cfg, fn() => true, $now + 89 * 86400);
    check(count(glob($dir . '/????????-*.json')) === 0, 'expiry');
    check(lead_read($dir . '/rate.json') === [], 'rate expiry');
    $_SERVER['DOCUMENT_ROOT'] = $dir;
    rejects(fn() => lead_directory($cfg), RuntimeException::class);
    echo "$checks checks passed\n";
} finally {
    // Remove only files created in this test's randomly generated temp directory.
    if (is_dir($dir)) {
        foreach (glob($dir . '/*') as $path) if (is_file($path)) unlink($path);
        rmdir($dir);
    }
}
