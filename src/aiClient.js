export function normalizeBaseUrl(baseUrl = '') {
  return baseUrl.trim().replace(/\/+$/, '');
}

export function isAIConfigReady(config) {
  return Boolean(normalizeBaseUrl(config?.baseUrl) && config?.model?.trim() && config?.apiKey?.trim());
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

export async function requestRemoteAI(config, requestBody) {
  const endpoint = `${normalizeBaseUrl(config.baseUrl)}/chat/completions`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI 请求失败：${response.status} ${text.slice(0, 120)}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || 'AI 已返回，但没有可展示的文本。';
}
