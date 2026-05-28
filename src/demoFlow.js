export function armLaunchConfirmation(plan) {
  return {
    ...plan,
    status: '等待最终确认',
    confirmState: 'armed',
    confirmButton: '二次确认并开始投放'
  };
}

export function createCampaignFromConfirmedPlan({ plan, brief, campaignsCount }) {
  if (plan?.confirmState !== 'armed') {
    throw new Error('需要二次确认后才能开始投放。');
  }

  return {
    id: `RUN-AI-${campaignsCount + 1}`,
    title: plan.title,
    status: '投放中',
    goal: brief.goal,
    channels: plan.channels,
    spend: 0,
    budget: plan.budgetSuggestion,
    roi: 0,
    leads: 0,
    insight: '新计划进入学习期，系统将在 2 小时后生成第一轮复盘。'
  };
}

export function createRevisionPrompt(plan) {
  const channels = plan?.channels?.length ? plan.channels.join('、') : '默认全选投放位置';
  return [
    '请修改这份投放方案：',
    `当前方案：${plan?.title || '未命名方案'}`,
    `当前投放位置：${channels}`,
    '你可以直接输入要调整的目标人群、预算、素材、话术、投放位置或转化交互。'
  ].join('\n');
}
