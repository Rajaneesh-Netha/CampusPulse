import { useState } from 'react';
import LogoMark from './LogoMark';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

/* ─── Constants ─────────────────────────────────────────── */
const BLOCKS_LIST = ['Block A', 'Block B', 'Block C', 'Block D', 'Library', 'Mess Hall'];

const ALL_COMPLAINTS = [
  { id: 'CP-001', title: 'Broken water pipe in washroom', category: 'Maintenance',    block: 'Block A',   incharge: 'Mr. Ramesh',  student: 'Rahul Sharma', rollNo: '22CSE1001', date: '2026-03-22', priority: 'High',   status: 'Pending',     sentiment: 'Negative' },
  { id: 'CP-002', title: 'AC not working in Room 310',   category: 'Maintenance',    block: 'Block B',   incharge: 'Ms. Kavita',  student: 'Priya Patel',  rollNo: '22CSE1042', date: '2026-03-22', priority: 'Medium', status: 'In Progress', sentiment: 'Negative' },
  { id: 'CP-003', title: 'Noisy construction near hostel', category: 'Infrastructure', block: 'Block A',  incharge: 'Mr. Ramesh',  student: 'Arjun Mehta', rollNo: '22CSE1078', date: '2026-03-21', priority: 'Low',    status: 'Pending',     sentiment: 'Negative' },
  { id: 'CP-004', title: 'Wi-Fi down in reading room',   category: 'Infrastructure', block: 'Block C',   incharge: 'Mr. Suresh',  student: 'Sneha Rao',   rollNo: '22CSE1089', date: '2026-03-21', priority: 'High',   status: 'Resolved',    sentiment: 'Neutral'  },
  { id: 'CP-005', title: 'Mess food quality poor',       category: 'Hostel',         block: 'Mess Hall', incharge: 'Mr. Venkat',  student: 'Karan Singh', rollNo: '22CSE1103', date: '2026-03-20', priority: 'Medium', status: 'Resolved',    sentiment: 'Negative' },
  { id: 'CP-006', title: 'Elevator out of service',      category: 'Infrastructure', block: 'Block B',   incharge: 'Ms. Kavita',  student: 'Divya Nair',  rollNo: '22CSE1115', date: '2026-03-23', priority: 'High',   status: 'Pending',     sentiment: 'Negative' },
  { id: 'CP-007', title: 'Ceiling fan makes loud noise', category: 'Maintenance',    block: 'Block A',   incharge: 'Mr. Ramesh',  student: 'Amit Kumar',  rollNo: '22CSE1056', date: '2026-03-23', priority: 'Low',    status: 'In Progress', sentiment: 'Neutral'  },
  { id: 'CP-008', title: 'Library computers crashing',   category: 'Academics',      block: 'Library',   incharge: 'Ms. Priya',   student: 'Ritu Verma',  rollNo: '22CSE1067', date: '2026-03-20', priority: 'Medium', status: 'Pending',     sentiment: 'Negative' },
  { id: 'CP-009', title: 'Lab projector not working',    category: 'Academics',      block: 'Block C',   incharge: 'Mr. Suresh',  student: 'Aryan Das',   rollNo: '22CSE1091', date: '2026-03-19', priority: 'High',   status: 'Resolved',    sentiment: 'Positive' },
  { id: 'CP-010', title: 'Hostel gate locked early',     category: 'Hostel',         block: 'Block D',   incharge: 'Ms. Lakshmi', student: 'Meena T',     rollNo: '22CSE1122', date: '2026-03-18', priority: 'Medium', status: 'Resolved',    sentiment: 'Neutral'  },
];

const INITIAL_INCHARGES = [
  {
    id: 1, name: 'Mr. Ramesh Kumar', email: 'ramesh@campuspulse.edu',
    phone: '9876543210', designation: 'Senior In-Charge', block: 'Block A',
    complaints: 3, resolved: 1, status: 'Active', avgRating: 3.8,
    feedback: [
      { by: 'Admin',    role: 'admin',   rating: 4, comment: 'Good response time but docs need improvement.', date: '2026-03-20', anonymous: false },
      { by: 'Student',  role: 'student', rating: 3, comment: 'Slow follow-up on the water pipe complaint.',   date: '2026-03-22', anonymous: true  },
      { by: 'Dr. Nair', role: 'admin',   rating: 4, comment: 'Shows initiative on preventive maintenance.',  date: '2026-03-24', anonymous: false },
    ],
  },
  {
    id: 2, name: 'Ms. Kavita Singh', email: 'kavita@campuspulse.edu',
    phone: '9812345678', designation: 'In-Charge', block: 'Block B',
    complaints: 2, resolved: 0, status: 'Active', avgRating: 2.5,
    feedback: [
      { by: 'Student', role: 'student', rating: 2, comment: 'Elevator issue ignored for 3 days.', date: '2026-03-23', anonymous: true },
      { by: 'Admin',   role: 'admin',   rating: 3, comment: 'Communication could be better.',      date: '2026-03-21', anonymous: false },
    ],
  },
  {
    id: 3, name: 'Mr. Suresh Babu', email: 'suresh@campuspulse.edu',
    phone: '9823456789', designation: 'In-Charge', block: 'Block C',
    complaints: 2, resolved: 2, status: 'Active', avgRating: 4.5,
    feedback: [
      { by: 'Student', role: 'student', rating: 5, comment: 'Fixed the projector same day!',    date: '2026-03-19', anonymous: false },
      { by: 'Admin',   role: 'admin',   rating: 4, comment: 'Excellent resolution rate — keep it up.', date: '2026-03-21', anonymous: false },
    ],
  },
  {
    id: 4, name: 'Ms. Priya Menon', email: 'priya@campuspulse.edu',
    phone: '9834567890', designation: 'Library In-Charge', block: 'Library',
    complaints: 1, resolved: 0, status: 'Active', avgRating: 3.0,
    feedback: [
      { by: 'Student', role: 'student', rating: 3, comment: 'Yet to receive an update on the computer issue.', date: '2026-03-20', anonymous: true },
    ],
  },
  {
    id: 5, name: 'Mr. Venkat Rao', email: 'venkat@campuspulse.edu',
    phone: '9845678901', designation: 'Mess In-Charge', block: 'Mess Hall',
    complaints: 1, resolved: 1, status: 'Inactive', avgRating: 3.2,
    feedback: [
      { by: 'Student', role: 'student', rating: 3, comment: 'Issues eventually fixed but took too long.', date: '2026-03-20', anonymous: true },
    ],
  },
  {
    id: 6, name: 'Ms. Lakshmi D', email: 'lakshmi@campuspulse.edu',
    phone: '9856789012', designation: 'In-Charge', block: 'Block D',
    complaints: 1, resolved: 1, status: 'Active', avgRating: 4.2,
    feedback: [
      { by: 'Admin',   role: 'admin',   rating: 4, comment: 'Proactive in resolving hostel issues.',  date: '2026-03-18', anonymous: false },
      { by: 'Student', role: 'student', rating: 4, comment: 'Quick resolution on gate timing issue.', date: '2026-03-19', anonymous: false },
    ],
  },
];

