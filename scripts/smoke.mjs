import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

// Check the actual production build without contacting the private CMS.
const socket = createServer();
socket.listen(0, '127.0.0.1');
await once(socket, 'listening');
const port = socket.address().port;
await new Promise(resolve => socket.close(resolve));
const server = spawn(process.execPath, [
  'node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port),
], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NOTION_TOKEN: '', NOTION_DATABASE_ID: '', REVALIDATE_SECRET: '', NEXT_TELEMETRY_DISABLED: '1' },
});
let logs = '';
server.stdout.on('data', chunk => { logs += chunk; });
server.stderr.on('data', chunk => { logs += chunk; });
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let i = 0; i < 120; i++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${server.exitCode}`);
    try { ready = (await fetch(base, { signal: AbortSignal.timeout(1000) })).ok; } catch {}
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, 'production server must become ready');
  for (const path of ['/', '/posts', '/about', '/feed.xml', '/atom.xml', '/feed.json', '/robots.txt', '/sitemap.xml', '/llms.txt']) {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200, path);
    const body = await response.text();
    assert.ok(body.trim().length > 0, `${path} must have a body`);
    if (path === '/feed.json') assert.ok(Array.isArray(JSON.parse(body).items));
    if (path === '/sitemap.xml') assert.match(body, /<urlset/);
    if (path === '/about') assert.match(body, /Nature/);
    console.log(`PASS ${path}: 200`);
  }
  for (const [path, method] of [['/api/version', 'GET'], ['/api/revalidate', 'POST']]) {
    const response = await fetch(base + path, { method, signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 503, `${path} without CMS configuration`);
    assert.match(response.headers.get('content-type'), /json/);
    await response.json();
    console.log(`PASS ${method} ${path}: expected 503 without CMS configuration`);
  }
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  server.kill('SIGTERM');
  await Promise.race([once(server, 'exit'), delay(5000)]);
  if (server.exitCode === null) server.kill('SIGKILL');
}
