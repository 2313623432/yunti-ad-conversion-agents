import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  Cpu,
  FileImage,
  Film,
  Gauge,
  KeyRound,
  MessageCircle,
  Paperclip,
  Pause,
  Play,
  Radar,
  RotateCcw,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
  X,
  Zap
} from 'lucide-react';
import { buildChatRequest, isAIConfigReady, requestRemoteAI, summarizeAttachment } from './aiClient.js';
import { analyzeBrief, createLaunchPlan, getActiveAgent, inferMaterialType, REQUIRED_FIELDS } from './agentLogic.js';
import './styles.css';

const reviewTrend = [
  { day: '05-20', roi: 3.1, leads: 164, spend: 3.8 },
  { day: '05-21', roi: 3.6, leads: 188, spend: 4.2 },
  { day: '05-22', roi: 3.4, leads: 176, spend: 4.0 },
  { day: '05-23', roi: 4.2, leads: 241, spend: 5.3 },
  { day: '05-24', roi: 4.6, leads: 286, spend: 6.1 },
  { day: '05-25', roi: 5.1, leads: 320, spend: 6.8 },
  { day: '05-26', roi: 5.3, leads: 346, spend: 7.2 }
];

const userFeatureData = [
  { name: '高意向家庭', value: 42, color: '#40f5c8' },
  { name: '价格敏感', value: 27, color: '#7aa7ff' },
  { name: '复购潜力', value: 18, color: '#fbbf24' },
  { name: '流失风险', value: 13, color: '#fb7185' }
];

const channelData = [
  { name: '微信', value: 416 },
  { name: '电话', value: 192 },
  { name: '邮箱', value: 133 },
  { name: 'App', value: 531 }
];

const materialRank = [
  ['厨房窄柜场景主图', 'CTR 10.9%', '+18%'],
  ['60 元券利益点海报', 'CVR 15.6%', '+11%'],
  ['安装过程短视频', '咨询率 8.2%', '+9%']
];

const funnelRows = [
  ['曝光', '34.7 万', '100%'],
  ['点击', '3.05 万', '8.79%'],
  ['咨询', '4,830', '15.8%'],
  ['下单', '1,220', '25.3%'],
  ['支付', '894', '73.2%']
];

const audienceMatrix = [
  ['高意向家庭', '微信销售', '18.6%', '优先'],
  ['价格敏感', '优惠券素材', '15.4%', '放量'],
  ['复购潜力', '邮箱 + 微信', '9.8%', '召回'],
  ['流失风险', '电话回访', '6.1%', '降频']
];

const diagnostics = [
  ['预算节奏', '今日消耗 68%，未超速', '稳定'],
  ['转化成本', '线索成本 ¥42.3，低于目标 11%', '良好'],
  ['素材疲劳', '主图 A 频次 5.8，建议替换', '预警'],
  ['人群重叠', '微信与 App 重叠 18%', '可控']
];

const initialCampaigns = [
  {
    id: 'RUN-618',
    title: '618 新客线索加速',
    status: '投放中',
    goal: '获取线索',
    channels: ['微信销售', 'App 内广告'],
    spend: 31420,
    budget: 80000,
    roi: 5.3,
    leads: 932,
    insight: '高意向家庭用户进入微信销售后，成交率比电话渠道高 21%。'
  },
  {
    id: 'RUN-RET',
    title: '老客复购召回',
    status: '投放中',
    goal: '提升复购',
    channels: ['邮箱', '微信销售'],
    spend: 9860,
    budget: 36000,
    roi: 3.8,
    leads: 278,
    insight: '价格敏感用户对优惠券素材响应更高，建议保留 60 元券版本。'
  },
  {
    id: 'HIS-Q2',
    title: '高客单价咨询转化复盘',
    status: '已结束',
    goal: '促进成交',
    channels: ['电话销售', '微信销售'],
    spend: 52200,
    budget: 52000,
    roi: 4.6,
    leads: 611,
    insight: '电话首句提及免费评估后，平均通话时长提升 34%。'
  }
];

const quickPrompts = [
  '推广智能净水器，目标促进成交，有图片和视频素材，投微信销售和 App 内广告，点击后加微信私聊。',
  '帮我做老客复购召回，产品是会员礼包，有海报和详情页，渠道用邮箱和微信，点击后领取优惠券。',
  '我还没有素材，先帮我列出要准备哪些素材和信息。'
];

