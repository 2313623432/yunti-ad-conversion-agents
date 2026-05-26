import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Database,
  FileText,
  Gauge,
  Layers3,
  Megaphone,
  MessageSquareText,
  PhoneCall,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  UploadCloud,
  Users,
  Wallet,
  Wand2
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
  { name: '微信销售', spend: '¥12,840', ctr: '8.7%', cvr: '14.2%', roi: '3.9', leads: 416, color: '#16a34a' },
  { name: '电话销售', spend: '¥8,620', ctr: '5.1%', cvr: '18.6%', roi: '4.6', leads: 192, color: '#2563eb' },
  { name: '邮箱', spend: '¥3,180', ctr: '3.4%', cvr: '6.9%', roi: '2.1', leads: 133, color: '#d97706' },
  { name: 'App 内广告', spend: '¥15,960', ctr: '10.9%', cvr: '11.8%', roi: '5.2', leads: 531, color: '#0891b2' }
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

const campaignRows = [
  { name: '618 新客线索加速计划', status: '运行中', budget: '¥80,000', spent: '¥31,420', roi: '5.4', owner: '广告匹配智能体' },
  { name: '老客复购优惠召回', status: '学习中', budget: '¥36,000', spent: '¥9,860', roi: '3.8', owner: '系统迭代智能体' },
  { name: '高客单价咨询转化', status: '运行中', budget: '¥52,000', spent: '¥18,220', roi: '4.9', owner: 'AI 销售智能体' }
];

const assets = [
  { title: '智能净水器主图组', type: '图片/海报', status: '已解析', tags: ['家电', '健康人群', '领券', '微信优先'] },
  { title: '私域成交电话脚本 V3', type: '销售话术', status: '生成中', tags: ['异议处理', '价格敏感', '电话'] },
  { title: '618 限时优惠落地页', type: '网页链接', status: '已解析', tags: ['促销', '高意向', 'App 内广告'] },
  { title: '产品安装 FAQ.pdf', type: 'FAQ/PDF', status: '待补充', tags: ['售后疑问', '咨询转化', '邮箱'] }
];

const knowledgeRows = [
  ['KB-2401', '高端家电知识库', '商品介绍/FAQ/安装政策', '93%', '12 分钟前'],
  ['KB-2402', '销售异议处理库', '电话脚本/微信追问/优惠边界', '88%', '36 分钟前'],
  ['KB-2403', '老客复购策略库', '复购周期/赠品策略/召回话术', '91%', '2 小时前']
];

const users = [
  { id: 'U-839204', phone: '138****4196', city: '杭州', device: 'iPhone 15', source: '微信广告', prob: 86, tags: ['高意向', '关注安装', '价格敏感'], stage: '咨询后未下单' },
  { id: 'U-762118', phone: '186****5827', city: '上海', device: 'Android', source: 'App 内广告', prob: 74, tags: ['复购潜力', '母婴家庭', '偏好优惠'], stage: '加购未支付' },
  { id: 'U-518673', phone: '151****0632', city: '成都', device: 'PC', source: '邮箱', prob: 58, tags: ['流失风险', '老用户', '售后关注'], stage: '30 天未访问' }
];

const salesTasks = [
  { channel: '微信消息任务', icon: MessageSquareText, total: 580, done: 416, deal: 63, stage: '优惠引导' },
  { channel: '电话外呼任务', icon: PhoneCall, total: 240, done: 156, deal: 41, stage: '需求确认' },
  { channel: '邮件任务', icon: FileText, total: 3200, done: 2710, deal: 77, stage: '初次触达' },
  { channel: 'App 内广告任务', icon: Megaphone, total: 7600, done: 6120, deal: 189, stage: '成交跟进' }
];

const funnelData = [
  { value: 347000, name: '曝光', fill: '#0f766e' },
  { value: 30500, name: '点击', fill: '#0891b2' },
  { value: 4830, name: '咨询', fill: '#2563eb' },
  { value: 1220, name: '下单', fill: '#7c3aed' },
  { value: 894, name: '支付', fill: '#db2777' }
];

