import { describe, expect, it } from 'vitest';
import { buildChatRequest, isAIConfigReady, normalizeBaseUrl } from './aiClient.js';

describe('ai client helpers', () => {
  it('normalizes OpenAI-compatible base URLs', () => {
    expect(normalizeBaseUrl('https://api.openai.com/v1/')).toBe('https://api.openai.com/v1');
    expect(normalizeBaseUrl(' https://example.com/api ')).toBe('https://example.com/api');
  });

  it('requires endpoint, model and key before enabling remote AI', () => {
    expect(isAIConfigReady({ baseUrl: '', model: 'gpt-4.1', apiKey: 'k' })).toBe(false);
    expect(isAIConfigReady({ baseUrl: 'https://api.openai.com/v1', model: '', apiKey: 'k' })).toBe(false);
    expect(isAIConfigReady({ baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1', apiKey: '' })).toBe(false);
    expect(isAIConfigReady({ baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1', apiKey: 'k' })).toBe(true);
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
});
