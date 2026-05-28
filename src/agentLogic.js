export const REQUIRED_FIELDS = [
  {
    key: 'productIntro',
    label: '产品介绍',
    question: '先告诉我你要推广的产品是什么：核心卖点、价格区间、适合什么人群？'
  },
  {
    key: 'materials',
    label: '产品素材',
    question: '请把素材附加到输入框，或说明你已有的素材类型：图片、视频、落地页、PDF 都可以。'
  },
  {
    key: 'goal',
    label: '投放目标',
    question: '这次投放目标更偏向哪一个：提升点击、获取线索、促进成交、召回老用户、提升复购？'
  },
  {
    key: 'interaction',
    label: '转化交互',
    question: '用户点击广告后希望发生什么：加微信、电话回访、填写表单、App 内下单，还是邮件咨询？'
  },
  {
    key: 'channels',
    label: '投放位置',
    question: '投放位置默认全选电话 AI、微信 AI、App 内广告。你也可以指定只投其中某些位置，或额外加入邮箱。'
  }
];

export const DEFAULT_CHANNELS = ['电话 AI', '微信 AI', 'App 内广告'];

const goalPatterns = [
  ['获取线索', ['线索', '留资', '咨询', '获客']],
  ['促进成交', ['成交', '下单', '购买', '转化', '卖货']],
  ['提升点击', ['点击', '访问', '流量', '浏览']],
  ['召回老用户', ['召回', '老用户', '沉默', '流失']],
  ['提升复购', ['复购', '再次购买', '老客']]
];

const channelPatterns = [
  ['微信 AI', ['微信', '微信AI', '微信 AI', '私域', '加微']],
  ['电话 AI', ['电话', '电话AI', '电话 AI', '外呼', '回访']],
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

function hasChannelContext(text) {
  return /(渠道|投放位置|投放地方|触达位置|触达渠道|投放到|投到|投微信|投电话|投App|投 APP|走微信|走电话|走App|全选|全渠道|全部渠道|所有渠道|都投)/i.test(text);
}

function hasAllChannelsIntent(text) {
  return /(全选|全渠道|全部渠道|所有渠道|都投|一般全选|默认全选)/i.test(text);
}

export function inferMaterialType(file) {
  if (!file) return '';
  const type = file.type || '';
  const name = file.name || '';
  if (type.startsWith('image/')) return '图片';
  if (type.startsWith('video/')) return '视频';
  if (type.includes('pdf') || name.toLowerCase().endsWith('.pdf')) return 'PDF';
  return '素材文件';
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
    if (!extracted.productIntro && /(产品|推广|卖|广告|净水器|课程|软件|服务|门店|品牌|会员|礼包)/i.test(source)) {
      extracted.productIntro = source.split(/[。！？\n]/).find(Boolean)?.slice(0, 88) || source.slice(0, 88);
    }

    const materials = materialPatterns.filter(([, words]) => hasAny(source, words)).map(([label]) => label);
    extracted.materials = unique([...extracted.materials, ...materials]);

    const matchedGoal = goalPatterns.find(([, words]) => hasAny(source, words));
    if (!extracted.goal && matchedGoal) extracted.goal = matchedGoal[0];

    if (hasAllChannelsIntent(source)) {
      extracted.channels = DEFAULT_CHANNELS;
    } else if (hasChannelContext(source)) {
      const matchedChannels = channelPatterns.filter(([, words]) => hasAny(source, words)).map(([label]) => label);
      if (matchedChannels.length) extracted.channels = unique(matchedChannels);
    }

    const interactionMatch = source.match(/(加微信|微信私聊|电话回访|填写表单|表单留资|App 内下单|APP内下单|邮件咨询|私信咨询|在线咨询|领取优惠券)/i);
    if (!extracted.interaction && interactionMatch) extracted.interaction = interactionMatch[0];
  }

  if (!extracted.channels.length) extracted.channels = DEFAULT_CHANNELS;

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
  const channels = extracted.channels?.length ? extracted.channels : DEFAULT_CHANNELS;

  return {
    status: '等待二次确认',
    title: `${extracted.goal || '智能投放'} · ${extracted.productIntro || '未命名产品'}`.slice(0, 48),
    channels,
    materials: extracted.materials || [],
    interaction: extracted.interaction,
    steps: [
      `解析产品与目标人群：${extracted.productIntro}`,
      `匹配素材：${(extracted.materials || []).join('、')}`,
      `生成投放位置组合：${channels.join('、')}`,
      `设置转化交互：${extracted.interaction}`,
      '等待用户二次确认，确认后才会开始投放'
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
      description: '复盘投放数据、识别异常、生成优化建议。',
      tone: 'blue'
    };
  }

  if (analysis?.ready) {
    return {
      name: '广告匹配与 AI 销售智能体',
      description: '匹配素材、投放位置、销售话术和待确认方案。',
      tone: 'orange'
    };
  }

  return {
    name: '用户建模智能体',
    description: '理解产品、目标、素材、交互与投放位置，补齐投放信息。',
    tone: 'green'
  };
}
