import { describe, expect, it } from 'vitest';
import { analyzeBrief, createLaunchPlan, getActiveAgent, REQUIRED_FIELDS } from './agentLogic.js';

describe('ad launch agent logic', () => {
  it('asks follow-up questions when the user has not provided any required launch information', () => {
    const result = analyzeBrief('');

    expect(result.ready).toBe(false);
    expect(result.missing).toEqual(REQUIRED_FIELDS.map((field) => field.key));
    expect(result.questions).toContain('请先用一句话介绍你要推广的产品：它是什么、卖点是什么、客单价大概多少？');
  });

  it('extracts required launch signals from a natural language brief', () => {
    const result = analyzeBrief('我要给净水器投广告，目标是获取线索，素材有图片和视频，渠道走微信、电话和App内广告，用户点击后让AI先加微信沟通。');

    expect(result.ready).toBe(true);
    expect(result.extracted.productIntro).toContain('净水器');
    expect(result.extracted.materials).toEqual(['图片', '视频']);
    expect(result.extracted.goal).toBe('获取线索');
    expect(result.extracted.channels).toEqual(['微信销售', '电话销售', 'App 内广告']);
    expect(result.extracted.interaction).toContain('加微信');
  });

  it('creates a confirmation plan only after all required information exists', () => {
    const brief = analyzeBrief('产品是智能净水器，有图片和视频素材，目标促进成交，投微信销售和App内广告，用户点击后进入微信私聊。');
    const plan = createLaunchPlan(brief.extracted);

    expect(plan.status).toBe('等待二次确认');
    expect(plan.steps[0]).toContain('解析产品');
    expect(plan.channels).toEqual(['微信销售', 'App 内广告']);
    expect(plan.confirmButton).toBe('确认并开始投放');
  });

  it('selects the active agent according to the conversation phase', () => {
    const empty = analyzeBrief('');
    const ready = analyzeBrief('产品是智能净水器，有图片和视频素材，目标促进成交，投微信销售和App内广告，用户点击后进入微信私聊。');

    expect(getActiveAgent(empty).name).toBe('用户建模智能体');
    expect(getActiveAgent(ready).name).toBe('广告匹配与 AI 销售智能体');
    expect(getActiveAgent(ready, 'review').name).toBe('数据分析与系统迭代智能体');
  });
});
