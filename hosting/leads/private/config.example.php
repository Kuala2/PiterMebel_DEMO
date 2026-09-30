<?php
// Copy to config.php on the hosting account, outside public_html.
return [
    'enabled' => false, // Enable after deployment, mail test and legal setup.
    'origins' => ['https://pitermebel.com', 'https://www.pitermebel.com'],
    'recipient' => 'piter.meb@yandex.ru',
    // Optional verified sender on this hosting account. Empty uses Exim's default.
    'sender' => '',
    'consent_version' => '2026-09-29',
    // Save the final published consent text here before activation.
    'consent_text' => '',
    'retention_days' => 90,
    'data_dir' => __DIR__ . '/data',
];
