const envProxyUrl = import.meta.env?.VITE_AI_PROXY_URL || '';

export const DEFAULT_AI_PROXY_URL = envProxyUrl || 'https://yunti-ad-conversion-agents.vercel.app/api/chat';

export function normalizeBaseUrl(baseUrl = '') {
  return baseUrl.trim().replace(/\/+$/, '');
}

export function normalizeProviderBaseUrl(baseUrl = '') {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return '';

  try {
    const url = new URL(normalized);
    if (url.hostname === 'platform.deepseek.com') {
      return 'https://api.deepseek.com';
    }
  } catch {
    return normalized;
  }

  return normalized;
}

export function resolveChatEndpoint(baseUrl = '') {
  const normalized = normalizeProviderBaseUrl(baseUrl);
  if (!normalized) return '';
  return normalized.endsWith('/chat/completions') ? normalized : `${normalized}/chat/completions`;
}

export function resolveProxyUrl(config = {}) {
  return normalizeBaseUrl(config.proxyUrl || DEFAULT_AI_PROXY_URL);
}

export function isAIConfigReady(config = {}) {
  const hasModelTarget = Boolean(normalizeProviderBaseUrl(config.baseUrl) && config.model?.trim() && config.apiKey?.trim());
  if (config.transport === 'proxy') return Boolean(hasModelTarget && resolveProxyUrl(config));
  return hasModelTarget;
}

export function summarizeAttachment(file) {
  const sizeKb = Math.max(1, Math.round((file.size || 0) / 1024));
  return `${file.name}（${file.type || 'unknown'}，${sizeKb}KB）`;
}

export function buildChatRequest({ model, activeAgent, conversation, missingLabels, attachments, userText }) {
  const recentConversation = conversation.slice(-10).map((message) => ({
    role: message.role === 'user' ? 'user' : 'assistant',
    content: message.text || ''
  }));

  const attachmentText = attachments?.length
    ? attachments.map(summarizeAttachment).join('；')
    : '无';

  return {
    model,
    temperature: 0.45,
    messages: [
      {
        role: 'system',
        content: [
          '你是云梯广告转化多智能体系统中的对话式广告投放 Agent。',
          '你需要像 Manus 一样以任务协作口吻推进：简洁、可执行、主动追问缺失信息。',
          '必须围绕三类智能体工作：用户建模智能体、广告匹配与 AI 销售智能体、数据分析与系统迭代智能体。',
          '信息齐全前不要声称已投放；信息齐全后生成待确认方案，并提醒用户二次确认。'
        ].join('\n')
      },
      ...recentConversation,
      {
        role: 'user',
        content: [
          `当前智能体：${activeAgent?.name || '用户建模智能体'}`,
          `仍缺信息：${missingLabels?.length ? missingLabels.join('、') : '无'}`,
          `本次用户输入：${userText || '无文字补充'}`,
          `本次附加素材：${attachmentText}`,
          '请用中文回复，最多 5 句话。'
        ].join('\n')
      }
    ]
  };
}

async function readErrorText(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json.error?.message || json.error || json.message || text;
  } catch {
    return text;
  }
}

function getResponseText(data) {
  return data?.choices?.[0]?.message?.content
    || data?.choices?.[0]?.text
    || data?.message
    || 'AI 已返回，但没有可展示的文本。';
}

export async function requestRemoteAI(config, requestBody) {
  const useProxy = config.transport === 'proxy';
  const endpoint = useProxy ? resolveProxyUrl(config) : resolveChatEndpoint(config.baseUrl);
  const fetchOptions = useProxy
    ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: normalizeProviderBaseUrl(config.baseUrl),
          apiKey: config.apiKey,
          requestBody
        })
      }
    : {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      };

  let response;
  try {
    response = await fetch(endpoint, fetchOptions);
  } catch (error) {
    if (!useProxy && error instanceof TypeError) {
      throw new Error('浏览器直连模型接口被跨域策略拦截。请切换到“代理模式”，通过自己的 /api/chat 接口请求模型。');
    }
    throw error;
  }

  if (!response.ok) {
    const text = await readErrorText(response);
    throw new Error(`AI 请求失败：${response.status} ${text.slice(0, 180)}`);
  }

  const data = await response.json();
  return getResponseText(data);
}
