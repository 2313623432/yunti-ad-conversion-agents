import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Database,
  Eye,
  FileText,
  Gauge,
  Layers3,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  PhoneCall,
  Play,
  Plus,
  RefreshCcw,
  Route,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Target,
  UploadCloud,
  UserCheck,
  Users,
  Wallet,
  Wand2,
  X,
  Zap
} from 'lucide-react';
import './styles.css';

const navItems = [
  { key: 'dashboard', label: '工作台', icon: Gauge },
  { key: 'assets', label: '素材知识库', icon: Database },
  { key: 'launch', label: '新建投放', icon: Megaphone },
  { key: 'profiles', label: '用户画像', icon: Users },
  { key: 'sales', label: 'AI 销售', icon: Bot },
  { key: 'analytics', label: '数据分析', icon: BarChart3 },
  { key: 'optimize', label: '自动优化', icon: RefreshCcw },
  { key: 'billing', label: '充值账户', icon: Wallet },
  { key: 'settings', label: '系统设置', icon: Settings }
];

const channelRows = [
  { name: '微信销售', key: 'wechat', spend: 12840, ctr: 8.7, cvr: 14.2, roi: 3.9, leads: 416, color: '#11a37f', icon: MessageCircle },
  { name: '电话销售', key: 'phone', spend: 8620, ctr: 5.1, cvr: 18.6, roi: 4.6, leads: 192, color: '#2563eb', icon: PhoneCall },
  { name: '邮箱', key: 'mail', spend: 3180, ctr: 3.4, cvr: 6.9, roi: 2.1, leads: 133, color: '#d97706', icon: Mail },
  { name: 'App 内广告', key: 'app', spend: 15960, ctr: 10.9, cvr: 11.8, roi: 5.2, leads: 531, color: '#0891b2', icon: Smartphone }
];

const trendData = [
  { day: '05-20', exposure: 18.2, click: 1.32, conversion: 148, roi: 3.2 },
  { day: '05-21', exposure: 22.4, click: 1.71, conversion: 176, roi: 3.7 },
  { day: '05-22', exposure: 21.1, click: 1.66, conversion: 169, roi: 3.5 },
  { day: '05-23', exposure: 26.8, click: 2.18, conversion: 238, roi: 4.4 },
  { day: '05-24', exposure: 28.6, click: 2.43, conversion: 254, roi: 4.8 },
  { day: '05-25', exposure: 31.9, click: 2.72, conversion: 301, roi: 5.0 },
  { day: '05-26', exposure: 34.7, click: 3.05, conversion: 337, roi: 5.4 }
];

const initialCampaigns = [
  { id: 'AD-618-001', name: '618 新客线索加速计划', status: '运行中', budget: 80000, spent: 31420, roi: 5.4, owner: '广告匹配智能体', channel: '微信 + App' },
  { id: 'AD-RET-042', name: '老客复购优惠召回', status: '学习中', budget: 36000, spent: 9860, roi: 3.8, owner: '系统迭代智能体', channel: '邮箱 + 微信' },
  { id: 'AD-SALE-077', name: '高客单价咨询转化', status: '运行中', budget: 52000, spent: 18220, roi: 4.9, owner: 'AI 销售智能体', channel: '电话 + 微信' }
];

const initialAssets = [
  { id: 'MAT-2401', title: '智能净水器主图组', type: '图片/海报', status: '已解析', score: 92, tags: ['产品卖点', '健康人群', '领券', '微信优先'] },
  { id: 'MAT-2402', title: '私域成交电话脚本 V3', type: '销售话术', status: '生成中', score: 78, tags: ['异议处理', '价格敏感', '电话'] },
  { id: 'MAT-2403', title: '618 限时优惠落地页', type: '网页链接', status: '已解析', score: 88, tags: ['促销', '高意向', 'App 内广告'] },
  { id: 'MAT-2404', title: '产品安装 FAQ.pdf', type: 'FAQ/PDF', status: '待补充', score: 64, tags: ['售后疑问', '咨询转化', '邮箱'] }
];

const knowledgeRows = [
  { id: 'KB-2401', name: '高端家电知识库', type: '商品介绍 / FAQ / 安装政策', completeness: '93%', updated: '12 分钟前' },
  { id: 'KB-2402', name: '销售异议处理库', type: '电话脚本 / 微信追问 / 优惠边界', completeness: '88%', updated: '36 分钟前' },
  { id: 'KB-2403', name: '老客复购策略库', type: '复购周期 / 赠品策略 / 召回话术', completeness: '91%', updated: '2 小时前' }
];

const users = [
  { id: 'U-839204', phone: '138****4196', city: '杭州', device: 'iPhone 15', source: '微信广告', prob: 86, tags: ['高意向', '关注安装', '价格敏感'], stage: '咨询后未下单' },
  { id: 'U-762118', phone: '186****5827', city: '上海', device: 'Android', source: 'App 内广告', prob: 74, tags: ['复购潜力', '母婴家庭', '偏好优惠'], stage: '加购未支付' },
  { id: 'U-518673', phone: '151****0632', city: '成都', device: 'PC', source: '邮箱', prob: 58, tags: ['流失风险', '老用户', '售后关注'], stage: '30 天未访问' }
];

const salesTasks = [
  { channel: '微信消息任务', icon: MessageSquareText, total: 580, done: 416, deal: 63, stage: '优惠引导', owner: 'AI 销售智能体' },
  { channel: '电话外呼任务', icon: PhoneCall, total: 240, done: 156, deal: 41, stage: '需求确认', owner: '坐席协同 Agent' },
  { channel: '邮件任务', icon: Mail, total: 3200, done: 2710, deal: 77, stage: '初次触达', owner: '邮件生成 Agent' },
  { channel: 'App 内广告任务', icon: Smartphone, total: 7600, done: 6120, deal: 189, stage: '成交跟进', owner: '广告匹配智能体' }
];

const funnelData = [
  { value: 347000, name: '曝光', fill: '#0f766e' },
  { value: 30500, name: '点击', fill: '#0891b2' },
  { value: 4830, name: '咨询', fill: '#2563eb' },
  { value: 1220, name: '下单', fill: '#7c3aed' },
  { value: 894, name: '支付', fill: '#db2777' }
];

