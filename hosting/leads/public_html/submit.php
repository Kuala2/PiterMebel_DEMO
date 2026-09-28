<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

function respond(int $code, bool $success): never {
    http_response_code($code);
    echo json_encode(['success' => $success]);
    exit;
}

require dirname(__DIR__) . '/private/core.php';
try {
    $cfg = lead_config();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!in_array($origin, $cfg['origins'], true)) respond(403, false);
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, false);
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 24000 || $_FILES ||
        !str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'multipart/form-data;')) respond(400, false);
    $dir = lead_directory($cfg);
    $heartbeat = is_file($dir . '/heartbeat') ? (int)file_get_contents($dir . '/heartbeat') : 0;
    // Fail closed if scheduled delivery/expiry has stopped.
    if ($heartbeat < time() - 900) respond(503, false);
    $lead = lead_validate($_POST, $cfg, time());
    lead_enqueue($lead, $cfg, $_SERVER['REMOTE_ADDR'] ?? '', time());
    respond(200, true);
} catch (InvalidArgumentException $e) { respond(400, false);
} catch (OverflowException $e) { header('Retry-After: 600'); respond(429, false);
} catch (Throwable $e) { respond(503, false); }
