import { useState, useRef } from 'react';
import LogoMark from './LogoMark';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

/* ─── AI Sentiment Engine (Keyword / Pattern NLP) ─── */
const NEG_WORDS = [
  'broken','damaged','leaking','crash','failed','stuck','dirty','smelly','loud','noisy',
  'dangerous','unsafe','unusable','terrible','horrible','disgusting','awful','bad','poor',
  'worst','useless','neglected','ignored','dark','flooding','flooded','blocked','clogged',
  'faulty','malfunction','dead','burnt','insect','cockroach','rat','pest','mold','mould',
  'fungus','stink','stench','sewage','garbage','not working','issue','problem',
];
const POS_WORDS = ['good','clean','fine','ok','nice','better','improved','fixed','working','resolved'];
const URG_WORDS = ['urgent','emergency','immediately','asap','critical','severe','serious','extreme','danger','hazard','health','injury','fire','flooding'];
const IMP_WORDS = ['students','everyone','all','hostel','bathroom','corridor','many','multiple','entire','whole','block','floor','wing'];

function analyzeSentiment(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount < 3) return null;
  let negScore = 0, posScore = 0;
  NEG_WORDS.forEach(w => { if (text.includes(w)) negScore++; });
  POS_WORDS.forEach(w => { if (text.includes(w)) posScore++; });
  const urgHits = URG_WORDS.filter(w => text.includes(w)).length;
  const impHits = IMP_WORDS.filter(w => text.includes(w)).length;
  const sentiment = negScore > posScore + 1 ? 'Negative' : posScore > negScore ? 'Positive' : 'Neutral';
  let strength = 0;
  strength += Math.min(wordCount / 80 * 35, 35);
  strength += Math.min(negScore * 6, 20);
  strength += Math.min(urgHits * 10, 20);
  strength += Math.min(impHits * 5, 15);
  strength += description.length > 100 ? 10 : 0;
  strength = Math.round(Math.min(strength, 100));
  let level, levelColor, barColor, levelIcon;
  if (strength >= 80)      { level='Critical';  levelColor='#dc2626'; barColor='#dc2626'; levelIcon='🚨'; }
  else if (strength >= 55) { level='Strong';    levelColor='#d97706'; barColor='#d97706'; levelIcon='⚡'; }
  else if (strength >= 30) { level='Moderate';  levelColor='#2563eb'; barColor='#2563eb'; levelIcon='📋'; }
  else                     { level='Weak';      levelColor='#64748b'; barColor='#94a3b8'; levelIcon='💬'; }
  const tips = [];
  if (wordCount < 30) tips.push('Add more detail — describe when/where/how it happened.');
  if (urgHits === 0)  tips.push("Mention if there's a safety or health risk to raise priority.");
  if (impHits === 0)  tips.push('Describe how many people are affected.');
  return { sentiment, strength, level, levelColor, barColor, levelIcon, wordCount, tips };
}

const SENT_EMOJI  = { Positive:'😊', Neutral:'😐', Negative:'😟' };
const SENT_COLOR  = { Positive:'#10b981', Neutral:'#f59e0b', Negative:'#ef4444' };

