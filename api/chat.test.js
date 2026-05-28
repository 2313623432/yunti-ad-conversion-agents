import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from './chat.js';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end(payload = '') {
      this.body = payload;
      return this;
    }
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AI chat proxy', () => {
  it('answers CORS preflight requests', async () => {
    const req = { method: 'OPTIONS', headers: { origin: 'https://2313623432.github.io' } };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(204);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://2313623432.github.io');
    expect(res.headers['Access-Control-Allow-Methods']).toContain('POST');
  });

  it('forwards OpenAI-compatible chat requests from the proxy server', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: '模型可用' } }] })
    });
    vi.stubGlobal('fetch', fetchMock);

    const req = {
      method: 'POST',
      headers: { origin: 'https://2313623432.github.io' },
      body: {
        baseUrl: 'https://api.openai.com/v1/',
        apiKey: 'sk-test',
        requestBody: { model: 'gpt-4.1-mini', messages: [{ role: 'user', content: 'ping' }] }
      }
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.choices[0].message.content).toBe('模型可用');
    expect(fetchMock).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer sk-test' })
    }));
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://2313623432.github.io');
  });
});
