import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { postDiscordWebhookWithRetry } from './discord';

describe('postDiscordWebhookWithRetry', () => {
  it('returns ok on first 204', async () => {
    const original = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return new Response(null, { status: 204 });
    };
    try {
      const result = await postDiscordWebhookWithRetry('https://discord.test/webhook', { content: 'x' }, {
        maxAttempts: 3,
        baseDelayMs: 1,
      });
      assert.equal(result.ok, true);
      assert.equal(calls, 1);
    } finally {
      globalThis.fetch = original;
    }
  });

  it('retries on 503 then succeeds', async () => {
    const original = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      if (calls < 3) return new Response('busy', { status: 503 });
      return new Response(null, { status: 204 });
    };
    try {
      const result = await postDiscordWebhookWithRetry('https://discord.test/webhook', { content: 'x' }, {
        maxAttempts: 5,
        baseDelayMs: 1,
      });
      assert.equal(result.ok, true);
      assert.equal(calls, 3);
    } finally {
      globalThis.fetch = original;
    }
  });
});