const defaultDraft = {
  goal: '促进成交',
  product: '智能净水器 X9',
  material: '618 主图素材组 C',
  kb: '高端家电销售知识库',
  offer: '满 3000 减 260 + 免费安装',
  audienceMode: 'AI 自动选择目标人群',
  filters: ['高意向用户', '价格敏感用户', '7 天内浏览详情页'],
  channels: {
    wechat: { enabled: true, budget: 18000, time: '09:30-21:00', limit: '每日 2 次' },
    phone: { enabled: true, budget: 9000, time: '10:00-19:00', limit: '每日 1 次' },
    mail: { enabled: false, budget: 4000, time: '08:30', limit: '每 3 天 1 次' },
    app: { enabled: true, budget: 24000, time: '全天智能投放', limit: '频控 4 次' }
  },
  budget: 55000,
  planVersion: 3
};

const currency = new Intl.NumberFormat('zh-CN');
const colors = ['#0f766e', '#2563eb', '#d97706', '#7c3aed', '#dc2626'];

function App() {
  const [page, setPage] = useState('dashboard');
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [assetList, setAssetList] = useState(initialAssets);
  const [balance, setBalance] = useState(126480);
  const [draft, setDraft] = useState(defaultDraft);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const toastTimer = useRef(null);
  const active = navItems.find((item) => item.key === page);

  const notify = (text, tone = 'success') => {
    window.clearTimeout(toastTimer.current);
    setToast({ text, tone, id: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const go = (key, step) => {
    setPage(key);
    if (Number.isInteger(step)) setWizardStep(step);
  };

  const openDrawer = (type, payload = {}) => setDrawer({ type, payload });

  const saveDraft = () => notify('草稿已保存，智能体将继续保留当前配置。');

  const regeneratePlan = () => {
    setDraft((current) => ({ ...current, planVersion: current.planVersion + 1 }));
    notify('AI 已重新生成投放方案，预算与渠道权重已更新。');
  };

  const launchCampaign = () => {
    const enabledChannels = Object.entries(draft.channels)
      .filter(([, value]) => value.enabled)
      .map(([key]) => channelRows.find((channel) => channel.key === key)?.name)
      .join(' + ');
    const newCampaign = {
      id: `AD-AI-${String(campaigns.length + 81).padStart(3, '0')}`,
      name: `${draft.goal} · ${draft.product}`,
      status: '运行中',
      budget: draft.budget,
      spent: 0,
      roi: 0,
      owner: '多智能体自动投放',
      channel: enabledChannels
    };
    setCampaigns((list) => [newCampaign, ...list]);
    setBalance((value) => Math.max(0, value - Math.min(draft.budget, 3000)));
    go('dashboard');
    notify('投放已创建并开始学习，新的计划已加入工作台。');
  };

  const addAsset = (asset) => {
    setAssetList((list) => [asset, ...list]);
    setDrawer(null);
    notify('素材已上传并进入 AI 解析队列。');
  };

  const recharge = (amount) => {
    setBalance((value) => value + amount);
    notify(`充值 ¥${currency.format(amount)} 已到账。`);
  };

  const runSearch = () => {
    openDrawer('search', { query: search.trim() || '高意向用户' });
  };

  const actions = {
    notify,
    go,
    openDrawer,
    saveDraft,
    regeneratePlan,
    launchCampaign,
    addAsset,
    recharge,
    setDraft
  };

  const pageNode = useMemo(() => {
    const shared = { actions, wizardStep, setWizardStep, selectedUser, setSelectedUser, campaigns, assetList, balance, draft };
    return {
      dashboard: <Dashboard {...shared} />,
      assets: <AssetsPage {...shared} />,
      launch: <LaunchPage {...shared} />,
      profiles: <ProfilesPage {...shared} />,
      sales: <SalesPage {...shared} />,
      analytics: <AnalyticsPage {...shared} />,
      optimize: <OptimizePage {...shared} />,
      billing: <BillingPage {...shared} />,
      settings: <SettingsPage {...shared} />
    }[page];
  }, [page, wizardStep, selectedUser, campaigns, assetList, balance, draft]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button className={`nav-item ${page === item.key ? 'active' : ''}`} key={item.key} onClick={() => go(item.key)}>
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button className="agent-card" onClick={() => openDrawer('agents')}>
          <BrainCircuit size={20} />
          <div>
            <strong>三智能体协同中</strong>
            <span>画像建模 · 广告匹配 · 迭代优化</span>
          </div>
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">云梯科技 · AI 广告转化平台</div>
            <h1>{active?.label}</h1>
          </div>
          <div className="top-actions">
            <label className="search">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && runSearch()} placeholder="搜索计划、用户、素材" />
            </label>
            <button className="icon-btn" title="搜索" onClick={runSearch}><ArrowRight size={18} /></button>
            <button className="icon-btn" title="通知" onClick={() => openDrawer('notifications')}><Bell size={18} /></button>
            <button className="status-pill" onClick={() => openDrawer('agents')}><Activity size={16} /> 自动投放运行中</button>
          </div>
        </header>
        {pageNode}
      </main>

      {drawer && <ActionDrawer drawer={drawer} onClose={() => setDrawer(null)} actions={actions} />}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark">云梯科技</div>
      <div className="logo-sub">YUN TI TECHNOLOGY</div>
    </div>
  );
}

function Dashboard({ actions, campaigns, balance }) {
  return (
    <div className="page-grid">
      <section className="command-bar">
        <CommandButton icon={Plus} title="新建投放" desc="从目标、人群、渠道生成方案" onClick={() => actions.go('launch', 0)} />
        <CommandButton icon={UploadCloud} title="上传素材" desc="素材入库并自动解析" onClick={() => actions.openDrawer('upload')} />
        <CommandButton icon={CreditCard} title="充值" desc="账户余额与消耗记录" onClick={() => actions.go('billing')} />
        <CommandButton icon={Wand2} title="查看优化建议" desc="采纳实验与自动调整" onClick={() => actions.go('optimize')} />
      </section>

      <section className="metrics-grid">
        <MetricCard label="账户余额" value={`¥${currency.format(balance)}`} delta="可支持约 5.8 天投放" icon={Wallet} tone="green" />
        <MetricCard label="今日消耗" value="¥40,600" delta="较昨日 +12.4%" icon={CircleDollarSign} />
        <MetricCard label="今日曝光" value="34.7 万" delta="覆盖 8 个重点城市" icon={Activity} />
        <MetricCard label="点击率 CTR" value="8.79%" delta="高于账户均值 1.8%" icon={Target} tone="blue" />
        <MetricCard label="转化率 CVR" value="11.05%" delta="微信销售贡献最高" icon={CheckCircle2} tone="green" />
        <MetricCard label="ROI" value="5.4" delta="目标 ROI 4.2" icon={BarChart3} tone="blue" />
      </section>

      <section className="two-col analytics-row">
        <div className="panel">
          <PanelHeader title="实时投放脉冲" desc="曝光、点击、转化与 ROI 的统一视图" action={<button onClick={() => actions.go('analytics')}>进入分析</button>} />
          <ChartBox height={302}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="exposure" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6edf5" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="exposure" stroke="#0f766e" fill="url(#exposure)" name="曝光 万" />
              <Line type="monotone" dataKey="roi" stroke="#2563eb" strokeWidth={2.4} name="ROI" />
            </AreaChart>
          </ChartBox>
        </div>
        <div className="panel ai-panel">
          <PanelHeader title="AI 今日优化建议" desc="可直接采纳为自动实验" />
          <div className="suggestion-list">
            {[
              '高意向用户优先分配给微信销售，预计转化提升 9.8%',
              '价格敏感人群追加 60 元券素材，预计 CPA 降低 13%',
              '电话渠道 20:00 后接通率下降，建议预算转向 App 内广告',
              '替换 CTR 低于 2.4% 的主图，启用版本 C'
            ].map((text, index) => (
              <button className="suggestion" key={text} onClick={() => actions.openDrawer('suggestion', { text })}>
                <Sparkles size={16} />
                <span>{text}</span>
                <b>#{index + 1}</b>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="three-col">
        <div className="panel span-2">
          <PanelHeader title="运行中的广告计划" desc="点击操作可直接进入数据分析或复制新计划" />
          <table className="data-table action-table">
            <thead>
              <tr><th>计划</th><th>状态</th><th>预算</th><th>消耗</th><th>ROI</th><th>渠道</th><th>操作</th></tr>
            </thead>
            <tbody>
              {campaigns.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong><small>{row.id} · {row.owner}</small></td>
                  <td><StatusBadge label={row.status} /></td>
                  <td>¥{currency.format(row.budget)}</td>
                  <td>¥{currency.format(row.spent)}</td>
                  <td>{row.roi || '学习中'}</td>
                  <td>{row.channel}</td>
                  <td><button onClick={() => actions.go('analytics')}>查看</button><button onClick={() => actions.go('launch', 0)}>复制</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel agent-flow">
          <PanelHeader title="智能体执行链" desc="从画像到投放再到自动迭代" />
          {[
            ['用户建模智能体', '识别 8,934 名高意向用户', '完成'],
            ['广告匹配与 AI 销售', '生成 4 组渠道触达任务', '运行中'],
            ['数据分析与系统迭代', '启动版本 C 自动实验', '实验中']
          ].map((item) => (
            <button className="flow-step" key={item[0]} onClick={() => actions.openDrawer('agents')}>
              <span><BrainCircuit size={16} /></span>
              <strong>{item[0]}</strong>
              <small>{item[1]}</small>
              <em>{item[2]}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader title="各渠道表现" desc="消耗、点击率、转化率与 ROI" />
        <div className="channel-grid">
          {channelRows.map((row) => {
            const Icon = row.icon;
            return (
              <button className="channel-card" key={row.name} onClick={() => actions.go('analytics')}>
                <span className="channel-icon" style={{ color: row.color }}><Icon size={18} /></span>
                <strong>{row.name}</strong>
                <small>消耗 ¥{currency.format(row.spend)} · {row.leads} 条线索</small>
                <div className="channel-kpis"><b>CTR {row.ctr}%</b><b>CVR {row.cvr}%</b><b>ROI {row.roi}</b></div>
                <Progress value={Math.min(96, row.ctr * 7)} color={row.color} />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AssetsPage({ actions, assetList }) {
  return (
    <div className="page-grid">
      <section className="upload-zone panel">
        <div className="upload-icon"><UploadCloud size={26} /></div>
        <div>
          <h2>素材与知识库工作台</h2>
          <p>上传图片、视频、PDF、网页链接或销售话术后，AI 自动抽取卖点、适合人群、优惠策略与渠道模板。</p>
        </div>
        <button onClick={() => actions.openDrawer('upload')}><UploadCloud size={17} /> 上传/粘贴链接</button>
      </section>

      <section className="two-col">
        <div className="panel">
          <PanelHeader title="素材卡片" desc="每张卡片都可用于新建投放或重新解析" />
          <div className="asset-grid">
            {assetList.map((item) => (
              <article className="asset-card" key={item.id}>
                <div className="thumb"><Layers3 size={24} /></div>
                <div className="asset-body">
                  <div className="asset-title"><strong>{item.title}</strong><StatusBadge label={item.status} /></div>
                  <span>{item.id} · {item.type} · AI 评分 {item.score}</span>
                  <div className="tags">{item.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
                  <div className="card-actions">
                    <button onClick={() => actions.openDrawer('asset', { asset: item })}><Eye size={15} /> 预览</button>
                    <button onClick={() => actions.go('launch', 1)}><Megaphone size={15} /> 用于投放</button>
                    <button onClick={() => actions.notify(`${item.title} 已重新进入 AI 解析队列。`)}><RefreshCcw size={15} /> 解析</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="panel">
          <PanelHeader title="AI 生成结果预览" desc="可直接写入投放向导" action={<button onClick={() => actions.go('launch', 1)}>选择这些结果</button>} />
          <div className="generated-copy">
            <CopyBlock title="微信消息模板">您好，看到您刚刚关注了安装空间和滤芯费用。今天下单可享 60 元券和免费上门评估，是否需要我帮您按户型推荐型号？</CopyBlock>
            <CopyBlock title="电话开场白">您好，我是云梯智能销售助手。您之前咨询过净水器安装，我们根据您所在城市水质和家庭人数整理了 2 个适合方案。</CopyBlock>
            <CopyBlock title="App 广告文案">618 家庭饮水升级计划，限时补贴 + 免费安装评估。</CopyBlock>
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelHeader title="知识库列表" desc="知识库完整度会影响 AI 销售回答可信度" />
        <table className="data-table action-table">
          <thead><tr><th>编号</th><th>知识库</th><th>内容类型</th><th>完整度</th><th>更新时间</th><th>操作</th></tr></thead>
          <tbody>
            {knowledgeRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td><td><strong>{row.name}</strong></td><td>{row.type}</td><td>{row.completeness}</td><td>{row.updated}</td>
                <td><button onClick={() => actions.openDrawer('knowledge', { row })}>查看</button><button onClick={() => actions.go('launch', 1)}>选择</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function LaunchPage({ actions, wizardStep, setWizardStep, draft, balance }) {
  const steps = ['投放目标', '素材/知识库', '目标人群', '投放渠道', '预算与充值', '确认投放'];

  const next = () => {
    if (wizardStep === 5) {
      actions.launchCampaign();
      return;
    }
    setWizardStep(Math.min(5, wizardStep + 1));
  };

  return (
    <div className="page-grid">
      <section className="panel wizard">
        <div className="stepper">
          {steps.map((step, index) => (
            <button className={index === wizardStep ? 'active' : index < wizardStep ? 'done' : ''} onClick={() => setWizardStep(index)} key={step}>
              <span>{index < wizardStep ? <Check size={13} /> : index + 1}</span>{step}
            </button>
          ))}
        </div>
        <div className="wizard-body">
          {wizardStep === 0 && <StepGoal draft={draft} actions={actions} />}
          {wizardStep === 1 && <StepAssets draft={draft} actions={actions} />}
          {wizardStep === 2 && <StepAudience draft={draft} actions={actions} />}
          {wizardStep === 3 && <StepChannels draft={draft} actions={actions} />}
          {wizardStep === 4 && <StepBudget draft={draft} actions={actions} balance={balance} />}
          {wizardStep === 5 && <StepConfirm draft={draft} actions={actions} />}
        </div>
        <div className="wizard-actions">
          <button className="secondary" disabled={wizardStep === 0} onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}>上一步</button>
          <button className="secondary" onClick={actions.saveDraft}><Save size={16} /> 保存草稿</button>
          <button className="secondary" onClick={actions.regeneratePlan}><RefreshCcw size={16} /> 重新生成</button>
          <button onClick={next}>{wizardStep === 5 ? '立即投放' : '下一步'} <ChevronRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}

function StepGoal({ draft, actions }) {
  return (
    <StepShell title="步骤一：选择投放目标" desc="目标会影响出价策略、渠道组合和 AI 销售阶段。">
      {[
        ['提升点击', '扩大素材测试面'],
        ['获取线索', '优先收集有效咨询'],
        ['促进成交', '匹配高意向人群并触达'],
        ['召回老用户', '唤醒沉默用户'],
        ['提升复购', '按复购周期触发提醒']
      ].map(([title, desc]) => (
        <Choice key={title} active={draft.goal === title} title={title} desc={desc} onClick={() => actions.setDraft((current) => ({ ...current, goal: title }))} />
      ))}
    </StepShell>
  );
}

function StepAssets({ draft, actions }) {
  const groups = [
    ['product', '选择商品', ['智能净水器 X9', '高端空气净化器 Pro', '家庭厨电组合套装']],
    ['material', '选择广告素材', ['618 主图素材组 C', '窄柜安装短视频 B', '60 元券促销海报 A']],
    ['kb', '选择销售知识库', ['高端家电销售知识库', '异议处理知识库', '老客复购策略库']],
    ['offer', '选择优惠策略', ['满 3000 减 260 + 免费安装', '首年滤芯 8 折', '老客复购赠品包']]
  ];
  return (
    <div className="step-stack">
      {groups.map(([field, label, options]) => (
        <div key={field}>
          <PanelHeader title={label} desc="点击即可写入本次投放方案" />
          <div className="choice-grid compact">
            {options.map((option) => <Choice key={option} active={draft[field] === option} title={option} desc={field === 'material' ? 'AI 已解析可用' : '推荐项'} onClick={() => actions.setDraft((current) => ({ ...current, [field]: option }))} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepAudience({ draft, actions }) {
  const filters = ['城市：杭州/上海/成都', '年龄段：28-45', '性别：不限', '兴趣：家电/母婴/健康', '7 天内浏览详情页', '历史购买高端家电', '手机号归属地重点城市', '高意向用户', '流失风险用户', '复购潜力用户'];
  const toggleFilter = (filter) => {
    actions.setDraft((current) => ({
      ...current,
      filters: current.filters.includes(filter) ? current.filters.filter((item) => item !== filter) : [...current.filters, filter]
    }));
  };
  return (
    <div>
      <StepShell title="步骤三：选择目标人群" desc="AI 自动圈选或由运营人员手动组合画像条件。">
        {['AI 自动选择目标人群', '手动选择目标人群'].map((mode) => (
          <Choice key={mode} active={draft.audienceMode === mode} title={mode} desc={mode.startsWith('AI') ? '画像建模智能体实时筛选' : '运营人员手动配置条件'} onClick={() => actions.setDraft((current) => ({ ...current, audienceMode: mode }))} />
        ))}
      </StepShell>
      <div className="filter-grid">
        {filters.map((filter) => <button className={`filter-chip ${draft.filters.includes(filter) ? 'active' : ''}`} onClick={() => toggleFilter(filter)} key={filter}>{filter}</button>)}
      </div>
    </div>
  );
}

function StepChannels({ draft, actions }) {
  const updateChannel = (key, patch) => {
    actions.setDraft((current) => ({
      ...current,
      channels: { ...current.channels, [key]: { ...current.channels[key], ...patch } }
    }));
  };
  return (
    <StepShell title="步骤四：选择投放渠道" desc="每个渠道都可以配置预算、话术、发送时间与频次限制。">
      {channelRows.map((channel) => {
        const config = draft.channels[channel.key];
        const Icon = channel.icon;
        return (
          <div className={`channel-config ${config.enabled ? 'active' : ''}`} key={channel.key}>
            <button className="channel-toggle" onClick={() => updateChannel(channel.key, { enabled: !config.enabled })}>
              <Icon size={17} />
              <strong>{channel.name}</strong>
              <span>{config.enabled ? '已启用' : '未启用'}</span>
            </button>
            <label>预算 <input type="number" value={config.budget} onChange={(event) => updateChannel(channel.key, { budget: Number(event.target.value) })} /></label>
            <label>发送时间 <input value={config.time} onChange={(event) => updateChannel(channel.key, { time: event.target.value })} /></label>
            <label>频次限制 <input value={config.limit} onChange={(event) => updateChannel(channel.key, { limit: event.target.value })} /></label>
          </div>
        );
      })}
    </StepShell>
  );
}

function StepBudget({ draft, actions, balance }) {
  const estimate = Math.round(draft.budget / 34);
  const insufficient = draft.budget > balance;
  return (
    <div className="budget-grid">
      <MetricCard label="当前余额" value={`¥${currency.format(balance)}`} delta={insufficient ? '余额不足，请先充值' : '余额充足'} icon={Wallet} tone={insufficient ? 'orange' : 'green'} />
      <MetricCard label="本次预算" value={`¥${currency.format(draft.budget)}`} delta="可手动调整" icon={CircleDollarSign} />
      <MetricCard label="预计曝光" value={`${Math.round(draft.budget / 1140)} 万`} delta={`预计点击 ${currency.format(estimate)} 次`} icon={Activity} />
      <MetricCard label="预计转化" value={currency.format(Math.round(estimate * 0.132))} delta="预计 ROI 5.1" icon={CheckCircle2} tone="blue" />
      <div className="budget-control">
        <label>本次预算</label>
        <input type="range" min="10000" max="180000" step="5000" value={draft.budget} onChange={(event) => actions.setDraft((current) => ({ ...current, budget: Number(event.target.value) }))} />
        <input type="number" value={draft.budget} onChange={(event) => actions.setDraft((current) => ({ ...current, budget: Number(event.target.value) }))} />
      </div>
      {insufficient ? (
        <button className="recharge-notice" onClick={() => actions.go('billing')}><CreditCard size={18} /> 余额不足，点击进入充值账户</button>
      ) : (
        <div className="recharge-notice positive"><ShieldCheck size={18} /> 当前余额可覆盖计划，系统会按渠道消耗实时扣费。</div>
      )}
    </div>
  );
}

function StepConfirm({ draft, actions }) {
  const enabledChannels = Object.entries(draft.channels)
    .filter(([, value]) => value.enabled)
    .map(([key]) => channelRows.find((channel) => channel.key === key)?.name)
    .join(' / ');
  const planLines = [
    `目标人群：${draft.audienceMode}，条件 ${draft.filters.join('、')}`,
    `推荐广告素材：${draft.material}`,
    `推荐渠道组合：${enabledChannels}`,
    `微信话术：先确认安装需求，再推 ${draft.offer}`,
    '电话脚本：开场 15 秒内说明免费评估价值',
    '邮件标题：618 家庭饮水升级补贴已为你保留',
    'App 文案：免费安装评估，今天下单享滤芯补贴',
    `预计 ROI：5.1，预计成交率：13.4%，方案版本 V${draft.planVersion}`
  ];
  return (
    <div className="confirm-grid">
      {planLines.map((item) => <div className="plan-line" key={item}><CheckCircle2 size={16} />{item}</div>)}
      <div className="wizard-actions inline">
        <button onClick={actions.launchCampaign}><Megaphone size={16} /> 立即投放</button>
        <button className="secondary" onClick={actions.saveDraft}>保存草稿</button>
        <button className="secondary" onClick={actions.regeneratePlan}><RefreshCcw size={16} /> 重新生成方案</button>
      </div>
    </div>
  );
}

function ProfilesPage({ actions, selectedUser, setSelectedUser }) {
  return (
    <div className="page-grid">
      <section className="metrics-grid">
        <MetricCard label="用户总数" value="168,420" delta="近 7 日新增 12,460" icon={Users} />
        <MetricCard label="高意向用户" value="8,934" delta="需优先触达" icon={Target} tone="green" />
        <MetricCard label="价格敏感用户" value="23,510" delta="优惠素材更有效" icon={CircleDollarSign} />
        <MetricCard label="流失风险用户" value="6,728" delta="建议召回" icon={RefreshCcw} tone="orange" />
        <MetricCard label="复购潜力用户" value="14,296" delta="周期已到达" icon={CheckCircle2} tone="blue" />
        <MetricCard label="用户结构" value="新 42% / 老 37%" delta="沉默用户 21%" icon={BarChart3} />
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="用户画像列表" desc="点击用户即可切换右侧画像详情" />
          <div className="user-list">
            {users.map((user) => (
              <button className={selectedUser.id === user.id ? 'active' : ''} onClick={() => setSelectedUser(user)} key={user.id}>
                <strong>{user.id}</strong><span>{user.phone} · {user.city} · {user.source}</span><b>{user.prob}%</b>
              </button>
            ))}
          </div>
        </div>
        <div className="panel profile-detail">
          <PanelHeader title="用户画像详情" desc="用户建模智能体生成的实时摘要" action={<button onClick={() => actions.go('sales')}>创建销售任务</button>} />
          <div className="profile-head"><strong>{selectedUser.id}</strong><span>{selectedUser.phone} · {selectedUser.city} · {selectedUser.device} · {selectedUser.source}</span></div>
          <div className="timeline">{['浏览净水器 X9 详情页', '点击 618 优惠海报', '咨询安装费用', '加入购物车', '支付页面停留 46 秒'].map((item) => <div key={item}><span />{item}</div>)}</div>
          <div className="tags">{selectedUser.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
          <div className="ai-summary">
            <strong>AI 画像摘要</strong>
            <p>该用户处于“{selectedUser.stage}”阶段，转化概率 {selectedUser.prob}%。推荐广告为“免费安装评估 + 60 元券”，推荐销售方式为微信先触达，若 2 小时未回复再进入电话外呼队列。</p>
          </div>
          <div className="card-actions">
            <button onClick={() => actions.go('launch', 2)}><Target size={15} /> 加入投放人群</button>
            <button onClick={() => actions.go('sales')}><Bot size={15} /> 查看 AI 销售</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SalesPage({ actions }) {
  return (
    <div className="page-grid">
      <section className="task-grid">
        {salesTasks.map((task) => {
          const Icon = task.icon;
          return (
            <button className="panel task-card" key={task.channel} onClick={() => actions.openDrawer('task', { task })}>
              <Icon size={22} />
              <strong>{task.channel}</strong>
              <span>{task.done}/{task.total} 已触达</span>
              <Progress value={(task.done / task.total) * 100} />
              <small>{task.deal} 笔成交 · 当前阶段：{task.stage}</small>
            </button>
          );
        })}
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="销售对话预览" desc="AI 销售智能体基于画像实时推荐下一句话" action={<button onClick={() => actions.notify('推荐话术已发送到微信任务队列。')}>发送推荐话术</button>} />
          <div className="chat">
            <div className="bubble user">用户：安装要另外收费吗？我家厨房空间比较小。</div>
            <div className="bubble ai">AI：您这个情况可以先做免费上门评估。X9 支持窄柜安装，今天下单还包含基础安装服务。</div>
            <div className="bubble user">价格还有优惠吗？</div>
            <div className="bubble ai">AI：您属于高意向用户，系统推荐给您保留 60 元券和首年滤芯 8 折权益。</div>
          </div>
        </div>
        <div className="panel">
          <PanelHeader title="下一步建议" desc="当前销售阶段：异议处理 → 优惠引导" />
          <div className="recommend-box">
            <p><b>用户画像：</b>杭州，价格敏感，高意向，关注安装空间。</p>
            <p><b>推荐话术：</b>强调免费评估与低风险决策，避免直接催单。</p>
            <p><b>下一步：</b>发送安装案例图，20 分钟后未回复则安排人工跟进。</p>
            <div className="card-actions"><button onClick={() => actions.notify('已安排 20 分钟后的自动跟进任务。')}><Clock3 size={15} /> 安排跟进</button><button onClick={() => actions.notify('已转入人工协同队列。')}><UserCheck size={15} /> 转人工</button></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsPage({ actions }) {
  const [activeFilter, setActiveFilter] = useState('近 7 天');
  const rankRows = [
    ['主图 C：厨房窄柜场景', 'CTR 10.9%', 'CVR 13.2%'],
    ['海报 A：60 元券', 'CTR 8.4%', 'CVR 15.6%'],
    ['短视频 B：安装过程', 'CTR 7.1%', 'CVR 11.8%']
  ];
  return (
    <div className="page-grid">
      <section className="filter-bar">
        {['近 7 天', '618 新客线索加速计划', '全部渠道', '高意向人群', '全部素材', '全部销售 Agent'].map((item) => <button className={activeFilter === item ? 'active' : ''} key={item} onClick={() => setActiveFilter(item)}><SlidersHorizontal size={15} />{item}</button>)}
      </section>
      <section className="chart-grid">
        <ChartPanel title="曝光趋势"><AreaChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="exposure" stroke="#0f766e" fill="#ccfbf1" name="曝光 万" /></AreaChart></ChartPanel>
        <ChartPanel title="点击趋势"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="click" stroke="#2563eb" strokeWidth={2} name="点击 万" /></LineChart></ChartPanel>
        <ChartPanel title="转化趋势"><BarChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="conversion" fill="#0891b2" name="转化" /></BarChart></ChartPanel>
        <ChartPanel title="ROI 趋势"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="roi" stroke="#db2777" strokeWidth={2} name="ROI" /></LineChart></ChartPanel>
      </section>
      <section className="two-col">
        <div className="panel"><PanelHeader title="渠道对比 / 人群对比" desc="消耗、线索与 ROI 综合表现" /><ChartBox height={260}><BarChart data={channelRows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="leads" name="线索">{channelRows.map((row) => <Cell key={row.name} fill={row.color} />)}</Bar></BarChart></ChartBox></div>
        <div className="panel"><PanelHeader title="转化漏斗" desc="曝光 → 点击 → 咨询 → 下单 → 支付" /><ChartBox height={260}><FunnelChart><Tooltip /><Funnel dataKey="value" data={funnelData} isAnimationActive /></FunnelChart></ChartBox></div>
      </section>
      <section className="two-col">
        <RankPanel title="素材表现排行" rows={rankRows} action={() => actions.go('optimize')} />
        <RankPanel title="销售话术表现排行" rows={[['免费安装评估开场', '成交率 18.6%', '响应 2.3 分钟'], ['优惠券限时保留', '成交率 15.2%', '响应 3.8 分钟'], ['窄柜安装案例', '成交率 13.7%', '响应 4.1 分钟']]} action={() => actions.go('optimize')} />
      </section>
    </div>
  );
}

function OptimizePage({ actions }) {
  const [applied, setApplied] = useState([]);
  const suggestions = [
    '将高意向用户优先分配到微信销售',
    '对价格敏感用户推送优惠券素材',
    '降低电话渠道预算，提高 App 内广告预算',
    '替换点击率低的广告图',
    '优化电话开场白',
    '对流失风险用户启动召回话术'
  ];
  const accept = (item) => {
    setApplied((list) => [...new Set([...list, item])]);
    actions.notify(`已采纳：${item}`);
  };
  return (
    <div className="page-grid">
      <section className="panel">
        <PanelHeader title="AI 发现的问题" desc="系统迭代智能体从投放、对话与成交数据中提取异常" />
        <div className="issue-grid">{['电话渠道 19:30 后接通率下降 22%', '主图 A 在 35 岁以上人群 CTR 低于均值', '价格敏感人群咨询后流失率偏高', '邮箱渠道高曝光低成交，需缩小人群'].map((item) => <button className="issue" key={item} onClick={() => actions.openDrawer('suggestion', { text: item })}><Activity size={16} />{item}</button>)}</div>
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="AI 生成的优化建议" desc="可采纳、自动执行、查看原因或回滚" />
          <div className="opt-list">
            {suggestions.map((item) => (
              <div className={`opt-item ${applied.includes(item) ? 'applied' : ''}`} key={item}>
                <span>{item}</span>
                <div>
                  <button onClick={() => accept(item)}>{applied.includes(item) ? '已采纳' : '采纳优化'}</button>
                  <button className="secondary" onClick={() => actions.notify(`已自动执行：${item}`)}>自动执行</button>
                  <button className="secondary" onClick={() => actions.openDrawer('suggestion', { text: item })}>查看原因</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <PanelHeader title="自动实验 A/B/C" desc="当前胜出版本：版本 C" action={<button onClick={() => actions.go('analytics')}>查看数据</button>} />
          <div className="experiment">
            {['A：突出低价', 'B：突出品牌保障', 'C：免费安装评估'].map((item, index) => <div className={index === 2 ? 'winner' : ''} key={item}><strong>{item}</strong><span>CTR {['6.1%', '7.4%', '10.9%'][index]} · CVR {['8.8%', '10.3%', '13.2%'][index]}</span></div>)}
          </div>
          <div className="adjusted">
            <strong>系统已自动调整</strong>
            <p>App 内广告预算 +18%，电话外呼频次从每日 2 次降为 1 次，微信话术切换为“免费评估优先”。</p>
            <button onClick={() => actions.notify('已回滚到上一个策略版本。')}><RefreshCcw size={16} /> 回滚上一个策略</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BillingPage({ actions, balance }) {
  const [amount, setAmount] = useState(50000);
  return (
    <div className="page-grid">
      <section className="two-col">
        <div className="panel recharge">
          <PanelHeader title="账户余额" desc="支持预充值后自动投放扣费" />
          <strong className="balance">¥{currency.format(balance)}</strong>
          <div className="amount-grid">{[5000, 20000, 50000, 100000].map((item) => <button className={amount === item ? 'active' : ''} key={item} onClick={() => setAmount(item)}>¥{currency.format(item)}</button>)}</div>
          <button onClick={() => actions.recharge(amount)}><CircleDollarSign size={16} /> 立即充值</button>
        </div>
        <div className="panel">
          <PanelHeader title="渠道消耗明细" desc="今日各渠道预算消耗" />
          <ChartBox height={250}><PieChart><Tooltip /><Pie data={channelRows} dataKey="leads" nameKey="name" outerRadius={88}>{channelRows.map((row, index) => <Cell key={row.name} fill={colors[index]} />)}</Pie></PieChart></ChartBox>
        </div>
      </section>
      <section className="panel"><PanelHeader title="消耗记录" desc="投放计划预算与扣费记录" /><DataTable columns={['时间', '计划', '渠道', '消耗', '余额']} rows={[['05-26 14:20', '618 新客线索加速计划', '微信销售', '¥2,860', `¥${currency.format(balance)}`], ['05-26 13:00', '高客单价咨询转化', 'App 内广告', '¥4,200', '¥129,340'], ['05-26 11:30', '老客复购优惠召回', '电话销售', '¥1,160', '¥133,540']]} /></section>
      <section className="panel"><PanelHeader title="支付记录" desc="充值、发票与账户流水" /><DataTable columns={['订单号', '金额', '支付方式', '状态', '时间']} rows={[['PAY-88420', '¥50,000', '企业网银', '已到账', '05-25 09:12'], ['PAY-87311', '¥20,000', '支付宝', '已到账', '05-20 16:48']]} /></section>
    </div>
  );
}

function SettingsPage({ actions }) {
  const [settings, setSettings] = useState(['智能体自动执行需二次确认', '敏感词命中转人工审核', '手机号脱敏展示', '低余额自动提醒', 'ROI 低于 2.5 自动暂停']);
  const all = ['智能体自动执行需二次确认', '电话外呼每日频次上限 2 次', '敏感词命中转人工审核', '手机号脱敏展示', '低余额自动提醒', 'ROI 低于 2.5 自动暂停'];
  const toggle = (item) => setSettings((list) => list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);
  return (
    <div className="page-grid">
      <section className="panel">
        <PanelHeader title="系统设置" desc="智能体权限、触达规则、数据安全与人工审核" action={<button onClick={() => actions.notify('系统设置已保存。')}>保存设置</button>} />
        <div className="settings-grid">
          {all.map((item) => <label key={item}><input type="checkbox" checked={settings.includes(item)} onChange={() => toggle(item)} />{item}</label>)}
        </div>
      </section>
    </div>
  );
}

function ActionDrawer({ drawer, onClose, actions }) {
  const [assetType, setAssetType] = useState('图片/海报');
  const [assetName, setAssetName] = useState('618 新品促销素材');

  const addNewAsset = () => {
    actions.addAsset({
      id: `MAT-${Date.now().toString().slice(-4)}`,
      title: assetName || '新上传素材',
      type: assetType,
      status: '解析中',
      score: 72,
      tags: ['AI 解析中', '待投放', '新增']
    });
  };

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(event) => event.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        {drawer.type === 'upload' && (
          <>
            <DrawerHeader title="上传素材 / 知识库" desc="这是原型内的真实交互：提交后会新增一张素材卡片。" icon={UploadCloud} />
            <div className="form-stack">
              <label>素材名称<input value={assetName} onChange={(event) => setAssetName(event.target.value)} /></label>
              <label>素材类型<select value={assetType} onChange={(event) => setAssetType(event.target.value)}><option>图片/海报</option><option>视频</option><option>销售话术</option><option>FAQ/PDF</option><option>网页链接</option></select></label>
              <div className="drop-area"><UploadCloud size={24} /> 拖拽文件到这里，或粘贴网页链接</div>
              <button onClick={addNewAsset}><Sparkles size={16} /> 开始 AI 解析并入库</button>
            </div>
          </>
        )}
        {drawer.type === 'search' && (
          <>
            <DrawerHeader title="搜索结果" desc={`关键词：${drawer.payload.query}`} icon={Search} />
            <div className="result-list">
              <button onClick={() => { actions.go('profiles'); onClose(); }}>高意向用户 8,934 人 <ArrowRight size={16} /></button>
              <button onClick={() => { actions.go('assets'); onClose(); }}>相关素材 12 个 <ArrowRight size={16} /></button>
              <button onClick={() => { actions.go('analytics'); onClose(); }}>投放计划 3 个 <ArrowRight size={16} /></button>
            </div>
          </>
        )}
        {drawer.type === 'agents' && (
          <>
            <DrawerHeader title="智能体运行状态" desc="三个核心 AI 模块正在协同处理投放闭环。" icon={BrainCircuit} />
            <div className="agent-detail">
              {['用户建模智能体：每 5 分钟刷新画像和转化概率', '广告匹配与 AI 销售：正在生成 820 条多渠道触达任务', '数据分析与系统迭代：监控 CTR、CVR、ROI 并推动 A/B 实验'].map((item) => <div key={item}><CheckCircle2 size={16} />{item}</div>)}
            </div>
          </>
        )}
        {drawer.type === 'notifications' && (
          <>
            <DrawerHeader title="通知中心" desc="投放、预算和智能体事件" icon={Bell} />
            <div className="result-list">
              <button>版本 C 已成为当前胜出素材</button>
              <button>电话渠道今日消耗达到预算 68%</button>
              <button>新增 416 名高意向用户待触达</button>
            </div>
          </>
        )}
        {drawer.type === 'asset' && (
          <>
            <DrawerHeader title={drawer.payload.asset.title} desc={`${drawer.payload.asset.type} · AI 评分 ${drawer.payload.asset.score}`} icon={Layers3} />
            <div className="generated-copy">
              <CopyBlock title="素材标签">{drawer.payload.asset.tags.join(' / ')}</CopyBlock>
              <CopyBlock title="AI 建议">适合投放给 28-45 岁、关注家庭健康和安装服务的高意向用户，优先走微信销售与 App 内广告。</CopyBlock>
              <button onClick={() => { actions.go('launch', 1); onClose(); }}><Megaphone size={16} /> 用于新建投放</button>
            </div>
          </>
        )}
        {drawer.type === 'knowledge' && (
          <>
            <DrawerHeader title={drawer.payload.row.name} desc={`${drawer.payload.row.type} · 完整度 ${drawer.payload.row.completeness}`} icon={Database} />
            <div className="agent-detail">
              <div><CheckCircle2 size={16} />商品卖点、安装政策、FAQ 可被 AI 销售引用。</div>
              <div><CheckCircle2 size={16} />缺少“竞品对比”和“退款边界”内容，建议补充。</div>
            </div>
          </>
        )}
        {drawer.type === 'task' && (
          <>
            <DrawerHeader title={drawer.payload.task.channel} desc={`${drawer.payload.task.owner} · 当前阶段 ${drawer.payload.task.stage}`} icon={Play} />
            <div className="agent-detail">
              <div><CheckCircle2 size={16} />已触达 {drawer.payload.task.done} / {drawer.payload.task.total}</div>
              <div><CheckCircle2 size={16} />已成交 {drawer.payload.task.deal} 笔</div>
              <button onClick={() => actions.notify('任务已暂停，等待人工复核。')}>暂停任务</button>
            </div>
          </>
        )}
        {drawer.type === 'suggestion' && (
          <>
            <DrawerHeader title="优化原因" desc={drawer.payload.text} icon={Wand2} />
            <div className="agent-detail">
              <div><Route size={16} />系统对比了 7 天 CTR、CVR、ROI 与成交阶段流失率。</div>
              <div><Zap size={16} />预计执行后 CPA 降低 8%-13%，ROI 提升 0.4-0.7。</div>
              <button onClick={() => { actions.notify('优化建议已加入自动执行队列。'); onClose(); }}>加入自动执行</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function DrawerHeader({ title, desc, icon: Icon }) {
  return (
    <div className="drawer-header">
      <span><Icon size={20} /></span>
      <div><h2>{title}</h2><p>{desc}</p></div>
    </div>
  );
}

function Toast({ toast }) {
  return <div className={`toast ${toast.tone}`}><CheckCircle2 size={17} />{toast.text}</div>;
}

function MetricCard({ label, value, delta, icon: Icon, tone = 'neutral' }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-top"><span>{label}</span><Icon size={18} /></div>
      <strong>{value}</strong>
      <small>{delta}</small>
    </div>
  );
}

function CommandButton({ icon: Icon, title, desc, onClick }) {
  return (
    <button className="command-button" onClick={onClick}>
      <span><Icon size={18} /></span>
      <strong>{title}</strong>
      <small>{desc}</small>
      <ArrowRight size={16} />
    </button>
  );
}

function PanelHeader({ title, desc, action }) {
  return <div className="panel-header"><div><h2>{title}</h2><p>{desc}</p></div>{action}</div>;
}

function ChartBox({ children, height = 220 }) {
  return <div style={{ height }}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}

function ChartPanel({ title, children }) {
  return <div className="panel"><PanelHeader title={title} desc="实时投放数据" /><ChartBox>{children}</ChartBox></div>;
}

function DataTable({ columns, rows }) {
  return <table className="data-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>;
}

function RankPanel({ title, rows, action }) {
  return (
    <div className="panel">
      <PanelHeader title={title} desc="按综合表现排序" action={<button onClick={action}>创建实验</button>} />
      <DataTable columns={['名称', '指标一', '指标二']} rows={rows} />
    </div>
  );
}

function StepShell({ title, desc, children }) {
  return <div><PanelHeader title={title} desc={desc} /><div className="choice-grid">{children}</div></div>;
}

function Choice({ title, desc, active, onClick }) {
  return <button className={`choice ${active ? 'active' : ''}`} onClick={onClick}><strong>{title}</strong><span>{desc}</span></button>;
}

function StatusBadge({ label }) {
  const cls = label.includes('运行') || label.includes('已解析') ? 'green' : label.includes('学习') || label.includes('生成') || label.includes('解析') ? 'blue' : 'gray';
  return <span className={`status-badge ${cls}`}>{label}</span>;
}

function Progress({ value, color = '#0f766e' }) {
  return <div className="progress"><span style={{ width: `${Math.max(4, Math.min(100, value))}%`, background: color }} /></div>;
}

function CopyBlock({ title, children }) {
  return <div className="copy-block"><strong>{title}</strong><p>{children}</p></div>;
}

createRoot(document.getElementById('root')).render(<App />);
