/**
 * Loaded with `node --import` ahead of scripts/fetch-news.mjs by main-path.test.mjs, so
 * the real run script executes offline. It replaces global fetch, which is the only way
 * the script reaches the outside world apart from git (and git is pointed at a local
 * bare repo by NEWS_REMOTE):
 *
 *   - feed URLs answer from MAIN_PATH_FEEDS (url -> body, or -> an HTTP status);
 *   - the model API answers with canned replies, and every prompt it is sent is appended
 *     to MAIN_PATH_LOG, so the test can read exactly what each model saw;
 *   - the live-site check is answered from the bare repo's own gh-pages;
 *   - any other request throws, which proves nothing else was contacted.
 */

import { readFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const routes = JSON.parse(readFileSync(process.env.MAIN_PATH_FEEDS, 'utf8'));
const json = (body) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });

function modelReply(prompt) {
  if (prompt.startsWith('You are a relevance filter')) {
    // Says yes to anything mentioning statehood. The newsletter's title mentions it too,
    // so if a newsletter ever reached this prompt it would be picked.
    const lines = prompt.split('Article titles:\n')[1].split('\n');
    const yes = lines.map((line) => line.match(/^(\d+): (.*)$/)).filter((m) => m && /statehood/i.test(m[2])).map((m) => Number(m[1]));
    return { kind: 'filter', text: JSON.stringify(yes) };
  }
  if (prompt.startsWith('You write a short neutral news-digest summary')) {
    return { kind: 'summary', text: 'A statehood bill moved forward in Congress as advocates and District officials pressed their case this week.\nCLOSER: laws' };
  }
  const verdicts = ['J1', 'J2', 'J3', 'J4'].map((criterion) => ({ criterion, pass: true, quote: null, why: 'supported' }));
  return { kind: 'judge', text: JSON.stringify({ verdicts, overall: 'pass' }) };
}

globalThis.fetch = async (input, init = {}) => {
  const url = String(input?.url ?? input);

  if (url.startsWith('https://api.anthropic.com/')) {
    const body = JSON.parse(typeof init.body === 'string' ? init.body : await new Response(init.body).text());
    const prompt = body.messages.map((m) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content))).join('\n');
    const reply = modelReply(prompt);
    appendFileSync(process.env.MAIN_PATH_LOG, `${JSON.stringify({ kind: reply.kind, model: body.model, prompt })}\n`);
    return json({
      id: 'msg_test',
      type: 'message',
      role: 'assistant',
      model: body.model,
      content: [{ type: 'text', text: reply.text }],
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: { input_tokens: 1, output_tokens: 1 },
    });
  }

  if (url.startsWith('https://www.representdc.org/api/news.json')) {
    const live = execFileSync('git', ['show', 'gh-pages:api/news.json'], { cwd: process.env.NEWS_REMOTE, encoding: 'utf8' });
    return new Response(live, { status: 200, headers: { 'content-type': 'application/json' } });
  }

  if (Object.hasOwn(routes, url)) {
    const reply = routes[url];
    return typeof reply === 'number' ? new Response('', { status: reply }) : new Response(reply, { status: 200 });
  }
  if (routes['*'] !== undefined && /^https:\/\//.test(url) && init?.headers?.['User-Agent']?.startsWith('RepresentDC News Aggregator')) {
    return new Response('', { status: routes['*'] });
  }
  throw new Error(`main-path test: unexpected network request to ${url}`);
};
