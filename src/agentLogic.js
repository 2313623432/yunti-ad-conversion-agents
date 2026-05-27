export const REQUIRED_FIELDS = [
  {
    key: 'productIntro',
    label: '产品介绍',
    question: '请先用一句话介绍你要推广的产品：它是什么、卖点是什么、客单价大概多少？'
  },
  {
    key: 'materials',
    label: '产品素材',
    question: '请上传或说明你已有的素材类型：图片、视频、落地页、商品详情页都可以。'
  },
  {
    key: 'goal',
    label: '投放目标',
    question: '这次投放的目标是什么：提升点击、获取线索、促进成交、召回老用户，还是提升复购？'
  },
  {
    key: 'interaction',
    label: '转化交互',
    question: '用户点击广告后希望发生什么交互：加微信、电话回访、填写表单、App 内下单，还是邮件咨询？'
  },
  {
    key: 'channels',
    label: '投放渠道',
    question: '希望投放到哪些渠道：微信销售、电话销售、邮箱、App 内广告？'
  }
];

const goalPatterns = [
  ['获取线索', ['线索', '留资', '咨询', '获客']],
  ['促进成交', ['成交', '下单', '购买', '转化', '卖货']],
  ['提升点击', ['点击', '访问', '流量', '浏览']],
  ['召回老用户', ['召回', '老用户', '沉默', '流失']],
  ['提升复购', ['复购', '再次购买', '老客']]
];

const channelPatterns = [
  ['微信销售', ['微信', '私域', '加微']],
  ['电话销售', ['电话', '外呼', '回访']],
  ['邮箱', ['邮箱', '邮件', 'email']],
  ['App 内广告', ['app', 'App', 'APP', '应用内', '站内']]
];

const materialPatterns = [
  ['图片', ['图片', '海报', '主图', 'banner', 'Banner']],
  ['视频', ['视频', '短视频', '剪辑']],
  ['落地页', ['落地页', '网页', '链接', '详情页']],
  ['PDF', ['pdf', 'PDF', '文档']]
];

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function analyzeBrief(text, existing = {}) {
  const source = `${existing.rawText || ''}\n${text || ''}`.trim();
  const extracted = {
    productIntro: existing.productIntro || '',
    materials: existing.materials || [],
    goal: existing.goal || '',
    interaction: existing.interaction || '',
    channels: existing.channels || [],
    rawText: source
  };

  if (source) {
    if (!extracted.productIntro && /(产品|推广|卖|广告|净水器|课程|软件|服务|门店|品牌)/i.test(source)) {
      extracted.productIntro = source.split(/[。！？\n]/).find(Boolean)?.slice(0, 88) || source.slice(0, 88);
    }

    const materials = materialPatterns.filter(([, words]) => hasAny(source, words)).map(([label]) => label);
    extracted.materials = unique([...extracted.materials, ...materials]);

    const matchedGoal = goalPatterns.find(([, words]) => hasAny(source, words));
    if (!extracted.goal && matchedGoal) extracted.goal = matchedGoal[0];

    const matchedChannels = channelPatterns.filter(([, words]) => hasAny(source, words)).map(([label]) => label);
    extracted.channels = unique([...extracted.channels, ...matchedChannels]);

    const interactionMatch = source.match(/(加微信|微信私聊|电话回访|填写表单|表单留资|App 内下单|APP内下单|邮件咨询|私信咨询|在线咨询)/i);
    if (!extracted.interaction && interactionMatch) extracted.interaction = interactionMatch[0];
  }

  const missing = REQUIRED_FIELDS
    .filter((field) => {
      const value = extracted[field.key];
      return Array.isArray(value) ? value.length === 0 : !value;
    })
    .map((field) => field.key);

  return {
    ready: missing.length === 0,
    extracted,
    missing,
    questions: REQUIRED_FIELDS.filter((field) => missing.includes(field.key)).map((field) => field.question),
    nextQuestion: REQUIRED_FIELDS.find((field) => missing.includes(field.key))?.question || ''
  };
}

export function createLaunchPlan(extracted) {
  return {
    status: '等待二次确认',
    title: `${extracted.goal || '智能投放'} · ${extracted.productIntro || '未命名产品'}`.slice(0, 48),
    channels: extracted.channels || [],
    materials: extracted.materials || [],
    interaction: extracted.interaction,
    steps: [
      `解析产品：${extracted.productIntro}`,
      `匹配素材：${(extracted.materials || []).join('、')}`,
      `生成渠道策略：${(extracted.channels || []).join('、')}`,
      `设置交互路径：${extracted.interaction}`,
      '进入二次确认，确认后才会开始投放'
    ],
    budgetSuggestion: 52000,
    forecast: {
      impressions: '42.6 万',
      clicks: '31,800',
      conversions: '1,260',
      roi: '4.8'
    },
    confirmButton: '确认并开始投放'
  };
}

export function getActiveAgent(analysis, phase = 'collecting') {
  if (phase === 'review') {
    return {
      name: '数据分析与系统迭代智能体',
      description: '监控投放数据、识别异常、生成优化建议与复盘结论。',
      tone: 'blue'
    };
  }

  if (analysis?.ready) {
    return {
      name: '广告匹配与 AI 销售智能体',
      description: '匹配广告素材、触达渠道、销售话术和二次确认方案。',
      tone: 'orange'
    };
  }

  return {
    name: '用户建模智能体',
    description: '理解产品、目标、素材、交互与渠道，补齐投放必填信息。',
    tone: 'green'
  };
}
