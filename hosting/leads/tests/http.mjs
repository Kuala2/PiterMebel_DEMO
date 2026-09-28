import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, writeFile, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

test('HTTP entry: CORS, multipart, durable acceptance, retries and worker outage', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'pitermebel-leads-http-'));
  let child;
  try {
    await cp('hosting/leads/private', path.join(dir, 'private'), { recursive: true, filter: p => !p.endsWith('/data') && !p.endsWith('config.php') });
    await cp('hosting/leads/public_html', path.join(dir, 'public_html'), { recursive: true });
    await mkdir(path.join(dir, 'private/data'));
    await writeFile(path.join(dir, 'private/config.php'), `<?php return [
      'enabled'=>true, 'origins'=>['https://pitermebel.com'],
      'recipient'=>'test@example.invalid', 'sender'=>'',
      'consent_version'=>'2026-09-27', 'consent_text'=>str_repeat('TEST consent. ',20),
      'retention_days'=>90, 'data_dir'=>__DIR__.'/data'];`);
    const portServer = createServer();
    portServer.listen(0, '127.0.0.1');
    await once(portServer, 'listening');
    const port = portServer.address().port;
    await new Promise(resolve => portServer.close(resolve));
    child = spawn(process.env.PHP_BINARY || 'php', ['-S', `127.0.0.1:${port}`, '-t', path.join(dir, 'public_html')], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('PHP startup timeout')), 5000);
      child.once('error', e => { clearTimeout(timer); reject(e); });
      child.stderr.on('data', chunk => {
        if (chunk.toString().includes('Development Server')) { clearTimeout(timer); resolve(); }
      });
      child.once('exit', code => { clearTimeout(timer); reject(new Error(`PHP exited: ${code}`)); });
    });
    const endpoint = `http://127.0.0.1:${port}/submit.php`;
    const origin = 'https://pitermebel.com';
    const options = await fetch(endpoint, { method: 'OPTIONS', headers: { Origin: origin } });
    assert.equal(options.status, 204);
    assert.equal(options.headers.get('access-control-allow-origin'), origin);
    const forbidden = await fetch(endpoint, { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } });
    assert.equal(forbidden.status, 403);
    assert.equal(forbidden.headers.get('access-control-allow-origin'), null);
    const form = new FormData();
    for (const [k, v] of Object.entries({
      submission_id: '11111111-1111-4111-8111-111111111111', 'Телефон': '+70000000000',
      'Тип мебели': 'Консультация', 'Пожелания': 'TEST only', 'Источник формы': 'Test',
      consent: 'true', consent_version: '2026-09-27', consent_document: '/consent/',
      'Страница': 'https://pitermebel.com/contacts/?private=yes',
    })) form.set(k, v);
    const post = () => fetch(endpoint, { method: 'POST', body: form, headers: { Origin: origin } });
    assert.equal((await post()).status, 503, 'No cron heartbeat must block');
    const heartbeat = path.join(dir, 'private/data/heartbeat');
    await writeFile(heartbeat, String(Math.floor(Date.now() / 1000)));
    const accepted = await post();
    assert.equal(accepted.status, 200);
    assert.deepEqual(await accepted.json(), { success: true });
    const record = JSON.parse(await readFile(path.join(dir, 'private/data/11111111-1111-4111-8111-111111111111.json')));
    assert.equal(record.category, 'Консультация');
    assert.equal(record.message, 'TEST only');
    assert.equal(record.page, 'https://pitermebel.com/contacts/');
    assert.equal(record.notified_at, null);
    assert.equal((await post()).status, 200);
    assert.equal((await readdir(path.join(dir, 'private/data'))).filter(f => /^[a-f0-9-]{36}\.json$/.test(f)).length, 1);
    form.set('consent', 'false');
    assert.equal((await post()).status, 400);
    form.set('consent', 'true');
    form.set('Пожелания', 'Changed under same ID');
    assert.equal((await post()).status, 400);
    await writeFile(heartbeat, '1');
    assert.equal((await post()).status, 503);
  } finally {
    if (child && child.exitCode === null) { child.kill(); await once(child, 'exit'); }
    // Only remove the directory created by mkdtemp above.
    await rm(dir, { recursive: true, force: true });
  }
});