const CATEGORY_STATS = [
  { label: 'Maintenance',    count: 3, color: '#667eea', pct: 30 },
  { label: 'Infrastructure', count: 3, color: '#3b82f6', pct: 30 },
  { label: 'Hostel',         count: 2, color: '#f59e0b', pct: 20 },
  { label: 'Academics',      count: 2, color: '#10b981', pct: 20 },
];

const PRIORITY_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const PRIORITY_BG    = { High: '#fef2f2', Medium: '#fffbeb', Low: '#ecfdf5' };
const STATUS_COLOR   = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' };
const STATUS_BG      = { Pending: '#fffbeb', 'In Progress': '#eff6ff', Resolved: '#ecfdf5' };
const SENTIMENT_COLOR = { Positive: '#10b981', Neutral: '#f59e0b', Negative: '#ef4444' };

const TREND = [
  { day: 'Mon', raised: 5, resolved: 3 },
  { day: 'Tue', raised: 8, resolved: 6 },
  { day: 'Wed', raised: 3, resolved: 5 },
  { day: 'Thu', raised: 10, resolved: 7 },
  { day: 'Fri', raised: 6, resolved: 9 },
  { day: 'Sat', raised: 4, resolved: 4 },
  { day: 'Sun', raised: 2, resolved: 2 },
];

const NAV_ITEMS = [
  { id: 'overview',   icon: '📊', label: 'Overview' },
  { id: 'complaints', icon: '📋', label: 'All Complaints' },
  { id: 'users',      icon: '👥', label: 'In-Charges' },
  { id: 'analytics',  icon: '📈', label: 'Analytics' },
  { id: 'settings',   icon: '⚙️',  label: 'Settings' },
];

/* ─── Performance scoring ───────────────────────────────── */
function calcPerf(ic) {
  const resRate   = ic.complaints > 0 ? (ic.resolved / ic.complaints) : 0;
  const ratingPct = ic.avgRating / 5;
  const activePts = ic.status === 'Active' ? 10 : 0;
  const score     = Math.round(resRate * 50 + ratingPct * 40 + activePts);

  let badge, badgeColor, badgeBg;
  if (score >= 80)      { badge = '🚀 Promote';            badgeColor = '#065f46'; badgeBg = '#d1fae5'; }
  else if (score >= 65) { badge = '💰 Eligible for Hike';  badgeColor = '#1e40af'; badgeBg = '#dbeafe'; }
  else if (score >= 45) { badge = '✅ Satisfactory';        badgeColor = '#92400e'; badgeBg = '#fef3c7'; }
  else                  { badge = '⚠️ Needs Improvement';  badgeColor = '#991b1b'; badgeBg = '#fee2e2'; }

  return { score, badge, badgeColor, badgeBg };
}

/* ─── Star renderer ─────────────────────────────────────── */
function Stars({ value, max = 5, onSelect = null }) {
  return (
    <span className="ad-stars">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`ad-star ${i < Math.round(value) ? 'ad-star--on' : ''} ${onSelect ? 'ad-star--clickable' : ''}`}
          onClick={() => onSelect && onSelect(i + 1)}
        >★</span>
      ))}
    </span>
  );
}

