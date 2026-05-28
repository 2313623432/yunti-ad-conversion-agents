import { describe, expect, it } from 'vitest';
import { armLaunchConfirmation, createCampaignFromConfirmedPlan, createRevisionPrompt } from './demoFlow.js';

const plan = {
  title: '促进成交 · 智能净水器',
  channels: ['电话 AI', '微信 AI', 'App 内广告'],
  budgetSuggestion: 52000
};

describe('demo launch flow', () => {
  it('arms a plan before it can be launched', () => {
    const armed = armLaunchConfirmation(plan);

    expect(armed.confirmState).toBe('armed');
    expect(armed.status).toBe('等待最终确认');
  });

  it('does not create a campaign until the plan is armed', () => {
    expect(() => createCampaignFromConfirmedPlan({
      plan,
      brief: { goal: '促进成交' },
      campaignsCount: 3
    })).toThrow('二次确认');
  });

  it('creates a running campaign from an armed plan', () => {
    const campaign = createCampaignFromConfirmedPlan({
      plan: armLaunchConfirmation(plan),
      brief: { goal: '促进成交' },
      campaignsCount: 3
    });

    expect(campaign.status).toBe('投放中');
    expect(campaign.channels).toEqual(['电话 AI', '微信 AI', 'App 内广告']);
    expect(campaign.id).toBe('RUN-AI-4');
  });

  it('creates an editable revision prompt from a plan', () => {
    expect(createRevisionPrompt(plan)).toContain('请修改这份投放方案');
    expect(createRevisionPrompt(plan)).toContain('电话 AI、微信 AI、App 内广告');
  });
});