const colors = ['#0f766e', '#2563eb', '#d97706', '#7c3aed', '#dc2626'];

function App() {
  const [page, setPage] = useState('dashboard');
  const [wizardStep, setWizardStep] = useState(0);
  const [audienceMode, setAudienceMode] = useState('AI 自动选择目标人群');
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const active = navItems.find((item) => item.key === page);

  const pageNode = useMemo(() => {
    const shared = { setPage, wizardStep, setWizardStep, audienceMode, setAudienceMode, selectedUser, setSelectedUser };
    return {
      dashboard: <Dashboard {...shared} />,
      assets: <AssetsPage />,
      launch: <LaunchPage {...shared} />,
      profiles: <ProfilesPage {...shared} />,
      sales: <SalesPage />,
      analytics: <AnalyticsPage />,
      optimize: <OptimizePage />,
      billing: <BillingPage />,
      settings: <SettingsPage />
    }[page];
  }, [page, wizardStep, audienceMode, selectedUser]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button className={`nav-item ${page === item.key ? 'active' : ''}`} key={item.key} onClick={() => setPage(item.key)}>
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="agent-card">
          <BrainCircuit size={20} />
          <div>
            <strong>三智能体协同中</strong>
            <span>画像建模 · 广告匹配 · 迭代优化</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">云梯科技 · AI 广告转化平台</div>
            <h1>{active?.label}</h1>
          </div>
          <div className="top-actions">
            <div className="search"><Search size={16} /><span>搜索计划、用户、素材</span></div>
            <button className="icon-btn" title="通知"><Bell size={18} /></button>
            <button className="status-pill"><Activity size={16} /> 自动投放运行中</button>
          </div>
        </header>
        {pageNode}
      </main>
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

function MetricCard({ label, value, delta, icon: Icon, tone = 'neutral' }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <strong>{value}</strong>
      <small>{delta}</small>
    </div>
  );
}

function Dashboard({ setPage, setWizardStep }) {
  return (
    <div className="page-grid">
      <section className="quick-actions band">
        <button onClick={() => { setPage('launch'); setWizardStep(0); }}><Plus size={17} /> 新建投放</button>
        <button onClick={() => setPage('assets')}><UploadCloud size={17} /> 上传素材</button>
        <button onClick={() => setPage('billing')}><CircleDollarSign size={17} /> 充值</button>
        <button onClick={() => setPage('optimize')}><Wand2 size={17} /> 查看优化建议</button>
      </section>
      <section className="metrics-grid">
        <MetricCard label="账户余额" value="¥126,480.00" delta="可支持约 5.8 天投放" icon={Wallet} tone="green" />
        <MetricCard label="今日消耗" value="¥40,600" delta="较昨日 +12.4%" icon={CircleDollarSign} />
        <MetricCard label="今日曝光" value="34.7 万" delta="覆盖 8 个重点城市" icon={Activity} />
        <MetricCard label="点击率 CTR" value="8.79%" delta="高于账户均值 1.8%" icon={Target} tone="blue" />
        <MetricCard label="转化率 CVR" value="11.05%" delta="微信销售贡献最高" icon={CheckCircle2} tone="green" />
        <MetricCard label="ROI" value="5.4" delta="目标 ROI 4.2" icon={BarChart3} tone="blue" />
      </section>
      <section className="two-col">
        <div className="panel wide">
          <PanelHeader title="实时转化趋势" desc="曝光、点击与转化随 AI 调整节奏变化" />
          <ChartBox height={290}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="exposure" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7edf3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="exposure" stroke="#0f766e" fill="url(#exposure)" name="曝光 万" />
              <Line type="monotone" dataKey="roi" stroke="#2563eb" strokeWidth={2} name="ROI" />
            </AreaChart>
          </ChartBox>
        </div>
        <div className="panel">
          <PanelHeader title="AI 今日优化建议" desc="系统迭代智能体已发现 6 条可执行建议" />
          <div className="suggestion-list">
            {['高意向用户优先分配给微信销售，预计转化提升 9.8%', '价格敏感人群追加 60 元券素材，预计 CPA 降低 13%', '电话渠道 20:00 后接通率下降，建议预算转向 App 内广告', '替换 CTR 低于 2.4% 的主图，启用版本 C'].map((text, index) => (
              <div className="suggestion" key={text}><Sparkles size={16} /><span>{text}</span><b>#{index + 1}</b></div>
            ))}
          </div>
        </div>
      </section>
      <section className="two-col lower">
        <div className="panel">
          <PanelHeader title="当前运行中的广告计划" desc="预算、消耗与负责智能体" />
          <DataTable columns={['计划', '状态', '预算', '消耗', 'ROI', '负责模块']} rows={campaignRows.map((r) => [r.name, r.status, r.budget, r.spent, r.roi, r.owner])} />
        </div>
        <div className="panel">
          <PanelHeader title="各渠道表现" desc="微信、电话、邮箱、App 内广告" />
          <div className="channel-list">
            {channelRows.map((row) => (
              <div className="channel-row" key={row.name}>
                <div><span className="dot" style={{ background: row.color }} /> <strong>{row.name}</strong><small>{row.spend} · {row.leads} 条线索</small></div>
                <div><b>{row.roi}</b><small>ROI</small></div>
                <div className="progress"><span style={{ width: `${Math.min(94, Number.parseFloat(row.ctr) * 7)}%`, background: row.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AssetsPage() {
  return (
    <div className="page-grid">
      <section className="panel upload-zone">
        <UploadCloud size={28} />
        <div>
          <h2>上传素材与知识库</h2>
          <p>支持图片、视频、海报、商品介绍、销售话术、FAQ、PDF 与网页链接。AI 会自动抽取卖点、适合人群、价格、优惠和渠道策略。</p>
        </div>
        <button><UploadCloud size={17} /> 选择文件/粘贴链接</button>
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="素材卡片" desc="AI 解析后自动生成可投放内容" />
          <div className="asset-grid">
            {assets.map((item) => (
              <div className="asset-card" key={item.title}>
                <div className="thumb"><Layers3 size={24} /></div>
                <div className="asset-body">
                  <strong>{item.title}</strong>
                  <span>{item.type} · {item.status}</span>
                  <div className="tags">{item.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <PanelHeader title="AI 生成结果预览" desc="广告文案、话术、电话脚本、微信模板" />
          <div className="generated-copy">
            <strong>微信消息模板</strong>
            <p>您好，看到您刚刚关注了安装空间和滤芯费用。今天下单可享 60 元券和免费上门评估，是否需要我帮您按户型推荐型号？</p>
            <strong>电话开场白</strong>
            <p>您好，我是云梯智能销售助手。您之前咨询过净水器安装，我们根据您所在城市水质和家庭人数整理了 2 个适合方案。</p>
            <strong>App 广告文案</strong>
            <p>618 家庭饮水升级计划，限时补贴 + 免费安装评估。</p>
          </div>
        </div>
      </section>
      <section className="panel">
        <PanelHeader title="知识库列表" desc="知识库完整度会影响 AI 销售回答可信度" />
        <DataTable columns={['编号', '知识库', '内容类型', '完整度', '更新时间']} rows={knowledgeRows} />
      </section>
    </div>
  );
}

function LaunchPage({ wizardStep, setWizardStep, audienceMode, setAudienceMode }) {
  const steps = ['投放目标', '素材/知识库', '目标人群', '投放渠道', '预算与充值', '确认投放'];
  return (
    <div className="page-grid">
      <section className="panel wizard">
        <div className="stepper">
          {steps.map((step, index) => (
            <button className={index === wizardStep ? 'active' : index < wizardStep ? 'done' : ''} onClick={() => setWizardStep(index)} key={step}>
              <span>{index + 1}</span>{step}
            </button>
          ))}
        </div>
        <div className="wizard-body">
          {wizardStep === 0 && <StepGoal />}
          {wizardStep === 1 && <StepAssets />}
          {wizardStep === 2 && <StepAudience audienceMode={audienceMode} setAudienceMode={setAudienceMode} />}
          {wizardStep === 3 && <StepChannels />}
          {wizardStep === 4 && <StepBudget />}
          {wizardStep === 5 && <StepConfirm />}
        </div>
        <div className="wizard-actions">
          <button className="secondary" disabled={wizardStep === 0} onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}>上一步</button>
          <button className="secondary">保存草稿</button>
          <button onClick={() => setWizardStep(Math.min(5, wizardStep + 1))}>{wizardStep === 5 ? '立即投放' : '下一步'} <ChevronRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}

function StepGoal() {
  return <StepShell title="步骤一：选择投放目标" desc="系统会根据目标调整出价、渠道和 AI 销售话术。">{['提升点击', '获取线索', '促进成交', '召回老用户', '提升复购'].map((x, i) => <Choice key={x} active={i === 2} title={x} desc={['扩大素材测试面', '收集有效咨询', '优先匹配高意向人群', '唤醒沉默用户', '提高复购频次'][i]} />)}</StepShell>;
}

function StepAssets() {
  return <StepShell title="步骤二：选择素材/知识库" desc="选择商品、素材、销售知识库与优惠策略。">{['智能净水器 X9', '618 主图素材组 C', '高端家电销售知识库', '满 3000 减 260 + 免费安装'].map((x, i) => <Choice key={x} active title={x} desc={['选择商品', '选择广告素材', '选择销售知识库', '选择优惠策略'][i]} />)}</StepShell>;
}

function StepAudience({ audienceMode, setAudienceMode }) {
  const filters = ['城市：杭州/上海/成都', '年龄段：28-45', '性别：不限', '兴趣标签：家电/母婴/健康', '最近访问：7 天内浏览详情页', '历史购买：高端家电', '手机号归属地：重点城市', '高意向用户', '流失风险用户', '复购潜力用户'];
  return (
    <div>
      <StepShell title="步骤三：选择目标人群" desc="AI 自动圈选或手动组合画像条件。">
        {['AI 自动选择目标人群', '手动选择目标人群'].map((mode) => <Choice key={mode} active={audienceMode === mode} title={mode} desc={mode.startsWith('AI') ? '由画像建模智能体实时筛选' : '运营人员手动配置筛选条件'} onClick={() => setAudienceMode(mode)} />)}
      </StepShell>
      <div className="filter-grid">{filters.map((f) => <button className="filter-chip" key={f}>{f}</button>)}</div>
    </div>
  );
}

function StepChannels() {
  return (
    <StepShell title="步骤四：选择投放渠道" desc="每个渠道可配置预算、话术、发送时间与频次限制。">
      {['微信销售', '电话销售', '邮箱', 'App 内广告'].map((name, i) => <ChannelConfig name={name} key={name} budget={['¥18,000', '¥9,000', '¥4,000', '¥24,000'][i]} />)}
    </StepShell>
  );
}

function StepBudget() {
  return (
    <div className="budget-grid">
      <MetricCard label="当前余额" value="¥126,480" delta="余额充足" icon={Wallet} tone="green" />
      <MetricCard label="本次预算" value="¥55,000" delta="建议运行 3 天" icon={CircleDollarSign} />
      <MetricCard label="预计曝光" value="48.2 万" delta="预计点击 4.1 万" icon={Activity} />
      <MetricCard label="预计转化" value="1,620" delta="预计 ROI 5.1" icon={CheckCircle2} tone="blue" />
      <div className="recharge-notice"><ShieldCheck size={18} /> 当前余额可覆盖计划；若预算提升至 ¥180,000，系统会展示充值入口。</div>
    </div>
  );
}

function StepConfirm() {
  return (
    <div className="confirm-grid">
      {['目标人群：高意向 + 价格敏感 + 7 天内浏览详情页', '推荐素材：618 主图素材组 C + 限时券海报', '推荐渠道组合：微信 35% / App 43% / 电话 16% / 邮箱 6%', '微信话术：先确认安装需求，再推 60 元券', '电话脚本：开场 15 秒内说明免费评估价值', '邮件标题：618 家庭饮水升级补贴已为你保留', 'App 文案：免费安装评估，今天下单享滤芯补贴', '预计 ROI：5.1，预计成交率：13.4%'].map((item) => <div className="plan-line" key={item}><CheckCircle2 size={16} />{item}</div>)}
      <div className="wizard-actions inline"><button><Megaphone size={16} /> 立即投放</button><button className="secondary">保存草稿</button><button className="secondary"><RefreshCcw size={16} /> 重新生成方案</button></div>
    </div>
  );
}

function ProfilesPage({ selectedUser, setSelectedUser }) {
  return (
    <div className="page-grid">
      <section className="metrics-grid">
        <MetricCard label="用户总数" value="168,420" delta="近 7 日新增 12,460" icon={Users} />
        <MetricCard label="高意向用户" value="8,934" delta="需优先触达" icon={Target} tone="green" />
        <MetricCard label="价格敏感用户" value="23,510" delta="优惠素材更有效" icon={CircleDollarSign} />
        <MetricCard label="流失风险用户" value="6,728" delta="建议召回" icon={RefreshCcw} />
        <MetricCard label="复购潜力用户" value="14,296" delta="周期已到达" icon={CheckCircle2} tone="blue" />
        <MetricCard label="用户结构" value="新 42% / 老 37%" delta="沉默用户 21%" icon={PieIcon} />
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="画像用户列表" desc="点击查看画像详情与推荐销售方式" />
          <div className="user-list">
            {users.map((user) => (
              <button className={selectedUser.id === user.id ? 'active' : ''} onClick={() => setSelectedUser(user)} key={user.id}>
                <strong>{user.id}</strong><span>{user.phone} · {user.city} · {user.source}</span><b>{user.prob}%</b>
              </button>
            ))}
          </div>
        </div>
        <div className="panel profile-detail">
          <PanelHeader title="用户画像详情" desc="用户建模智能体生成的实时摘要" />
          <div className="profile-head"><strong>{selectedUser.id}</strong><span>{selectedUser.phone} · {selectedUser.city} · {selectedUser.device} · {selectedUser.source}</span></div>
          <div className="timeline">{['浏览净水器 X9 详情页', '点击 618 优惠海报', '咨询安装费用', '加入购物车', '支付页面停留 46 秒'].map((t) => <div key={t}><span />{t}</div>)}</div>
          <div className="tags">{selectedUser.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
          <div className="ai-summary">
            <strong>AI 画像摘要</strong>
            <p>该用户处于“{selectedUser.stage}”阶段，转化概率 {selectedUser.prob}%。推荐广告为“免费安装评估 + 60 元券”，推荐销售方式为微信先触达，若 2 小时未回复再进入电话外呼队列。</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SalesPage() {
  return (
    <div className="page-grid">
      <section className="task-grid">
        {salesTasks.map((task) => {
          const Icon = task.icon;
          return <div className="panel task-card" key={task.channel}><Icon size={22} /><strong>{task.channel}</strong><span>{task.done}/{task.total} 已触达</span><div className="progress"><span style={{ width: `${task.done / task.total * 100}%` }} /></div><small>{task.deal} 笔成交 · 当前阶段：{task.stage}</small></div>;
        })}
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="销售对话预览" desc="AI 销售智能体基于画像实时推荐下一句话" />
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
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsPage() {
  const rankRows = [['主图 C：厨房窄柜场景', 'CTR 10.9%', 'CVR 13.2%'], ['海报 A：60 元券', 'CTR 8.4%', 'CVR 15.6%'], ['短视频 B：安装过程', 'CTR 7.1%', 'CVR 11.8%']];
  return (
    <div className="page-grid">
      <section className="filter-bar">
        {['近 7 天', '618 新客线索加速计划', '全部渠道', '高意向人群', '全部素材', '全部销售 Agent'].map((x) => <button key={x}><SlidersHorizontal size={15} />{x}</button>)}
      </section>
      <section className="chart-grid">
        <ChartPanel title="曝光趋势"><AreaChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="exposure" stroke="#0f766e" fill="#ccfbf1" name="曝光 万" /></AreaChart></ChartPanel>
        <ChartPanel title="点击趋势"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="click" stroke="#2563eb" strokeWidth={2} name="点击 万" /></LineChart></ChartPanel>
        <ChartPanel title="转化趋势"><BarChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="conversion" fill="#0891b2" name="转化" /></BarChart></ChartPanel>
        <ChartPanel title="ROI 趋势"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="roi" stroke="#db2777" strokeWidth={2} name="ROI" /></LineChart></ChartPanel>
      </section>
      <section className="two-col">
        <div className="panel"><PanelHeader title="渠道对比 / 人群对比" desc="消耗、线索与 ROI 综合表现" /><ChartBox height={260}><BarChart data={channelRows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="leads" name="线索">{channelRows.map((r) => <Cell key={r.name} fill={r.color} />)}</Bar></BarChart></ChartBox></div>
        <div className="panel"><PanelHeader title="转化漏斗" desc="曝光 → 点击 → 咨询 → 下单 → 支付" /><ChartBox height={260}><FunnelChart><Tooltip /><Funnel dataKey="value" data={funnelData} isAnimationActive /></FunnelChart></ChartBox></div>
      </section>
      <section className="two-col">
        <div className="panel"><PanelHeader title="素材表现排行" desc="按 CTR 与 CVR 综合排序" /><DataTable columns={['素材', '点击率', '转化率']} rows={rankRows} /></div>
        <div className="panel"><PanelHeader title="销售话术表现排行" desc="按成交率与平均响应时长排序" /><DataTable columns={['话术', '成交率', '响应']} rows={[['免费安装评估开场', '18.6%', '2.3 分钟'], ['优惠券限时保留', '15.2%', '3.8 分钟'], ['窄柜安装案例', '13.7%', '4.1 分钟']]} /></div>
      </section>
    </div>
  );
}

function OptimizePage() {
  const suggestions = ['将高意向用户优先分配到微信销售', '对价格敏感用户推送优惠券素材', '降低电话渠道预算，提高 App 内广告预算', '替换点击率低的广告图', '优化电话开场白', '对流失风险用户启动召回话术'];
  return (
    <div className="page-grid">
      <section className="panel">
        <PanelHeader title="AI 发现的问题" desc="系统迭代智能体从投放、对话与成交数据中提取异常" />
        <div className="issue-grid">{['电话渠道 19:30 后接通率下降 22%', '主图 A 在 35 岁以上人群 CTR 低于均值', '价格敏感人群咨询后流失率偏高', '邮箱渠道高曝光低成交，需缩小人群'].map((x) => <div className="issue" key={x}><Activity size={16} />{x}</div>)}</div>
      </section>
      <section className="two-col">
        <div className="panel">
          <PanelHeader title="AI 生成的优化建议" desc="可采纳、自动执行、查看原因或回滚" />
          <div className="opt-list">{suggestions.map((x) => <div className="opt-item" key={x}><span>{x}</span><div><button>采纳优化</button><button className="secondary">查看原因</button></div></div>)}</div>
        </div>
        <div className="panel">
          <PanelHeader title="自动实验 A/B/C" desc="当前胜出版本：版本 C" />
          <div className="experiment">
            {['A：突出低价', 'B：突出品牌保障', 'C：免费安装评估'].map((x, i) => <div className={i === 2 ? 'winner' : ''} key={x}><strong>{x}</strong><span>CTR {['6.1%', '7.4%', '10.9%'][i]} · CVR {['8.8%', '10.3%', '13.2%'][i]}</span></div>)}
          </div>
          <div className="adjusted">
            <strong>系统已自动调整</strong>
            <p>App 内广告预算 +18%，电话外呼频次从每日 2 次降为 1 次，微信话术切换为“免费评估优先”。</p>
            <button><RefreshCcw size={16} /> 回滚上一个策略</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BillingPage() {
  return (
    <div className="page-grid">
      <section className="two-col">
        <div className="panel recharge">
          <PanelHeader title="账户余额" desc="支持预充值后自动投放扣费" />
          <strong className="balance">¥126,480.00</strong>
          <div className="amount-grid">{['¥5,000', '¥20,000', '¥50,000', '¥100,000'].map((x) => <button key={x}>{x}</button>)}</div>
          <button><CircleDollarSign size={16} /> 立即充值</button>
        </div>
        <div className="panel">
          <PanelHeader title="渠道消耗明细" desc="今日各渠道预算消耗" />
          <ChartBox height={250}><PieChart><Tooltip /><Pie data={channelRows} dataKey="leads" nameKey="name" outerRadius={88}>{channelRows.map((row, index) => <Cell key={row.name} fill={colors[index]} />)}</Pie></PieChart></ChartBox>
        </div>
      </section>
      <section className="panel"><PanelHeader title="消耗记录" desc="投放计划预算与扣费记录" /><DataTable columns={['时间', '计划', '渠道', '消耗', '余额']} rows={[['05-26 14:20', '618 新客线索加速计划', '微信销售', '¥2,860', '¥126,480'], ['05-26 13:00', '高客单价咨询转化', 'App 内广告', '¥4,200', '¥129,340'], ['05-26 11:30', '老客复购优惠召回', '电话销售', '¥1,160', '¥133,540']]} /></section>
      <section className="panel"><PanelHeader title="支付记录" desc="充值、发票与账户流水" /><DataTable columns={['订单号', '金额', '支付方式', '状态', '时间']} rows={[['PAY-88420', '¥50,000', '企业网银', '已到账', '05-25 09:12'], ['PAY-87311', '¥20,000', '支付宝', '已到账', '05-20 16:48']]} /></section>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page-grid">
      <section className="panel">
        <PanelHeader title="系统设置" desc="智能体权限、触达规则、数据安全与人工审核" />
        <div className="settings-grid">
          {['智能体自动执行需二次确认', '电话外呼每日频次上限 2 次', '敏感词命中转人工审核', '手机号脱敏展示', '低余额自动提醒', 'ROI 低于 2.5 自动暂停'].map((x) => <label key={x}><input type="checkbox" defaultChecked />{x}</label>)}
        </div>
      </section>
    </div>
  );
}

function PanelHeader({ title, desc }) {
  return <div className="panel-header"><div><h2>{title}</h2><p>{desc}</p></div></div>;
}

function ChartBox({ children, height = 220 }) {
  return <div style={{ height }}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}

function ChartPanel({ title, children }) {
  return <div className="panel"><PanelHeader title={title} desc="实时投放数据" /><ChartBox>{children}</ChartBox></div>;
}

function DataTable({ columns, rows }) {
  return <table className="data-table"><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>;
}

function StepShell({ title, desc, children }) {
  return <div><PanelHeader title={title} desc={desc} /><div className="choice-grid">{children}</div></div>;
}

function Choice({ title, desc, active, onClick }) {
  return <button className={`choice ${active ? 'active' : ''}`} onClick={onClick}><strong>{title}</strong><span>{desc}</span></button>;
}

function ChannelConfig({ name, budget }) {
  return <div className="channel-config"><strong>{name}</strong><span>预算 {budget}</span><span>话术：AI 推荐</span><span>发送时间：09:30-21:00</span><span>频次限制：每日 1-2 次</span></div>;
}

function PieIcon(props) {
  return <BarChart3 {...props} />;
}

createRoot(document.getElementById('root')).render(<App />);