/* ─── Empty BLOCKS check ────────────────────────────────── */
function unassignedBlocks(incharges) {
  const taken = new Set(incharges.filter(i => i.status === 'Active').map(i => i.block));
  return BLOCKS_LIST.filter(b => !taken.has(b));
}

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  /* existing state */
  const [complaints, setComplaints] = useState(ALL_COMPLAINTS);
  const [activeNav,  setActiveNav]  = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filter, setFilter]  = useState('All');
  const [search, setSearch]  = useState('');
  const [selected, setSelected] = useState(null);

  /* in-charge state */
  const [incharges, setIncharges]   = useState(INITIAL_INCHARGES);
  const [usersTab,  setUsersTab]    = useState('assignments');

  /* modals */
  const [showAddIC,       setShowAddIC]       = useState(false);
  const [reassignTarget,  setReassignTarget]  = useState(null); // ic object
  const [removeTarget,    setRemoveTarget]    = useState(null); // ic object
  const [feedbackTarget,  setFeedbackTarget]  = useState(null); // ic object

  /* form state */
  const blankIC = { name:'', email:'', phone:'', designation:'', block: BLOCKS_LIST[0] };
  const [newIC, setNewIC] = useState(blankIC);
  const [reassignBlock, setReassignBlock] = useState('');
  const [fbForm, setFbForm] = useState({ rating: 0, comment: '', anonymous: false });

  /* helpers */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/student/login');
  };

  const updateStatus = (id, s) => {
    setComplaints(p => p.map(c => c.id === id ? { ...c, status: s } : c));
    if (selected?.id === id) setSelected(p => ({ ...p, status: s }));
  };

  const filtered = complaints.filter(c => {
    const mF = filter === 'All' || c.status === filter;
    const mS = c.title.toLowerCase().includes(search.toLowerCase()) ||
               c.student.toLowerCase().includes(search.toLowerCase()) ||
               c.block.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === 'Pending').length;
  const progress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const resRate  = Math.round((resolved / total) * 100);
  const maxTrend = Math.max(...TREND.map(t => Math.max(t.raised, t.resolved)));

  /* in-charge handlers */
  const addIncharge = () => {
    if (!newIC.name.trim() || !newIC.email.trim()) return;
    const nextId = Math.max(...incharges.map(i => i.id), 0) + 1;
    setIncharges(p => [...p, {
      id: nextId, ...newIC,
      complaints: 0, resolved: 0, status: 'Active', avgRating: 0, feedback: [],
    }]);
    setNewIC(blankIC);
    setShowAddIC(false);
  };

  const removeIncharge = (id) => {
    setIncharges(p => p.filter(i => i.id !== id));
    setRemoveTarget(null);
  };

  const toggleStatus = (id) => {
    setIncharges(p => p.map(i => i.id === id ? { ...i, status: i.status === 'Active' ? 'Inactive' : 'Active' } : i));
  };

  const doReassign = () => {
    if (!reassignBlock) return;
    setIncharges(p => p.map(i => i.id === reassignTarget.id ? { ...i, block: reassignBlock } : i));
    setReassignTarget(null);
    setReassignBlock('');
  };

  const submitFeedback = () => {
    if (fbForm.rating === 0) return;
    setIncharges(p => p.map(ic => {
      if (ic.id !== feedbackTarget.id) return ic;
      const newFb = {
        by: fbForm.anonymous ? 'Anonymous' : 'Admin',
        role: 'admin', rating: fbForm.rating,
        comment: fbForm.comment,
        date: new Date().toISOString().split('T')[0],
        anonymous: fbForm.anonymous,
      };
      const allFb   = [...ic.feedback, newFb];
      const avgRating = parseFloat((allFb.reduce((s, f) => s + f.rating, 0) / allFb.length).toFixed(1));
      return { ...ic, feedback: allFb, avgRating };
    }));
    setFbForm({ rating: 0, comment: '', anonymous: false });
    setFeedbackTarget(null);
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="ad-root">

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className={`ad-sidebar ${sidebarOpen ? 'ad-sidebar--open' : 'ad-sidebar--collapsed'}`}>
        <div className="ad-sidebar-brand">
          <LogoMark variant="colored" showText={sidebarOpen} size={36} />
        </div>
        <nav className="ad-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`ad-nav-item ${activeNav === item.id ? 'ad-nav-item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="ad-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <div className="ad-user-chip">
            <div className="ad-user-avatar">A</div>
            {sidebarOpen && (
              <div className="ad-user-info">
                <span className="ad-user-name">Admin</span>
                <span className="ad-user-role">Full Access</span>
              </div>
            )}
          </div>
          <button className="ad-logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────── */}
      <div className="ad-main">

        {/* Topbar */}
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button className="ad-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="ad-page-title">
                {activeNav === 'overview'   && 'System Overview'}
                {activeNav === 'complaints' && 'All Complaints'}
                {activeNav === 'users'      && 'In-Charge Management'}
                {activeNav === 'analytics'  && 'Analytics & Reports'}
                {activeNav === 'settings'   && 'System Settings'}
              </h1>
              <p className="ad-page-sub">CampusPulse — {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
            </div>
          </div>
          <div className="ad-topbar-right">
            <span className="ad-res-rate">
              <span className="ad-res-rate-val">{resRate}%</span>
              <span className="ad-res-rate-label">Resolution Rate</span>
            </span>
            <div className="ad-notif-btn">🔔<span className="ad-notif-dot">{pending}</span></div>
            <div className="ad-admin-chip">
              <div className="ad-admin-avatar">A</div>
              <div className="ad-admin-info">
                <span className="ad-admin-name">Administrator</span>
                <span className="ad-admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Overview ────────────────────────────────── */}
        {activeNav === 'overview' && (
          <div className="ad-content">
            <div className="ad-kpi-row">
              {[
                { label:'Total Complaints', value: total,    icon:'📋', color:'#667eea', bg:'#eef2ff', sub: 'All time' },
                { label:'Pending',          value: pending,  icon:'⏳', color:'#f59e0b', bg:'#fffbeb', sub: 'Needs action' },
                { label:'In Progress',      value: progress, icon:'🔄', color:'#3b82f6', bg:'#eff6ff', sub: 'Being resolved' },
                { label:'Resolved',         value: resolved, icon:'✅', color:'#10b981', bg:'#ecfdf5', sub: `${resRate}% rate` },
              ].map(k => (
                <div key={k.label} className="ad-kpi-card">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
                  <div>
                    <p className="ad-kpi-value">{k.value}</p>
                    <p className="ad-kpi-label">{k.label}</p>
                    <p className="ad-kpi-sub">{k.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ad-charts-row">
              <div className="ad-chart-card ad-chart-card--wide">
                <h3 className="ad-chart-title">Weekly Complaint Trend</h3>
                <p className="ad-chart-sub">Complaints raised vs resolved this week</p>
                <div className="ad-bar-chart">
                  {TREND.map(t => (
                    <div key={t.day} className="ad-bar-group">
                      <div className="ad-bar-pair">
                        <div className="ad-bar ad-bar--raised"   style={{ height: `${(t.raised/maxTrend)*100}%` }}><span className="ad-bar-tip">{t.raised}</span></div>
                        <div className="ad-bar ad-bar--resolved" style={{ height: `${(t.resolved/maxTrend)*100}%` }}><span className="ad-bar-tip">{t.resolved}</span></div>
                      </div>
                      <span className="ad-bar-day">{t.day}</span>
                    </div>
                  ))}
                </div>
                <div className="ad-bar-legend">
                  <span><span className="ad-legend-dot" style={{background:'#667eea'}}/>Raised</span>
                  <span><span className="ad-legend-dot" style={{background:'#10b981'}}/>Resolved</span>
                </div>
              </div>

              <div className="ad-chart-card">
                <h3 className="ad-chart-title">By Category</h3>
                <p className="ad-chart-sub">Distribution across complaint types</p>
                <div className="ad-cat-list">
                  {CATEGORY_STATS.map(cat => (
                    <div key={cat.label} className="ad-cat-item">
                      <div className="ad-cat-header"><span className="ad-cat-name">{cat.label}</span><span className="ad-cat-count">{cat.count}</span></div>
                      <div className="ad-cat-bar-bg"><div className="ad-cat-bar-fill" style={{ width: `${cat.pct}%`, background: cat.color }}/></div>
                    </div>
                  ))}
                </div>
                <h3 className="ad-chart-title" style={{marginTop:'1.5rem'}}>Sentiment Analysis</h3>
                <div className="ad-sentiment-row">
                  {[
                    { label:'Negative', count: complaints.filter(c=>c.sentiment==='Negative').length, color:'#ef4444', bg:'#fef2f2' },
                    { label:'Neutral',  count: complaints.filter(c=>c.sentiment==='Neutral').length,  color:'#f59e0b', bg:'#fffbeb' },
                    { label:'Positive', count: complaints.filter(c=>c.sentiment==='Positive').length, color:'#10b981', bg:'#ecfdf5' },
                  ].map(s => (
                    <div key={s.label} className="ad-sent-card" style={{ background: s.bg }}>
                      <span className="ad-sent-val" style={{ color: s.color }}>{s.count}</span>
                      <span className="ad-sent-label" style={{ color: s.color }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ad-table-card">
              <div className="ad-section-header">
                <h3 className="ad-chart-title">Recent Complaints</h3>
                <button className="ad-view-all-btn" onClick={() => setActiveNav('complaints')}>View All →</button>
              </div>
              {renderTable(complaints.slice(0,5), updateStatus, setSelected, false)}
            </div>
          </div>
        )}

        {/* ── All Complaints ──────────────────────────── */}
        {activeNav === 'complaints' && (
          <div className="ad-content">
            <div className="ad-toolbar">
              <div className="ad-filter-tabs">
                {['All','Pending','In Progress','Resolved'].map(f => (
                  <button key={f} className={`ad-filter-btn ${filter===f ? 'ad-filter-btn--active' : ''}`} onClick={() => setFilter(f)}>
                    {f}<span className="ad-filter-count">{f==='All' ? complaints.length : complaints.filter(c=>c.status===f).length}</span>
                  </button>
                ))}
              </div>
              <div className="ad-search-wrap">
                <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input className="ad-search" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
            </div>
            <div className="ad-table-card">
              {renderTable(filtered, updateStatus, setSelected, true)}
            </div>
          </div>
        )}

        {/* ── In-Charges (with sub-tabs) ──────────────── */}
        {activeNav === 'users' && (
          <div className="ad-content">

            {/* Sub-tab switcher */}
            <div className="ad-subtabs">
              <button className={`ad-subtab ${usersTab==='assignments' ? 'ad-subtab--active' : ''}`} onClick={() => setUsersTab('assignments')}>
                🏢 Block Assignments
              </button>
              <button className={`ad-subtab ${usersTab==='performance' ? 'ad-subtab--active' : ''}`} onClick={() => setUsersTab('performance')}>
                ⭐ Performance & Feedback
              </button>
            </div>

            {/* ── Assignments sub-tab ────────────────── */}
            {usersTab === 'assignments' && (
              <>
                {/* Header toolbar */}
                <div className="ad-assign-toolbar">
                  <div>
                    <h3 className="ad-assign-title">Block Assignment Manager</h3>
                    <p className="ad-assign-sub">{incharges.filter(i=>i.status==='Active').length} active in-charges · {unassignedBlocks(incharges).length} unassigned blocks</p>
                  </div>
                  <button className="ad-add-ic-btn" onClick={() => setShowAddIC(true)}>
                    + Add In-Charge
                  </button>
                </div>

                {/* Block → In-charge mapping grid */}
                <div className="ad-block-assign-grid">
                  {BLOCKS_LIST.map(block => {
                    const ic = incharges.find(i => i.block === block && i.status === 'Active');
                    return (
                      <div key={block} className={`ad-block-card ${!ic ? 'ad-block-card--empty' : ''}`}>
                        <div className="ad-block-card-header">
                          <span className="ad-block-icon">🏢</span>
                          <span className="ad-block-name">{block}</span>
                          {ic
                            ? <span className="ad-status-badge ad-status-badge--active">Assigned</span>
                            : <span className="ad-status-badge ad-status-badge--inactive">Vacant</span>
                          }
                        </div>
                        {ic ? (
                          <>
                            <div className="ad-block-ic-info">
                              <div className="ad-block-ic-avatar">{ic.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                              <div>
                                <p className="ad-block-ic-name">{ic.name}</p>
                                <p className="ad-block-ic-desig">{ic.designation}</p>
                                <p className="ad-block-ic-contact">📧 {ic.email}</p>
                              </div>
                            </div>
                            <div className="ad-block-stats">
                              <span className="ad-bstat"><strong>{ic.complaints}</strong> cases</span>
                              <span className="ad-bstat"><strong>{ic.resolved}</strong> resolved</span>
                              <span className="ad-bstat"><Stars value={ic.avgRating} /> {ic.avgRating}</span>
                            </div>
                            <div className="ad-block-actions">
                              <button className="ad-bact-btn ad-bact-btn--reassign" onClick={() => { setReassignTarget(ic); setReassignBlock(block); }}>
                                🔄 Reassign
                              </button>
                              <button className="ad-bact-btn ad-bact-btn--suspend" onClick={() => toggleStatus(ic.id)}>
                                ⏸ Suspend
                              </button>
                              <button className="ad-bact-btn ad-bact-btn--remove" onClick={() => setRemoveTarget(ic)}>
                                🗑 Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="ad-block-vacant">
                            <p className="ad-block-vacant-txt">No in-charge assigned</p>
                            <button className="ad-add-ic-btn" style={{fontSize:'0.78rem',padding:'0.4rem 0.9rem'}} onClick={() => { setNewIC({...blankIC, block}); setShowAddIC(true); }}>
                              + Assign
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Suspended in-charges */}
                {incharges.some(i => i.status === 'Inactive') && (
                  <div className="ad-suspended-section">
                    <h4 className="ad-suspended-title">⏸ Suspended In-Charges</h4>
                    <div className="ad-suspended-list">
                      {incharges.filter(i => i.status === 'Inactive').map(ic => (
                        <div key={ic.id} className="ad-suspended-row">
                          <span className="ad-susp-name">{ic.name}</span>
                          <span className="ad-susp-block">{ic.block}</span>
                          <button className="ad-bact-btn ad-bact-btn--reassign" onClick={() => toggleStatus(ic.id)}>▶ Reactivate</button>
                          <button className="ad-bact-btn ad-bact-btn--remove" onClick={() => setRemoveTarget(ic)}>🗑 Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Performance sub-tab ───────────────── */}
            {usersTab === 'performance' && (
              <>
                <div className="ad-perf-header">
                  <div>
                    <h3 className="ad-assign-title">Performance Dashboard</h3>
                    <p className="ad-assign-sub">AI-generated recommendations based on resolution rate, ratings & feedback</p>
                  </div>
                </div>

                {/* Score legend */}
                <div className="ad-perf-legend">
                  {[['🚀 Promote','#d1fae5','#065f46','Score ≥ 80'],['💰 Hike','#dbeafe','#1e40af','Score ≥ 65'],['✅ Satisfactory','#fef3c7','#92400e','Score ≥ 45'],['⚠️ Needs Improvement','#fee2e2','#991b1b','Score < 45']].map(([b,bg,c,hint])=>(
                    <span key={b} className="ad-perf-legend-item" style={{background:bg,color:c}}>{b} <small style={{opacity:0.7}}>({hint})</small></span>
                  ))}
                </div>

                <div className="ad-perf-grid">
                  {incharges.map(ic => {
                    const { score, badge, badgeColor, badgeBg } = calcPerf(ic);
                    return (
                      <div key={ic.id} className="ad-perf-card">
                        {/* Header */}
                        <div className="ad-perf-card-top">
                          <div className="ad-block-ic-avatar" style={{width:44,height:44,fontSize:'1rem'}}>
                            {ic.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <p className="ad-block-ic-name">{ic.name}</p>
                            <p className="ad-block-ic-desig">{ic.block} · {ic.designation}</p>
                          </div>
                          <span className="ad-status-badge" style={{background:badgeBg, color:badgeColor, border:`1px solid ${badgeColor}22`}}>{badge}</span>
                        </div>

                        {/* Score bar */}
                        <div className="ad-score-row">
                          <span className="ad-score-label">Performance Score</span>
                          <span className="ad-score-num" style={{color: badgeColor}}>{score}/100</span>
                        </div>
                        <div className="ad-score-bar-bg">
                          <div className="ad-score-bar-fill" style={{ width:`${score}%`, background: score>=80?'#10b981':score>=65?'#3b82f6':score>=45?'#f59e0b':'#ef4444' }} />
                        </div>

                        {/* Stats grid */}
                        <div className="ad-perf-stats">
                          <div className="ad-perf-stat">
                            <span className="ad-perf-stat-val">{ic.complaints > 0 ? Math.round((ic.resolved/ic.complaints)*100) : 0}%</span>
                            <span className="ad-perf-stat-lbl">Resolution</span>
                          </div>
                          <div className="ad-perf-stat">
                            <span className="ad-perf-stat-val">{ic.resolved}</span>
                            <span className="ad-perf-stat-lbl">Resolved</span>
                          </div>
                          <div className="ad-perf-stat">
                            <span className="ad-perf-stat-val">{ic.feedback.length}</span>
                            <span className="ad-perf-stat-lbl">Reviews</span>
                          </div>
                        </div>

                        {/* Star rating */}
                        <div className="ad-perf-rating-row">
                          <Stars value={ic.avgRating} />
                          <span className="ad-perf-rating-num">{ic.avgRating > 0 ? ic.avgRating.toFixed(1) : 'No ratings'}</span>
                        </div>

                        {/* Recent feedback */}
                        {ic.feedback.length > 0 && (
                          <div className="ad-fb-excerpts">
                            {ic.feedback.slice(-2).map((f, fi) => (
                              <div key={fi} className="ad-fb-excerpt">
                                <div className="ad-fb-excerpt-top">
                                  <Stars value={f.rating} />
                                  <span className="ad-fb-excerpt-by">{f.anonymous ? 'Anonymous' : f.by}</span>
                                  <span className="ad-fb-excerpt-role ad-fb-role--{f.role}">{f.role}</span>
                                  <span className="ad-fb-excerpt-date">{f.date}</span>
                                </div>
                                {f.comment && <p className="ad-fb-excerpt-comment">"{f.comment}"</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="ad-perf-actions">
                          <button className="ad-bact-btn ad-bact-btn--reassign" style={{flex:1}} onClick={() => { setFeedbackTarget(ic); setFbForm({ rating:0, comment:'', anonymous:false }); }}>
                            ✍️ Give Feedback
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Analytics ──────────────────────────────── */}
        {activeNav === 'analytics' && (
          <div className="ad-content">
            <div className="ad-charts-row">
              <div className="ad-chart-card ad-chart-card--wide">
                <h3 className="ad-chart-title">Full Weekly Trend</h3>
                <p className="ad-chart-sub">Complaints raised vs resolved — last 7 days</p>
                <div className="ad-bar-chart">
                  {TREND.map(t => (
                    <div key={t.day} className="ad-bar-group">
                      <div className="ad-bar-pair">
                        <div className="ad-bar ad-bar--raised"   style={{ height: `${(t.raised/maxTrend)*100}%` }}><span className="ad-bar-tip">{t.raised}</span></div>
                        <div className="ad-bar ad-bar--resolved" style={{ height: `${(t.resolved/maxTrend)*100}%` }}><span className="ad-bar-tip">{t.resolved}</span></div>
                      </div>
                      <span className="ad-bar-day">{t.day}</span>
                    </div>
                  ))}
                </div>
                <div className="ad-bar-legend">
                  <span><span className="ad-legend-dot" style={{background:'#667eea'}}/>Raised</span>
                  <span><span className="ad-legend-dot" style={{background:'#10b981'}}/>Resolved</span>
                </div>
              </div>
              <div className="ad-chart-card">
                <h3 className="ad-chart-title">Performance by In-Charge</h3>
                <p className="ad-chart-sub">Resolution rate per block</p>
                <div className="ad-cat-list">
                  {incharges.filter(u=>u.complaints>0).map(u => (
                    <div key={u.name} className="ad-cat-item">
                      <div className="ad-cat-header">
                        <span className="ad-cat-name">{u.block}</span>
                        <span className="ad-cat-count">{u.complaints > 0 ? Math.round((u.resolved/u.complaints)*100) : 0}%</span>
                      </div>
                      <div className="ad-cat-bar-bg">
                        <div className="ad-cat-bar-fill" style={{ width: `${u.complaints > 0 ? (u.resolved/u.complaints)*100 : 0}%`, background: '#667eea' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ad-chart-card" style={{width:'100%'}}>
              <h3 className="ad-chart-title">Block Heatmap — Complaints Concentration</h3>
              <p className="ad-chart-sub">Higher count = darker shade</p>
              <div className="ad-heatmap">
                {Object.entries(complaints.reduce((acc,c) => { acc[c.block] = (acc[c.block]||0)+1; return acc; }, {}))
                  .sort((a,b)=>b[1]-a[1])
                  .map(([block, cnt]) => {
                    const intensity = Math.min(cnt/4, 1);
                    return (
                      <div key={block} className="ad-heatmap-cell" style={{ background: `rgba(102,126,234,${0.1 + intensity*0.7})` }}>
                        <span className="ad-heatmap-block">{block}</span>
                        <span className="ad-heatmap-count">{cnt}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ── Settings ───────────────────────────────── */}
        {activeNav === 'settings' && (
          <div className="ad-content">
            <div className="ad-settings-grid">
              {[
                { title:'System Notifications', desc:'Configure email & SMS alerts for new complaints and status changes.', icon:'🔔', action:'Configure' },
                { title:'Priority Rules',       desc:'Set auto-escalation rules based on complaint age and category.', icon:'⚡', action:'Edit Rules' },
                { title:'NLP Model Settings',   desc:'Adjust AI classification thresholds and spam detection sensitivity.', icon:'🤖', action:'Tune Model' },
                { title:'User Management',      desc:'Add, remove, or reassign in-charges to blocks and floors.', icon:'👥', action:'Manage Users', nav:'users' },
                { title:'Data Export',          desc:'Export complaint logs, analytics data and audit trails as CSV/PDF.', icon:'📤', action:'Export Data' },
                { title:'Audit Log',            desc:'Full trail of all admin actions and system events.', icon:'📜', action:'View Logs' },
              ].map(s => (
                <div key={s.title} className="ad-setting-card">
                  <div className="ad-setting-icon">{s.icon}</div>
                  <div className="ad-setting-body">
                    <h4 className="ad-setting-title">{s.title}</h4>
                    <p className="ad-setting-desc">{s.desc}</p>
                  </div>
                  <button className="ad-setting-btn" onClick={() => s.nav && setActiveNav(s.nav)}>{s.action} →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Complaint detail modal ──────────────────────── */}
      {selected && (
        <div className="ad-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div>
                <span className="ad-modal-id">{selected.id}</span>
                <h2 className="ad-modal-title">{selected.title}</h2>
              </div>
              <button className="ad-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="ad-modal-grid">
              {[
                ['Student', `${selected.student} (${selected.rollNo})`],
                ['Location', selected.block],
                ['In-Charge', selected.incharge],
                ['Filed On', selected.date],
                ['Category', selected.category],
                ['Priority', selected.priority],
              ].map(([k,v]) => (
                <div key={k} className="ad-meta-item">
                  <span className="ad-meta-key">{k}</span>
                  <span className="ad-meta-val">{v}</span>
                </div>
              ))}
              <div className="ad-meta-item">
                <span className="ad-meta-key">Status</span>
                <span className="ad-tag" style={{ color: STATUS_COLOR[selected.status], background: STATUS_BG[selected.status] }}>{selected.status}</span>
              </div>
              <div className="ad-meta-item">
                <span className="ad-meta-key">Sentiment</span>
                <span className="ad-tag" style={{ color: SENTIMENT_COLOR[selected.sentiment], background: '#f8faff' }}>{selected.sentiment}</span>
              </div>
            </div>
            <div className="ad-modal-actions">
              {selected.status !== 'Resolved' && (
                <button className="ad-action-btn ad-action-btn--resolve ad-modal-btn" onClick={() => updateStatus(selected.id, 'Resolved')}>✓ Mark Resolved</button>
              )}
              {selected.status === 'Pending' && (
                <button className="ad-action-btn ad-action-btn--progress ad-modal-btn" onClick={() => updateStatus(selected.id, 'In Progress')}>▶ In Progress</button>
              )}
              <button className="ad-action-btn ad-action-btn--close ad-modal-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add In-Charge modal ─────────────────────────── */}
      {showAddIC && (
        <div className="ad-modal-overlay" onClick={() => setShowAddIC(false)}>
          <div className="ad-modal ad-modal--form" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2 className="ad-modal-title">Add New In-Charge</h2>
              <button className="ad-modal-close" onClick={() => setShowAddIC(false)}>✕</button>
            </div>
            <div className="ad-form-grid">
              {[
                { label:'Full Name *',    key:'name',        placeholder:'e.g. Mr. Raj Kumar', type:'text' },
                { label:'College Email *',key:'email',       placeholder:'raj@campuspulse.edu', type:'email' },
                { label:'Phone',          key:'phone',       placeholder:'10-digit mobile',     type:'tel' },
                { label:'Designation',    key:'designation', placeholder:'e.g. Senior In-Charge',type:'text' },
              ].map(f => (
                <div key={f.key} className="ad-form-group">
                  <label className="ad-form-label">{f.label}</label>
                  <input className="ad-form-input" type={f.type} placeholder={f.placeholder}
                    value={newIC[f.key]} onChange={e => setNewIC(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="ad-form-group ad-form-group--full">
                <label className="ad-form-label">Assign Block *</label>
                <select className="ad-form-input" value={newIC.block} onChange={e => setNewIC(p => ({ ...p, block: e.target.value }))}>
                  {BLOCKS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-action-btn ad-action-btn--resolve ad-modal-btn" onClick={addIncharge}>✓ Add In-Charge</button>
              <button className="ad-action-btn ad-action-btn--close ad-modal-btn" onClick={() => setShowAddIC(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reassign modal ──────────────────────────────── */}
      {reassignTarget && (
        <div className="ad-modal-overlay" onClick={() => setReassignTarget(null)}>
          <div className="ad-modal ad-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2 className="ad-modal-title">Reassign In-Charge</h2>
              <button className="ad-modal-close" onClick={() => setReassignTarget(null)}>✕</button>
            </div>
            <p style={{padding:'0 1.5rem', fontSize:'0.88rem', color:'#64748b', marginBottom:'1rem'}}>
              Moving <strong>{reassignTarget.name}</strong> from <strong>{reassignTarget.block}</strong> to:
            </p>
            <div className="ad-form-group" style={{padding:'0 1.5rem', marginBottom:'1.5rem'}}>
              <label className="ad-form-label">New Block</label>
              <select className="ad-form-input" value={reassignBlock} onChange={e => setReassignBlock(e.target.value)}>
                {BLOCKS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-action-btn ad-action-btn--resolve ad-modal-btn" onClick={doReassign}>✓ Confirm Reassign</button>
              <button className="ad-action-btn ad-action-btn--close ad-modal-btn" onClick={() => setReassignTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove confirm modal ────────────────────────── */}
      {removeTarget && (
        <div className="ad-modal-overlay" onClick={() => setRemoveTarget(null)}>
          <div className="ad-modal ad-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2 className="ad-modal-title" style={{color:'#ef4444'}}>⚠️ Remove In-Charge</h2>
              <button className="ad-modal-close" onClick={() => setRemoveTarget(null)}>✕</button>
            </div>
            <p style={{padding:'0.5rem 1.5rem 1.5rem', fontSize:'0.9rem', color:'#64748b'}}>
              Are you sure you want to permanently remove <strong>{removeTarget.name}</strong> from <strong>{removeTarget.block}</strong>? This action cannot be undone.
            </p>
            <div className="ad-modal-actions">
              <button className="ad-action-btn ad-modal-btn" style={{background:'#ef4444',color:'white'}} onClick={() => removeIncharge(removeTarget.id)}>🗑 Remove Permanently</button>
              <button className="ad-action-btn ad-action-btn--close ad-modal-btn" onClick={() => setRemoveTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Feedback modal ──────────────────────────────── */}
      {feedbackTarget && (
        <div className="ad-modal-overlay" onClick={() => setFeedbackTarget(null)}>
          <div className="ad-modal ad-modal--form" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div>
                <h2 className="ad-modal-title">Submit Feedback</h2>
                <p style={{fontSize:'0.82rem',color:'#94a3b8',marginTop:2}}>For {feedbackTarget.name} · {feedbackTarget.block}</p>
              </div>
              <button className="ad-modal-close" onClick={() => setFeedbackTarget(null)}>✕</button>
            </div>

            <div style={{padding:'0 1.5rem 1.5rem'}}>
              {/* Star picker */}
              <div className="ad-form-group">
                <label className="ad-form-label">Overall Rating *</label>
                <div className="ad-star-picker">
                  <Stars value={fbForm.rating} onSelect={r => setFbForm(p => ({...p, rating:r}))} />
                  <span className="ad-star-hint">
                    {fbForm.rating === 0 ? 'Select rating' : ['','Poor','Fair','Good','Very Good','Excellent'][fbForm.rating]}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="ad-form-group">
                <label className="ad-form-label">Review Comment</label>
                <textarea className="ad-form-input ad-form-textarea" rows={3}
                  placeholder="Describe the in-charge's performance, responsiveness, and professionalism…"
                  value={fbForm.comment} onChange={e => setFbForm(p => ({...p, comment:e.target.value}))}
                />
              </div>

              {/* Anonymous toggle */}
              <label className="ad-anon-toggle">
                <input type="checkbox" checked={fbForm.anonymous} onChange={e => setFbForm(p => ({...p, anonymous:e.target.checked}))} />
                <span>Submit anonymously</span>
              </label>

              {/* Recommendation preview */}
              {fbForm.rating > 0 && (() => {
                const simIC = { ...feedbackTarget, avgRating: fbForm.rating };
                const { badge, badgeColor, badgeBg } = calcPerf(simIC);
                return (
                  <div className="ad-feedback-preview">
                    <span style={{fontSize:'0.78rem',color:'#94a3b8'}}>Recommendation preview based on this rating:</span>
                    <span className="ad-status-badge" style={{background:badgeBg,color:badgeColor,border:`1px solid ${badgeColor}22`,marginLeft:8}}>{badge}</span>
                  </div>
                );
              })()}
            </div>

            <div className="ad-modal-actions">
              <button className="ad-action-btn ad-action-btn--resolve ad-modal-btn"
                onClick={submitFeedback} disabled={fbForm.rating===0}
                style={{opacity: fbForm.rating===0 ? 0.5 : 1}}>
                ✓ Submit Feedback
              </button>
              <button className="ad-action-btn ad-action-btn--close ad-modal-btn" onClick={() => setFeedbackTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Shared table renderer ───────────────────────────────── */
function renderTable(rows, updateStatus, setSelected, showIncharge) {
  const PRIORITY_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  const PRIORITY_BG    = { High: '#fef2f2', Medium: '#fffbeb', Low: '#ecfdf5' };
  const STATUS_COLOR   = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' };
  const STATUS_BG      = { Pending: '#fffbeb', 'In Progress': '#eff6ff', Resolved: '#ecfdf5' };

  return (
    <div className="ad-table-wrap">
      <div className={`ad-table-header ${showIncharge ? 'ad-col-7' : 'ad-col-6'}`}>
        <span>Complaint</span><span>Category</span><span>Block</span>
        {showIncharge && <span>In-Charge</span>}
        <span>Priority</span><span>Status</span><span>Actions</span>
      </div>
      <div className="ad-table-body">
        {rows.length === 0 && <div className="ad-empty">No complaints found.</div>}
        {rows.map(c => (
          <div key={c.id} className={`ad-table-row ${showIncharge ? 'ad-col-7' : 'ad-col-6'}`} onClick={() => setSelected(c)}>
            <div className="ad-col-complaint">
              <span className="ad-complaint-id">{c.id}</span>
              <span className="ad-complaint-title">{c.title}</span>
              <span className="ad-complaint-student">👤 {c.student}</span>
            </div>
            <span className="ad-tag" style={{ background:'#eef2ff', color:'#667eea' }}>{c.category}</span>
            <span className="ad-col-block">{c.block}</span>
            {showIncharge && <span className="ad-col-ic">{c.incharge}</span>}
            <span className="ad-tag" style={{ color: PRIORITY_COLOR[c.priority], background: PRIORITY_BG[c.priority] }}>{c.priority}</span>
            <span className="ad-tag" style={{ color: STATUS_COLOR[c.status],   background: STATUS_BG[c.status] }}>{c.status}</span>
            <div className="ad-actions" onClick={e => e.stopPropagation()}>
              {c.status !== 'Resolved' && (
                <button className="ad-action-btn ad-action-btn--resolve" onClick={() => updateStatus(c.id, 'Resolved')}>✓</button>
              )}
              {c.status === 'Pending' && (
                <button className="ad-action-btn ad-action-btn--progress" onClick={() => updateStatus(c.id, 'In Progress')}>▶</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
