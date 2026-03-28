import { useState } from 'react';
import LogoMark from './LogoMark';
import { useNavigate } from 'react-router-dom';
import './InChargeDashboard.css';

/* ─── Mock Data ─────────────────────────────────────────── */
const MOCK_COMPLAINTS = [
  { id: 'CP-001', title: 'Broken water pipe in washroom', category: 'Maintenance', block: 'Block A', floor: '2nd Floor', student: 'Rahul Sharma', rollNo: '22CSE1001', date: '2026-03-22', priority: 'High', status: 'Pending', description: 'The water pipe near washroom 204 has been leaking since yesterday. The floor is wet and slippery. Urgent action needed.' },
  { id: 'CP-002', title: 'AC not working in Room 310', category: 'Maintenance', block: 'Block B', floor: '3rd Floor', student: 'Priya Patel', rollNo: '22CSE1042', date: '2026-03-22', priority: 'Medium', status: 'In Progress', description: 'Air conditioning unit in Room 310 stopped working. Temperature is very high making it difficult to study.' },
  { id: 'CP-003', title: 'Noisy construction disturbing study', category: 'Infrastructure', block: 'Block A', floor: '1st Floor', student: 'Arjun Mehta', rollNo: '22CSE1078', date: '2026-03-21', priority: 'Low', status: 'Pending', description: 'Construction noise near Block A is extremely loud during exam preparation hours (8 PM-12 AM).' },
  { id: 'CP-004', title: 'Wi-Fi down in reading room', category: 'Infrastructure', block: 'Block C', floor: 'Ground Floor', student: 'Sneha Rao', rollNo: '22CSE1089', date: '2026-03-21', priority: 'High', status: 'Resolved', description: 'The Wi-Fi router in the reading room has been down for 3 days. Students unable to access online resources.' },
  { id: 'CP-005', title: 'Mess food quality very poor', category: 'Hostel', block: 'Mess Hall', floor: 'Ground Floor', student: 'Karan Singh', rollNo: '22CSE1103', date: '2026-03-20', priority: 'Medium', status: 'Resolved', description: 'Food served in the mess has been undercooked multiple times this week. Several students fell sick.' },
  { id: 'CP-006', title: 'Elevator out of service', category: 'Infrastructure', block: 'Block B', floor: 'All Floors', student: 'Divya Nair', rollNo: '22CSE1115', date: '2026-03-23', priority: 'High', status: 'Pending', description: 'The elevator in Block B has been non-functional for 2 days. Specially-abled students cannot access upper floors.' },
  { id: 'CP-007', title: 'Ceiling fan making loud noise', category: 'Maintenance', block: 'Block A', floor: '4th Floor', student: 'Amit Kumar', rollNo: '22CSE1056', date: '2026-03-23', priority: 'Low', status: 'In Progress', description: 'Ceiling fan in room 412 making a loud rattling noise at night affecting sleep.' },
  { id: 'CP-008', title: 'Library computers slow/crashing', category: 'Academics', block: 'Library', floor: '1st Floor', student: 'Ritu Verma', rollNo: '22CSE1067', date: '2026-03-20', priority: 'Medium', status: 'Pending', description: 'The computers in the library are extremely slow and crash frequently, affecting research work.' },
];