const agentRoster = [
  {
    name: '用户建模智能体',
    color: 'green',
    description: '识别产品、人群与缺失信息'
  },
  {
    name: '广告匹配与 AI 销售智能体',
    color: 'orange',
    description: '生成素材、渠道与话术方案'
  },
  {
    name: '数据分析与系统迭代智能体',
    color: 'blue',
    description: '复盘数据并推动策略迭代'
  }
];

const starterMessages = [
  {
    role: 'agent',
    agent: '用户建模智能体',
    text: '我会先补齐投放必填信息，再生成待确认方案。你可以直接描述产品和目标，也可以先把素材附加到输入框里。'
  },
  {
    role: 'agent',
    agent: '用户建模智能体',
    text: REQUIRED_FIELDS[0].question
  }
];

const money = new Intl.NumberFormat('zh-CN');

function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [brief, setBrief] = useState({ rawText: '' });
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(initialCampaigns[0]);
  const [toast, setToast] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    useRemote: false,
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4.1-mini',
    apiKey: ''
  });
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  const analysis = useMemo(() => analyzeBrief('', { ...brief, materials }), [brief, materials]);
  const completion = Math.round(((REQUIRED_FIELDS.length - analysis.missing.length) / REQUIRED_FIELDS.length) * 100);
  const activeAgent = getActiveAgent(analysis);
  const reviewAgent = getActiveAgent(analysis, 'review');
  const missingLabels = REQUIRED_FIELDS.filter((field) => analysis.missing.includes(field.key)).map((field) => field.label);

  const pushMessages = (nextMessages) => {
    setMessages((current) => [...current, ...nextMessages]);
    window.setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 2600);
  };

  const addFiles = (files) => {
    const list = Array.from(files || []).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      materialType: inferMaterialType(file),
      preview: file.type?.startsWith('image/') ? URL.createObjectURL(file) : ''
    }));
    setPendingAttachments((current) => [...current, ...list]);
  };

  const removeAttachment = (id) => {
    setPendingAttachments((current) => current.filter((file) => file.id !== id));
  };

  const createLocalAgentReply = (nextAnalysis) => {
    if (nextAnalysis.ready) return '信息已经齐了，我会用广告匹配与 AI 销售智能体生成投放方案，并等待你二次确认。';
    return nextAnalysis.nextQuestion;
  };

  const getRemoteReply = async ({ nextAnalysis, userText, attachments }) => {
    if (!aiConfig.useRemote || !isAIConfigReady(aiConfig)) return '';
    const body = buildChatRequest({
      model: aiConfig.model,
      activeAgent: getActiveAgent(nextAnalysis),
      conversation: messages,
      missingLabels,
      attachments,
      userText
    });
    return requestRemoteAI(aiConfig, body);
  };

  const submitBrief = async (overrideText = input) => {
    const value = overrideText.trim();
    const attachments = pendingAttachments;
    if (!value && attachments.length === 0) return;

    const attachmentMaterials = attachments.map((file) => file.materialType).filter(Boolean);
    const nextMaterials = [...new Set([...materials, ...attachmentMaterials])];
    const attachmentText = attachmentMaterials.length ? `\n本次已附加素材：${attachmentMaterials.join('、')}` : '';
    const next = analyzeBrief(`${value}${attachmentText}`, { ...brief, materials: nextMaterials });

    setBrief(next.extracted);
    setMaterials(nextMaterials);
    setInput('');
    setPendingAttachments([]);
    pushMessages([{ role: 'user', text: value || '已附加素材，请继续分析。', attachments }]);
    setIsThinking(true);

    try {
      const remoteReply = await getRemoteReply({ nextAnalysis: next, userText: value, attachments });
      const replyText = remoteReply || createLocalAgentReply(next);
      pushMessages([{ role: 'agent', agent: getActiveAgent(next).name, text: replyText }]);
    } catch (error) {
      pushMessages([{ role: 'agent', agent: getActiveAgent(next).name, text: `${createLocalAgentReply(next)}\n\n真实 AI 暂时连接失败，已先使用本地智能体逻辑继续：${error.message}` }]);
    } finally {
      setIsThinking(false);
    }

    if (next.ready) {
      const plan = createLaunchPlan(next.extracted);
      setPendingPlan(plan);
      window.setTimeout(() => {
        pushMessages([{ role: 'agent', agent: '广告匹配与 AI 销售智能体', type: 'plan', text: '这是待确认投放方案，确认后才会开始投放。', plan }]);
      }, 200);
    }
  };

  const confirmLaunch = () => {
    if (!pendingPlan) return;
    const newCampaign = {
      id: `RUN-AI-${campaigns.length + 1}`,
      title: pendingPlan.title,
      status: '投放中',
      goal: brief.goal,
      channels: pendingPlan.channels,
      spend: 0,
      budget: pendingPlan.budgetSuggestion,
      roi: 0,
      leads: 0,
      insight: '新计划进入学习期，系统将在 2 小时后生成第一轮复盘。'
    };
    setCampaigns((current) => [newCampaign, ...current]);
    setSelectedCampaign(newCampaign);
    setPendingPlan(null);
    pushMessages([{ role: 'agent', agent: reviewAgent.name, type: 'success', text: `已确认，${newCampaign.title} 已开始投放。右侧复盘区会持续更新人群、素材、渠道和 ROI 变化。` }]);
    showToast('投放已开始，复盘区已加入新任务。');
  };

  const toggleCampaign = (id) => {
    setCampaigns((current) => current.map((campaign) => {
      if (campaign.id !== id || campaign.status === '已结束') return campaign;
      const status = campaign.status === '投放中' ? '已暂停' : '投放中';
      if (selectedCampaign.id === id) setSelectedCampaign({ ...campaign, status });
      return { ...campaign, status };
    }));
  };

  const resetConversation = () => {
    setMessages(starterMessages);
    setBrief({ rawText: '' });
    setMaterials([]);
    setPendingAttachments([]);
    setPendingPlan(null);
    setInput('');
  };

  return (
    <main className="command-center">
      <section className="conversation-core">
        <header className="top-dock">
          <div className="brand-lockup">
            <strong>云梯科技</strong>
            <span>YUN TI TECHNOLOGY</span>
          </div>
          <div className="dock-status">
            <div className={`agent-status ${activeAgent.tone}`}><span />{activeAgent.name}</div>
            <button className="config-trigger" onClick={() => setShowConfig((value) => !value)}><Settings2 size={16} />模型配置</button>
          </div>
        </header>

        <div className="mission-strip">
          <div>
            <p>云梯投放 Agent</p>
            <h1>从一句话到确认投放</h1>
          </div>
          <div className="mission-metrics">
            <Kpi label="信息完整度" value={`${completion}%`} />
            <Kpi label="待补信息" value={missingLabels.length ? `${missingLabels.length} 项` : '已齐'} />
            <Kpi label="AI 模式" value={aiConfig.useRemote && isAIConfigReady(aiConfig) ? '真实 AI' : '本地模拟'} />
          </div>
        </div>

        <AgentRail activeAgent={activeAgent} />

        {showConfig && <ModelConfig config={aiConfig} setConfig={setAiConfig} />}

        <section className="chat-window">
          <div className="message-list" ref={scrollRef}>
            {messages.map((message, index) => <Message key={`${message.role}-${index}`} message={message} onConfirm={confirmLaunch} />)}
            {isThinking && <Thinking agent={activeAgent.name} />}
          </div>

          <div className="composer-console">
            <div className="composer-topline">
              <div className="required-track">
                {REQUIRED_FIELDS.map((field) => {
                  const value = analysis.extracted[field.key];
                  const done = Array.isArray(value) ? value.length > 0 : Boolean(value);
                  return <Requirement key={field.key} label={field.label} done={done} />;
                })}
              </div>
              <button className="reset-btn" onClick={resetConversation}><RotateCcw size={14} />重置</button>
            </div>

            {pendingAttachments.length > 0 && (
              <div className="attachment-tray">
                {pendingAttachments.map((file) => <AttachmentChip key={file.id} file={file} onRemove={() => removeAttachment(file.id)} />)}
              </div>
            )}

            <div className="prompt-chips">
              {quickPrompts.map((prompt) => <button key={prompt} onClick={() => submitBrief(prompt)}>{prompt}</button>)}
            </div>

            <label className="input-shell">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="描述投放需求，也可以先上传素材再补充说明。例如：这是新品净水器素材，想投微信和 App，点击后加微信私聊..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitBrief();
                  }
                }}
              />
              <div className="input-actions">
                <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf" onChange={(event) => addFiles(event.target.files)} />
                <button className="attach-btn" onClick={() => fileRef.current?.click()}><Paperclip size={18} /></button>
                <button className="send-btn" onClick={() => submitBrief()}><Send size={18} /></button>
              </div>
            </label>
          </div>
        </section>
      </section>

      <aside className="insight-panel">
        <PanelHeader title="实时复盘" subtitle="数据分析与系统迭代智能体" icon={Gauge} />
        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              active={selectedCampaign.id === campaign.id}
              onSelect={() => setSelectedCampaign(campaign)}
              onToggle={() => toggleCampaign(campaign.id)}
            />
          ))}
        </div>

        <section className="data-card selected-review">
          <div className="review-head">
            <div>
              <p>{selectedCampaign.status}</p>
              <h2>{selectedCampaign.title}</h2>
            </div>
            <StatusBadge status={selectedCampaign.status} />
          </div>
          <div className="kpi-grid">
            <Kpi label="消耗" value={`¥${money.format(selectedCampaign.spend)}`} />
            <Kpi label="预算" value={`¥${money.format(selectedCampaign.budget)}`} />
            <Kpi label="ROI" value={selectedCampaign.roi || '学习中'} />
            <Kpi label="线索" value={selectedCampaign.leads || '生成中'} />
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewTrend}>
                <defs>
                  <linearGradient id="roiGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#40f5c8" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="#40f5c8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip />
                <Area dataKey="roi" stroke="#40f5c8" fill="url(#roiGlow)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="insight-box"><Sparkles size={16} />{selectedCampaign.insight}</div>
        </section>

        <section className="data-card">
          <PanelHeader title="用户特征" subtitle="高价值人群拆解" icon={Users} />
          <div className="feature-layout">
            <div className="pie-shell">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userFeatureData} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62}>
                    {userFeatureData.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="feature-list">
              {userFeatureData.map((item) => <FeatureRow key={item.name} item={item} />)}
            </div>
          </div>
          <div className="micro-grid">
            <span>城市：杭州 32%</span>
            <span>设备：iOS 58%</span>
            <span>年龄：28-45</span>
            <span>兴趣：家电/健康</span>
          </div>
        </section>

        <section className="data-card">
          <PanelHeader title="渠道与素材" subtitle="线索贡献 / 素材排行" icon={Radar} />
          <div className="bar-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="name" stroke="#7f8ea3" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#7aa7ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rank-list">
            {materialRank.map((row) => <div key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em></div>)}
          </div>
        </section>

        <section className="data-card">
          <PanelHeader title="转化漏斗" subtitle="曝光到支付的全链路" icon={Activity} />
          <div className="funnel-list">
            {funnelRows.map((row, index) => <FunnelRow key={row[0]} row={row} index={index} />)}
          </div>
        </section>

        <section className="data-card">
          <PanelHeader title="人群策略矩阵" subtitle="用户特征 × 触达方式 × CVR" icon={Users} />
          <div className="matrix-table">
            {audienceMatrix.map((row) => <div key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em><strong>{row[3]}</strong></div>)}
          </div>
        </section>

        <section className="data-card">
          <PanelHeader title="预算与策略诊断" subtitle="系统迭代智能体自动巡检" icon={Gauge} />
          <div className="diagnostic-list">
            {diagnostics.map((row) => <div key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em></div>)}
          </div>
        </section>
      </aside>

      {toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}
    </main>
  );
}

