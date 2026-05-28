import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildChatRequest,
  isAIConfigReady,
  normalizeBaseUrl,
  normalizeProviderBaseUrl,
  requestRemoteAI,
  resolveChatEndpoint,
  resolveProxyUrl
} from './aiClient.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ai client helpers', () => {
  it('normalizes OpenAI-compatible base URLs', () => {
    expect(normalizeBaseUrl('https://api.openai.com/v1/')).toBe('https://api.openai.com/v1');
    expect(normalizeBaseUrl(' https://example.com/api ')).toBe('https://example.com/api');
    expect(normalizeProviderBaseUrl('https://platform.deepseek.com')).toBe('https://api.deepseek.com');
    expect(resolveChatEndpoint('https://api.deepseek.com/v1/chat/completions')).toBe('https://api.deepseek.com/v1/chat/completions');
    expect(resolveProxyUrl({})).toContain('/api/chat');
  });

  it('requires endpoint, model and key before enabling remote AI', () => {
    expect(isAIConfigReady({ baseUrl: '', model: 'gpt-4.1', apiKey: 'k' })).toBe(false);
    expect(isAIConfigReady({ baseUrl: 'https://api.openai.com/v1', model: '', apiKey: 'k' })).toBe(false);
    expect(isAIConfigReady({ baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1', apiKey: '' })).toBe(false);
    expect(isAIConfigReady({ baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1', apiKey: 'k' })).toBe(true);
  });

  it('uses the built-in proxy URL when proxy transport is selected', () => {
    expect(isAIConfigReady({
      transport: 'proxy',
      proxyUrl: '',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4.1',
      apiKey: 'k'
    })).toBe(true);

    expect(isAIConfigReady({
      transport: 'proxy',
      proxyUrl: 'https://agent.example.com/api/chat',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4.1',
      apiKey: 'k'
    })).toBe(true);
  });

  it('builds a chat completion request with agent context and attachment summaries', () => {
    const body = buildChatRequest({
      model: 'gpt-4.1-mini',
      activeAgent: { name: '用户建模智能体' },
      conversation: [{ role: 'user', text: '我要投放净水器' }],
      missingLabels: ['产品素材', '投放渠道'],
      attachments: [{ name: 'banner.png', type: 'image/png', size: 2048 }],
      userText: '补充：主打家庭健康'
    });

    expect(body.model).toBe('gpt-4.1-mini');
    expect(body.messages[0].role).toBe('system');
    expect(body.messages.at(-1).content).toContain('当前智能体：用户建模智能体');
    expect(body.messages.at(-1).content).toContain('banner.png');
    expect(body.temperature).toBeLessThanOrEqual(0.7);
  });

  it('posts to the configured proxy instead of the model domain in proxy mode', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '代理返回成功' } }] })
    });
    vi.stubGlobal('fetch', fetchMock);

    const reply = await requestRemoteAI({
      transport: 'proxy',
      proxyUrl: 'https://agent.example.com/api/chat',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4.1-mini',
      apiKey: 'sk-test'
    }, { model: 'gpt-4.1-mini', messages: [] });

    expect(reply).toBe('代理返回成功');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://agent.example.com/api/chat');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      requestBody: { model: 'gpt-4.1-mini', messages: [] }
    });
  });

  it('explains browser CORS failures in direct mode', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(requestRemoteAI({
      transport: 'direct',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4.1-mini',
      apiKey: 'sk-test'
    }, { model: 'gpt-4.1-mini', messages: [] })).rejects.toThrow('跨域');
  });
});
