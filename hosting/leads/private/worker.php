<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/core.php';
try {
    $result = lead_worker(lead_config(), 'lead_send', time());
    // Counts only: no phones, messages or addresses in job logs.
    echo json_encode($result) . PHP_EOL;
    exit($result['pending'] > 0 ? 1 : 0);
} catch (Throwable $e) { fwrite(STDERR, "Lead worker failed; check configuration and storage.\n"); exit(1); }