function ModelConfig({ config, setConfig }) {
  return (
    <section className="model-config">
      <div className="config-title"><KeyRound size={16} />真实 AI 接入配置</div>
      <label><span>启用真实 AI</span><input type="checkbox" checked={config.useRemote} onChange={(event) => setConfig((current) => ({ ...current, useRemote: event.target.checked }))} /></label>
      <label><span>接口地址</span><input value={config.baseUrl} onChange={(event) => setConfig((current) => ({ ...current, baseUrl: event.target.value }))} placeholder="https://api.openai.com/v1" /></label>
      <label><span>模型</span><input value={config.model} onChange={(event) => setConfig((current) => ({ ...current, model: event.target.value }))} placeholder="gpt-4.1-mini" /></label>
      <label><span>API Key</span><input type="password" value={config.apiKey} onChange={(event) => setConfig((current) => ({ ...current, apiKey: event.target.value }))} placeholder="只保存在当前页面状态中" /></label>
      <p>浏览器直连第三方接口可能遇到 CORS；生产环境建议走自己的后端代理。</p>
    </section>
  );
}

function AgentRail({ activeAgent }) {
  return (
    <section className="agent-rail">
      {agentRoster.map((agent) => (
        <div className={`agent-mini ${agent.color} ${activeAgent.name === agent.name ? 'active' : ''}`} key={agent.name}>
          <Bot size={16} />
          <div>
            <strong>{agent.name}</strong>
            <span>{agent.description}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function Requirement({ label, done }) {
  return <div className={`requirement ${done ? 'done' : ''}`}>{done ? <CheckCircle2 size={13} /> : <ChevronDown size={13} />}<span>{label}</span></div>;
}

function Message({ message, onConfirm }) {
  return (
    <article className={`message ${message.role} ${message.type || ''}`}>
      <div className="avatar">{message.role === 'agent' ? <Bot size={17} /> : <MessageCircle size={17} />}</div>
      <div className="bubble">
        {message.agent && <div className="agent-badge">{message.agent}</div>}
        <p>{message.text}</p>
        {message.attachments?.length > 0 && <div className="message-attachments">{message.attachments.map((file) => <AttachmentPreview key={file.id} file={file} />)}</div>}
        {message.plan && <PlanCard plan={message.plan} onConfirm={onConfirm} />}
      </div>
    </article>
  );
}

function Thinking({ agent }) {
  return (
    <article className="message agent thinking">
      <div className="avatar"><Cpu size={17} /></div>
      <div className="bubble"><div className="agent-badge">{agent}</div><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
    </article>
  );
}

function PlanCard({ plan, onConfirm }) {
  return (
    <div className="plan-card">
      <div className="plan-head">
        <div>
          <span>{plan.status}</span>
          <h3>{plan.title}</h3>
        </div>
        <ShieldCheck size={22} />
      </div>
      <div className="plan-grid">
        <Kpi label="建议预算" value={`¥${money.format(plan.budgetSuggestion)}`} />
        <Kpi label="预计曝光" value={plan.forecast.impressions} />
        <Kpi label="预计转化" value={plan.forecast.conversions} />
        <Kpi label="预计 ROI" value={plan.forecast.roi} />
      </div>
      <ul>{plan.steps.map((step) => <li key={step}>{step}</li>)}</ul>
      <div className="plan-actions">
        <button onClick={onConfirm}><Zap size={16} /> {plan.confirmButton}</button>
        <button className="ghost"><AlertTriangle size={16} />继续修改</button>
      </div>
    </div>
  );
}

function AttachmentChip({ file, onRemove }) {
  return (
    <div className="attachment-chip">
      {file.preview ? <img src={file.preview} alt="" /> : <UploadCloud size={16} />}
      <span>{summarizeAttachment(file)}</span>
      <button onClick={onRemove}><X size={14} /></button>
    </div>
  );
}

function AttachmentPreview({ file }) {
  return <div className="attachment-preview">{file.preview ? <img src={file.preview} alt="" /> : <UploadCloud size={16} />}<span>{file.name}</span></div>;
}

function CampaignCard({ campaign, active, onSelect, onToggle }) {
  const running = campaign.status === '投放中';
  return (
    <article className={`campaign-card ${active ? 'active' : ''}`} onClick={onSelect}>
      <div>
        <StatusBadge status={campaign.status} />
        <h3>{campaign.title}</h3>
        <p>{campaign.goal} · {campaign.channels.join(' / ')}</p>
      </div>
      {campaign.status !== '已结束' && (
        <button className="pause-btn" onClick={(event) => { event.stopPropagation(); onToggle(); }}>
          {running ? <Pause size={14} /> : <Play size={14} />}
        </button>
      )}
    </article>
  );
}

function StatusBadge({ status }) {
  return <span className={`status ${status === '投放中' ? 'running' : status === '已暂停' ? 'paused' : 'ended'}`}>{status}</span>;
}

function PanelHeader({ title, subtitle, icon: Icon }) {
  return <div className="panel-header"><Icon size={16} /><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

function FeatureRow({ item }) {
  return <div className="feature-row"><span style={{ background: item.color }} /><b>{item.name}</b><em>{item.value}%</em></div>;
}

function FunnelRow({ row, index }) {
  const width = [100, 72, 46, 30, 22][index];
  return (
    <div className="funnel-row">
      <div><b>{row[0]}</b><span>{row[1]}</span></div>
      <div className="funnel-track"><i style={{ width: `${width}%` }} /></div>
      <em>{row[2]}</em>
    </div>
  );
}

function Kpi({ label, value }) {
  return <div className="kpi"><span>{label}</span><strong>{value}</strong></div>;
}

createRoot(document.getElementById('root')).render(<App />);