function SentimentPanel({ analysis }) {
  if (!analysis) return null;
  const { sentiment, strength, level, levelColor, barColor, levelIcon, wordCount, tips } = analysis;
  return (
    <div className="sd-sentiment-panel" style={{ '--sa': levelColor }}>
      <div className="sd-sa-header">
        <span className="sd-sa-badge">🤖 AI Analysis</span>
        <span className="sd-sa-words">{wordCount} words</span>
      </div>
      <div className="sd-sa-strength">
        <div className="sd-sa-strength-top">
          <span>{levelIcon}</span>
          <span className="sd-sa-level" style={{ color: levelColor }}>{level} Complaint</span>
          <span className="sd-sa-pct" style={{ color: levelColor }}>{strength}/100</span>
        </div>
        <div className="sd-sa-bar-bg">
          <div className="sd-sa-bar-fill" style={{ width:`${strength}%`, background: barColor }} />
        </div>
        <div className="sd-sa-bar-labels"><span>Weak</span><span>Moderate</span><span>Strong</span><span>Critical</span></div>
      </div>
      <div className="sd-sa-meta">
        <div><span className="sd-sa-meta-lbl">Sentiment</span><span className="sd-sa-meta-val" style={{ color: SENT_COLOR[sentiment] }}>{SENT_EMOJI[sentiment]} {sentiment}</span></div>
        <div><span className="sd-sa-meta-lbl">Priority Score</span><span className="sd-sa-meta-val" style={{ color: levelColor }}>{strength}/100</span></div>
      </div>
      {tips.length > 0 && (
        <div className="sd-sa-tips">
          <span className="sd-sa-tips-title">💡 Tips to strengthen your complaint</span>
          <ul>{tips.map((t,i) => <li key={i}>{t}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

/* ── Mock Data ───────────────────────────────────────────── */
const STUDENT = {
  name: 'Rahul Sharma',
  rollNo: '22CSE1001',
  branch: 'Computer Science & Engineering',
  year: '3rd Year',
  email: 'rahul.sharma@campuspulse.edu',
  phone: '+91 98765 43210',
  hostel: 'Block A, Room 204',
  initials: 'RS',
};

const MY_COMPLAINTS = [
  { id: 'CP-001', title: 'Broken water pipe in washroom', category: 'Maintenance', block: 'Block A', date: '2026-03-22', priority: 'High',   status: 'Pending',     description: 'The water pipe near washroom 204 has been leaking since yesterday. Floor is wet and slippery.' },
  { id: 'CP-005', title: 'Mess food quality very poor',  category: 'Hostel',       block: 'Mess Hall', date: '2026-03-18', priority: 'Medium', status: 'Resolved',    description: 'Food served in the mess has been undercooked multiple times this week.' },
  { id: 'CP-007', title: 'Ceiling fan loud rattling',    category: 'Maintenance',  block: 'Block A', date: '2026-03-23', priority: 'Low',    status: 'In Progress', description: 'Ceiling fan in room 412 making a loud rattling noise at night.' },
  { id: 'CP-011', title: 'Power outage in room',         category: 'Infrastructure',block: 'Block A', date: '2026-03-17', priority: 'High',   status: 'Resolved',    description: 'Frequent power cuts in room 204 between 6-10 PM affecting study hours.' },
  { id: 'CP-013', title: 'Wi-Fi weak signal in room',   category: 'Infrastructure',block: 'Block A', date: '2026-03-15', priority: 'Medium', status: 'Resolved',    description: 'Wi-Fi signal is very weak in room 204, unable to attend online classes.' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'resolved',    message: 'Your complaint CP-005 "Mess food quality very poor" has been resolved.',       time: '2h ago',  read: false },
  { id: 2, type: 'progress',    message: 'CP-007 "Ceiling fan loud rattling" is now In Progress. Our team is working on it.', time: '5h ago',  read: false },
  { id: 3, type: 'resolved',    message: 'CP-011 "Power outage in room" has been resolved successfully.',                time: '1d ago',  read: true  },
  { id: 4, type: 'system',      message: 'Welcome to CampusPulse! Your account is active and ready to use.',            time: '2d ago',  read: true  },
  { id: 5, type: 'resolved',    message: 'CP-013 "Wi-Fi weak signal in room" has been resolved. Router was replaced.',   time: '3d ago',  read: true  },
];

const CATEGORIES = [
  { id: 'hostel',         label: 'Hostel',         icon: '🏠' },
  { id: 'academics',      label: 'Academics',       icon: '📚' },
  { id: 'maintenance',    label: 'Maintenance',     icon: '🔧' },
  { id: 'infrastructure', label: 'Infrastructure',  icon: '🏗️' },
  { id: 'others',         label: 'Others',          icon: '📋' },
];

const P_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const P_BG    = { High: '#fef2f2', Medium: '#fffbeb', Low: '#ecfdf5' };
const S_COLOR = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' };
const S_BG    = { Pending: '#fffbeb', 'In Progress': '#eff6ff', Resolved: '#ecfdf5' };

const NAV_ITEMS = [
  { id: 'overview',     icon: '🏠', label: 'Overview'        },
  { id: 'profile',      icon: '👤', label: 'Profile'         },
  { id: 'complaints',   icon: '📋', label: 'My Complaints'   },
  { id: 'submit',       icon: '✉️',  label: 'Submit Complaint' },
  { id: 'notifications',icon: '🔔', label: 'Notifications'   },
];

const NOTIF_ICON = { resolved: '✅', progress: '🔄', system: 'ℹ️' };
const NOTIF_COLOR = { resolved: '#10b981', progress: '#3b82f6', system: '#667eea' };
const NOTIF_BG    = { resolved: '#ecfdf5', progress: '#eff6ff', system: '#eef2ff' };

/* ──────────────────────────────────────────────────────────── */

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [complaints, setComplaints] = useState(MY_COMPLAINTS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [profile, setProfile] = useState(STUDENT);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState(STUDENT);

  /* Submit form state */
  const [form, setForm] = useState({ title:'', category:'', block:'', description:'', image:null });
  const [focusField, setFocusField] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* AI Sentiment */
  const [sentiment, setSentiment] = useState(null);
  const sentTimer = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/student/login');
  };

  const unread = notifications.filter(n => !n.read).length;

  const filteredComplaints = complaints.filter(c =>
    filter === 'All' || c.status === filter
  );

  const handleFormChange = e => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    clearTimeout(sentTimer.current);
    sentTimer.current = setTimeout(() => {
      setSentiment(analyzeSentiment(updated.title, updated.description));
    }, 350);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const newId = `CP-0${complaints.length + 14}`;
      setComplaints(p => [{
        id: newId,
        title: form.title,
        category: CATEGORIES.find(c => c.id === form.category)?.label || form.category,
        block: form.block,
        date: new Date().toISOString().slice(0,10),
        priority: 'Medium',
        status: 'Pending',
        description: form.description,
        anonymous: isAnonymous,
      }, ...p]);
      setForm({ title:'', category:'', block:'', description:'', image:null });
      setIsAnonymous(false);
      setSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const markAllRead = () => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  };

  const saveProfile = () => {
    setProfile(editProfile);
    setEditMode(false);
  };

  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === 'Pending').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="sd-root">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className={`sd-sidebar ${sidebarOpen ? 'sd-sidebar--open' : 'sd-sidebar--collapsed'}`}>

        <div className="sd-sidebar-brand">
          <LogoMark variant="colored" showText={sidebarOpen} size={36} />
        </div>

        <nav className="sd-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sd-nav-item ${activeNav === item.id ? 'sd-nav-item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="sd-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="sd-nav-label">{item.label}</span>}
              {item.id === 'notifications' && unread > 0 && (
                <span className="sd-nav-badge">{unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sd-sidebar-footer">
          <div className="sd-user-chip">
            <div className="sd-user-avatar">{profile.initials}</div>
            {sidebarOpen && (
              <div className="sd-user-info">
                <span className="sd-user-name">{profile.name.split(' ')[0]}</span>
                <span className="sd-user-role">{profile.rollNo}</span>
              </div>
            )}
          </div>
          <button className="sd-logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="sd-main">

        {/* Topbar */}
        <header className="sd-topbar">
          <div className="sd-topbar-left">
            <button className="sd-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="sd-page-title">
                {activeNav === 'overview'     && 'My Dashboard'}
                {activeNav === 'profile'      && 'My Profile'}
                {activeNav === 'complaints'   && 'My Complaints'}
                {activeNav === 'submit'       && 'Submit Complaint'}
                {activeNav === 'notifications'&& 'Notifications'}
              </h1>
              <p className="sd-page-sub">Welcome back, {profile.name.split(' ')[0]} 👋</p>
            </div>
          </div>
          <div className="sd-topbar-right">
            <button
              className="sd-notif-btn"
              onClick={() => setActiveNav('notifications')}
            >
              🔔
              {unread > 0 && <span className="sd-notif-dot">{unread}</span>}
            </button>
            <div className="sd-topbar-avatar">{profile.initials}</div>
          </div>
        </header>

        {/* ── OVERVIEW ──────────────────────────────────── */}
        {activeNav === 'overview' && (
          <div className="sd-content">

            {/* Hero greeting */}
            <div className="sd-greeting-card">
              <div className="sd-greeting-text">
                <h2 className="sd-greeting-title">Good afternoon, {profile.name.split(' ')[0]}! 👋</h2>
                <p className="sd-greeting-sub">Here's a summary of your campus activity.</p>
                <button
                  className="sd-greeting-btn"
                  onClick={() => setActiveNav('submit')}
                >
                  + New Complaint
                </button>
              </div>
              <div className="sd-greeting-illustration">
                <div className="sd-illus-circle">
                  <div className="sd-illus-avatar">{profile.initials}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="sd-stats-row">
              {[
                { label: 'Total Raised',  value: total,    icon: '📋', color: '#667eea', bg: '#eef2ff' },
                { label: 'Pending',       value: pending,  icon: '⏳', color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Resolved',      value: resolved, icon: '✅', color: '#10b981', bg: '#ecfdf5' },
              ].map(s => (
                <div key={s.label} className="sd-stat-card">
                  <div className="sd-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                  <div>
                    <p className="sd-stat-value">{s.value}</p>
                    <p className="sd-stat-label">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent complaints */}
            <div className="sd-section-card">
              <div className="sd-section-header">
                <h3 className="sd-section-title">Recent Complaints</h3>
                <button className="sd-link-btn" onClick={() => setActiveNav('complaints')}>View All →</button>
              </div>
              <div className="sd-recent-list">
                {complaints.slice(0,3).map(c => (
                  <div key={c.id} className="sd-recent-row">
                    <div className="sd-recent-left">
                      <span className="sd-recent-id">{c.id}</span>
                      <span className="sd-recent-title">{c.title}</span>
                      <span className="sd-recent-meta">📍 {c.block} · 🗓️ {c.date}</span>
                    </div>
                    <div className="sd-recent-right">
                      <span className="sd-tag" style={{ color: S_COLOR[c.status], background: S_BG[c.status] }}>{c.status}</span>
                      <span className="sd-tag" style={{ color: P_COLOR[c.priority], background: P_BG[c.priority] }}>{c.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent notifications */}
            {unread > 0 && (
              <div className="sd-section-card">
                <div className="sd-section-header">
                  <h3 className="sd-section-title">Recent Notifications</h3>
                  <button className="sd-link-btn" onClick={() => setActiveNav('notifications')}>View All →</button>
                </div>
                <div className="sd-notif-preview-list">
                  {notifications.filter(n => !n.read).map(n => (
                    <div key={n.id} className="sd-notif-preview-row">
                      <span className="sd-notif-preview-icon" style={{ background: NOTIF_BG[n.type], color: NOTIF_COLOR[n.type] }}>{NOTIF_ICON[n.type]}</span>
                      <span className="sd-notif-preview-msg">{n.message}</span>
                      <span className="sd-notif-preview-time">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE ────────────────────────────────────── */}
        {activeNav === 'profile' && (
          <div className="sd-content">
            <div className="sd-profile-card">
              <div className="sd-profile-header">
                <div className="sd-profile-avatar-wrap">
                  <div className="sd-profile-avatar">{profile.initials}</div>
                  <div className="sd-profile-avatar-ring" />
                </div>
                <div className="sd-profile-names">
                  <h2 className="sd-profile-name">{profile.name}</h2>
                  <p className="sd-profile-roll">{profile.rollNo}</p>
                  <span className="sd-profile-badge">🎓 Student</span>
                </div>
                <button
                  className={`sd-edit-btn ${editMode ? 'sd-edit-btn--cancel' : ''}`}
                  onClick={() => { setEditMode(e => !e); setEditProfile(profile); }}
                >
                  {editMode ? '✕ Cancel' : '✏️ Edit Profile'}
                </button>
              </div>

              <div className="sd-profile-grid">
                {[
                  { label: 'Full Name',    key: 'name',    icon: '👤' },
                  { label: 'Roll Number',  key: 'rollNo',  icon: '🎫', readOnly: true },
                  { label: 'Branch',       key: 'branch',  icon: '📐' },
                  { label: 'Year',         key: 'year',    icon: '📅' },
                  { label: 'Email',        key: 'email',   icon: '📧' },
                  { label: 'Phone',        key: 'phone',   icon: '📱' },
                  { label: 'Hostel / Room',key: 'hostel',  icon: '🏠' },
                ].map(f => (
                  <div key={f.key} className="sd-profile-field">
                    <span className="sd-profile-field-icon">{f.icon}</span>
                    <div className="sd-profile-field-body">
                      <span className="sd-profile-field-label">{f.label}</span>
                      {editMode && !f.readOnly ? (
                        <input
                          className="sd-profile-input"
                          value={editProfile[f.key]}
                          onChange={e => setEditProfile(p => ({ ...p, [f.key]: e.target.value }))}
                        />
                      ) : (
                        <span className="sd-profile-field-value">{profile[f.key]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {editMode && (
                <div className="sd-profile-actions">
                  <button className="sd-save-btn" onClick={saveProfile}>💾 Save Changes</button>
                </div>
              )}
            </div>

            {/* Complaint summary */}
            <div className="sd-section-card">
              <h3 className="sd-section-title" style={{ marginBottom:'1rem' }}>Activity Summary</h3>
              <div className="sd-activity-row">
                {[
                  { label: 'Total Raised',  val: total,    color: '#667eea', bg: '#eef2ff' },
                  { label: 'Pending',       val: pending,  color: '#f59e0b', bg: '#fffbeb' },
                  { label: 'In Progress',   val: complaints.filter(c=>c.status==='In Progress').length, color: '#3b82f6', bg: '#eff6ff' },
                  { label: 'Resolved',      val: resolved, color: '#10b981', bg: '#ecfdf5' },
                ].map(a => (
                  <div key={a.label} className="sd-activity-chip" style={{ background: a.bg }}>
                    <span className="sd-activity-val" style={{ color: a.color }}>{a.val}</span>
                    <span className="sd-activity-lbl" style={{ color: a.color }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MY COMPLAINTS ──────────────────────────────── */}
        {activeNav === 'complaints' && (
          <div className="sd-content">
            <div className="sd-filter-tabs">
              {['All','Pending','In Progress','Resolved'].map(f => (
                <button
                  key={f}
                  className={`sd-filter-btn ${filter===f ? 'sd-filter-btn--active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  <span className="sd-filter-count">
                    {f==='All' ? complaints.length : complaints.filter(c=>c.status===f).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="sd-complaints-list">
              {filteredComplaints.length === 0 && (
                <div className="sd-empty">
                  <span>🎉</span>
                  <p>No complaints in this status.</p>
                </div>
              )}
              {filteredComplaints.map(c => {
                const isOpen = expanded === c.id;
                return (
                  <div key={c.id} className={`sd-complaint-card ${isOpen ? 'sd-complaint-card--open' : ''}`}>
                    <div className="sd-complaint-row" onClick={() => setExpanded(isOpen ? null : c.id)}>
                      <div className="sd-complaint-info">
                        <span className="sd-cid">{c.id}</span>
                        <span className="sd-ctitle">{c.title}</span>
                        <span className="sd-cmeta">📍 {c.block} · 🏷️ {c.category} · 🗓️ {c.date}</span>
                      </div>
                      <div className="sd-complaint-tags">
                        <span className="sd-tag" style={{ color: P_COLOR[c.priority], background: P_BG[c.priority] }}>{c.priority}</span>
                        <span className="sd-tag" style={{ color: S_COLOR[c.status], background: S_BG[c.status] }}>{c.status}</span>
                        {c.anonymous && <span className="sd-tag" style={{ color:'#8b5cf6', background:'#f5f3ff' }}>🎭 Anon</span>}
                      </div>
                      <span className="sd-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </div>
                    {isOpen && (
                      <div className="sd-complaint-expand">
                        <p className="sd-expand-label">Description</p>
                        <p className="sd-expand-text">{c.description}</p>
                        {c.status === 'Resolved' && (
                          <div className="sd-resolved-badge">
                            ✅ This complaint has been resolved. Thank you for your patience!
                          </div>
                        )}
                        {c.status === 'In Progress' && (
                          <div className="sd-progress-badge">
                            🔄 Our team is currently working on this. Stay tuned!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="sd-new-complaint-btn" onClick={() => setActiveNav('submit')}>
              + Submit New Complaint
            </button>
          </div>
        )}

        {/* ── SUBMIT ─────────────────────────────────────── */}
        {activeNav === 'submit' && (
          <div className="sd-content">
            <div className="sd-form-card">
              <div className="sd-form-header">
                <h2 className="sd-form-title">Got an Issue? Let's Fix It 🚀</h2>
                <p className="sd-form-sub">Fill out the form below. We'll route it to the right in-charge immediately.</p>
              </div>

              <form className="sd-form" onSubmit={handleSubmit}>

                {/* Title */}
                <div className="sd-form-group">
                  <label className="sd-label">Complaint Title</label>
                  <div className={`sd-input-wrap ${focusField==='title' ? 'sd-input-wrap--focus' : ''}`}>
                    <input
                      name="title" value={form.title} onChange={handleFormChange}
                      onFocus={() => setFocusField('title')} onBlur={() => setFocusField('')}
                      className="sd-input" placeholder="Give your issue a quick headline…" required
                    />
                    <span className="sd-input-icon">📝</span>
                  </div>
                </div>

                {/* Category */}
                <div className="sd-form-group">
                  <label className="sd-label">Category</label>
                  <div className="sd-category-grid">
                    {CATEGORIES.map(cat => (
                      <label key={cat.id} className={`sd-category-card ${form.category===cat.id ? 'sd-category-card--active' : ''}`}>
                        <input type="radio" name="category" value={cat.id}
                          checked={form.category===cat.id} onChange={handleFormChange}
                          className="sd-category-radio" required
                        />
                        <span className="sd-category-icon">{cat.icon}</span>
                        <span className="sd-category-label">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Block */}
                <div className="sd-form-group">
                  <label className="sd-label">Block / Location</label>
                  <div className={`sd-input-wrap ${focusField==='block' ? 'sd-input-wrap--focus' : ''}`}>
                    <input
                      name="block" value={form.block} onChange={handleFormChange}
                      onFocus={() => setFocusField('block')} onBlur={() => setFocusField('')}
                      className="sd-input" placeholder="e.g., Block A, Library, Cafeteria" required
                    />
                    <span className="sd-input-icon">📍</span>
                  </div>
                </div>

                {/* Description */}
                <div className="sd-form-group">
                  <label className="sd-label">Description</label>
                  <div className={`sd-input-wrap sd-input-wrap--textarea ${focusField==='description' ? 'sd-input-wrap--focus' : ''}`}>
                    <textarea
                      name="description" value={form.description} onChange={handleFormChange}
                      onFocus={() => setFocusField('description')} onBlur={() => setFocusField('')}
                      className="sd-textarea" placeholder="Describe the issue in detail — the more specific, the faster we can resolve it." rows="4" required
                    />
                    <span className="sd-input-icon sd-input-icon--ta">💬</span>
                  </div>
                  {/* ─ AI Sentiment Panel ─ */}
                  <SentimentPanel analysis={(form.title.trim() || form.description.trim()) ? sentiment : null} />
                </div>

                {/* Image upload */}
                <div className="sd-form-group">
                  <label className="sd-label">Photo Evidence <span className="sd-label-opt">(Optional)</span></label>
                  <div className="sd-file-wrap">
                    <input type="file" id="sd-img" accept="image/*" className="sd-file-input"
                      onChange={e => setForm(p => ({ ...p, image: e.target.files[0] }))} />
                    <label htmlFor="sd-img" className="sd-file-label">
                      <span>📎</span>
                      <span>{form.image ? form.image.name : 'Attach a photo · optional'}</span>
                    </label>
                  </div>
                </div>

                {/* Anonymous toggle */}
                <button type="button"
                  className={`sd-anon-btn ${isAnonymous ? 'sd-anon-btn--active' : ''}`}
                  onClick={() => setIsAnonymous(a => !a)}
                >
                  <span className="sd-anon-icon">{isAnonymous ? '🎭' : '👤'}</span>
                  <div className="sd-anon-text">
                    <span className="sd-anon-label">{isAnonymous ? 'Submitting Anonymously' : 'Submit Anonymously'}</span>
                    <span className="sd-anon-desc">
                      {isAnonymous ? 'Your identity is hidden from this complaint' : 'Hide your name & roll number from this complaint'}
                    </span>
                  </div>
                  <div className={`sd-anon-switch ${isAnonymous ? 'sd-anon-switch--on' : ''}`}>
                    <div className="sd-anon-knob" />
                  </div>
                </button>

                {/* Submit */}
                <button type="submit" className={`sd-submit-btn ${submitting ? 'sd-submit-btn--loading' : ''}`} disabled={submitting}>
                  {submitting ? (
                    <><div className="sd-btn-spinner" /> Submitting…</>
                  ) : (
                    <><span>🚀</span> Send Complaint</>
                  )}
                </button>

              </form>
            </div>

            {/* Success toast */}
            {showSuccess && (
              <div className="sd-toast">
                <span>{isAnonymous ? '🎭' : '✅'}</span>
                <span>{isAnonymous ? 'Anonymous complaint submitted!' : 'Complaint submitted successfully!'}</span>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS ──────────────────────────────── */}
        {activeNav === 'notifications' && (
          <div className="sd-content">
            <div className="sd-section-card">
              <div className="sd-section-header">
                <h3 className="sd-section-title">
                  Notifications
                  {unread > 0 && <span className="sd-unread-badge">{unread} new</span>}
                </h3>
                {unread > 0 && (
                  <button className="sd-link-btn" onClick={markAllRead}>Mark all read</button>
                )}
              </div>

              <div className="sd-notif-list">
                {notifications.map(n => (
                  <div key={n.id} className={`sd-notif-item ${!n.read ? 'sd-notif-item--unread' : ''}`}
                    onClick={() => setNotifications(p => p.map(x => x.id===n.id ? {...x, read:true} : x))}>
                    <span className="sd-notif-icon" style={{ background: NOTIF_BG[n.type], color: NOTIF_COLOR[n.type] }}>
                      {NOTIF_ICON[n.type]}
                    </span>
                    <div className="sd-notif-body">
                      <p className="sd-notif-msg">{n.message}</p>
                      <p className="sd-notif-time">{n.time}</p>
                    </div>
                    {!n.read && <div className="sd-notif-unread-dot" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