const STAT_CARDS = [
  { label: 'Total Assigned', value: 8, icon: '📋', color: '#667eea', bg: '#eef2ff' },
  { label: 'Pending', value: 4, icon: '⏳', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'In Progress', value: 2, icon: '🔄', color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Resolved', value: 2, icon: '✅', color: '#10b981', bg: '#ecfdf5' },
];

const PRIORITY_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const PRIORITY_BG    = { High: '#fef2f2', Medium: '#fffbeb', Low: '#ecfdf5' };
const STATUS_COLOR   = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' };
const STATUS_BG      = { Pending: '#fffbeb', 'In Progress': '#eff6ff', Resolved: '#ecfdf5' };

export default function InChargeDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/student/login');
  };

  const updateStatus = (id, newStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  const filtered = complaints.filter(c => {
    const matchFilter = filter === 'All' || c.status === filter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.student.toLowerCase().includes(search.toLowerCase()) ||
      c.block.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="ic-root">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`ic-sidebar ${sidebarOpen ? 'ic-sidebar--open' : 'ic-sidebar--collapsed'}`}>
        <div className="ic-sidebar-brand">
          <LogoMark variant="colored" showText={sidebarOpen} size={36} />
        </div>

        <nav className="ic-nav">
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'complaints', icon: '📋', label: 'Complaints' },
            { id: 'resolved',   icon: '✅', label: 'Resolved' },
            { id: 'analytics',  icon: '📈', label: 'Analytics' },
          ].map(item => (
            <button
              key={item.id}
              className={`ic-nav-item ${activeNav === item.id ? 'ic-nav-item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="ic-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="ic-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="ic-sidebar-footer">
          <div className="ic-user-chip">
            <div className="ic-user-avatar">IC</div>
            {sidebarOpen && (
              <div className="ic-user-info">
                <span className="ic-user-name">In-Charge</span>
                <span className="ic-user-role">Block A • Floor 1-4</span>
              </div>
            )}
          </div>
          <button className="ic-logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="ic-main">

        {/* Topbar */}
        <header className="ic-topbar">
          <div className="ic-topbar-left">
            <button className="ic-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="ic-page-title">In-Charge Dashboard</h1>
              <p className="ic-page-sub">Block A — Manage & resolve complaints</p>
            </div>
          </div>
          <div className="ic-topbar-right">
            <span className="ic-badge-live">● Live</span>
            <div className="ic-notif-btn">
              🔔
              <span className="ic-notif-dot">{complaints.filter(c=>c.status==='Pending').length}</span>
            </div>
          </div>
        </header>

        <div className="ic-content">

          {/* Stat cards */}
          <div className="ic-stats-row">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="ic-stat-card">
                <div className="ic-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div>
                  <p className="ic-stat-value">{s.value}</p>
                  <p className="ic-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="ic-toolbar">
            <div className="ic-filter-tabs">
              {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                <button
                  key={f}
                  className={`ic-filter-btn ${filter === f ? 'ic-filter-btn--active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  <span className="ic-filter-count">
                    {f === 'All' ? complaints.length : complaints.filter(c => c.status === f).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="ic-search-wrap">
              <svg className="ic-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="ic-search"
                placeholder="Search complaints, students, blocks…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Complaint table */}
          <div className="ic-table-card">
            <div className="ic-table-header">
              <span>Complaint</span>
              <span>Category</span>
              <span>Location</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="ic-table-body">
              {filtered.length === 0 && (
                <div className="ic-empty">No complaints match your filter.</div>
              )}
              {filtered.map(c => (
                <div key={c.id} className="ic-table-row" onClick={() => setSelected(c)}>
                  <div className="ic-col-complaint">
                    <span className="ic-complaint-id">{c.id}</span>
                    <span className="ic-complaint-title">{c.title}</span>
                    <span className="ic-complaint-student">👤 {c.student}</span>
                  </div>
                  <span className="ic-tag ic-tag-cat">{c.category}</span>
                  <div className="ic-col-loc">
                    <span>{c.block}</span>
                    <span className="ic-floor">{c.floor}</span>
                  </div>
                  <span className="ic-tag"
                    style={{ color: PRIORITY_COLOR[c.priority], background: PRIORITY_BG[c.priority] }}>
                    {c.priority}
                  </span>
                  <span className="ic-tag"
                    style={{ color: STATUS_COLOR[c.status], background: STATUS_BG[c.status] }}>
                    {c.status}
                  </span>
                  <div className="ic-actions" onClick={e => e.stopPropagation()}>
                    {c.status !== 'Resolved' && (
                      <button className="ic-action-btn ic-action-btn--resolve"
                        onClick={() => updateStatus(c.id, 'Resolved')}>✓ Resolve</button>
                    )}
                    {c.status === 'Pending' && (
                      <button className="ic-action-btn ic-action-btn--progress"
                        onClick={() => updateStatus(c.id, 'In Progress')}>▶ Start</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Detail Modal ─────────────────────────────────── */}
      {selected && (
        <div className="ic-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ic-modal" onClick={e => e.stopPropagation()}>
            <div className="ic-modal-header">
              <div>
                <span className="ic-modal-id">{selected.id}</span>
                <h2 className="ic-modal-title">{selected.title}</h2>
              </div>
              <button className="ic-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="ic-modal-meta">
              <div className="ic-meta-item">
                <span className="ic-meta-key">Student</span>
                <span className="ic-meta-val">{selected.student} ({selected.rollNo})</span>
              </div>
              <div className="ic-meta-item">
                <span className="ic-meta-key">Location</span>
                <span className="ic-meta-val">{selected.block}, {selected.floor}</span>
              </div>
              <div className="ic-meta-item">
                <span className="ic-meta-key">Category</span>
                <span className="ic-meta-val">{selected.category}</span>
              </div>
              <div className="ic-meta-item">
                <span className="ic-meta-key">Filed On</span>
                <span className="ic-meta-val">{selected.date}</span>
              </div>
              <div className="ic-meta-item">
                <span className="ic-meta-key">Priority</span>
                <span className="ic-tag" style={{ color: PRIORITY_COLOR[selected.priority], background: PRIORITY_BG[selected.priority] }}>{selected.priority}</span>
              </div>
              <div className="ic-meta-item">
                <span className="ic-meta-key">Status</span>
                <span className="ic-tag" style={{ color: STATUS_COLOR[selected.status], background: STATUS_BG[selected.status] }}>{selected.status}</span>
              </div>
            </div>

            <div className="ic-modal-desc">
              <p className="ic-meta-key">Description</p>
              <p className="ic-modal-desc-text">{selected.description}</p>
            </div>

            <div className="ic-modal-actions">
              {selected.status !== 'Resolved' && (
                <button className="ic-action-btn ic-action-btn--resolve ic-modal-btn"
                  onClick={() => updateStatus(selected.id, 'Resolved')}>
                  ✓ Mark as Resolved
                </button>
              )}
              {selected.status === 'Pending' && (
                <button className="ic-action-btn ic-action-btn--progress ic-modal-btn"
                  onClick={() => updateStatus(selected.id, 'In Progress')}>
                  ▶ Start Working
                </button>
              )}
              {selected.status !== 'Resolved' && (
                <button className="ic-action-btn ic-action-btn--escalate ic-modal-btn"
                  onClick={() => { updateStatus(selected.id, 'Pending'); setSelected(null); }}>
                  ⬆ Escalate to Admin
                </button>
              )}
              <button className="ic-action-btn ic-action-btn--close ic-modal-btn"
                onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
