import { useState } from 'react';
import Navbar from './Navbar';
import Logo from './Logo';
import './PublicComplaints.css';

/* ── Mock public complaint data ─────────────── */
const COMPLAINTS = [
  { id: 'CP-001', title: 'Broken water pipe in washroom', category: 'Maintenance',    block: 'Block A', date: '2026-03-22', priority: 'High',   status: 'Pending',     votes: 14, description: 'The water pipe near washroom 204 has been leaking since yesterday. The floor is wet and slippery.' },
  { id: 'CP-002', title: 'AC not working in Room 310',   category: 'Maintenance',    block: 'Block B', date: '2026-03-22', priority: 'Medium', status: 'In Progress', votes: 9,  description: 'Air conditioning in Room 310 stopped working. Temperature is very high making it difficult to study.' },
  { id: 'CP-003', title: 'Noisy construction at night',  category: 'Infrastructure', block: 'Block A', date: '2026-03-21', priority: 'Low',    status: 'Pending',     votes: 22, description: 'Construction noise near Block A is extremely loud during exam preparation hours (8 PM–12 AM).' },
  { id: 'CP-004', title: 'Wi-Fi down in reading room',   category: 'Infrastructure', block: 'Block C', date: '2026-03-21', priority: 'High',   status: 'Resolved',    votes: 31, description: 'The Wi-Fi router in the reading room has been down for 3 days.' },
  { id: 'CP-005', title: 'Mess food quality very poor',  category: 'Hostel',         block: 'Mess Hall', date: '2026-03-20', priority: 'Medium', status: 'Resolved',  votes: 47, description: 'Food served in the mess has been undercooked multiple times this week.' },
  { id: 'CP-006', title: 'Elevator out of service',      category: 'Infrastructure', block: 'Block B', date: '2026-03-23', priority: 'High',   status: 'Pending',     votes: 18, description: 'The elevator in Block B has been non-functional for 2 days.' },
  { id: 'CP-007', title: 'Ceiling fan loud rattling',    category: 'Maintenance',    block: 'Block A', date: '2026-03-23', priority: 'Low',    status: 'In Progress', votes: 6,  description: 'Ceiling fan in room 412 making a loud rattling noise at night.' },
  { id: 'CP-008', title: 'Library computers crashing',   category: 'Academics',      block: 'Library',   date: '2026-03-20', priority: 'Medium', status: 'Pending',   votes: 25, description: 'The computers in the library are extremely slow and crash frequently.' },
  { id: 'CP-009', title: 'Lab projector not working',    category: 'Academics',      block: 'Block C', date: '2026-03-19', priority: 'High',   status: 'Resolved',    votes: 12, description: 'Projector in Lab 3 is not working, affecting practical sessions.' },
  { id: 'CP-010', title: 'Hostel gate locked early',     category: 'Hostel',         block: 'Block D', date: '2026-03-18', priority: 'Medium', status: 'Resolved',    votes: 8,  description: 'Hostel gate is being locked at 9:30 PM instead of 11 PM as per schedule.' },
];

const CATEGORIES = ['All', 'Maintenance', 'Infrastructure', 'Hostel', 'Academics'];
const STATUSES   = ['All', 'Pending', 'In Progress', 'Resolved'];

const PRIORITY_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const PRIORITY_BG    = { High: '#fef2f2', Medium: '#fffbeb', Low: '#ecfdf5' };
const STATUS_COLOR   = { Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' };
const STATUS_BG      = { Pending: '#fffbeb', 'In Progress': '#eff6ff', Resolved: '#ecfdf5' };

const CAT_ICONS = { Maintenance: '🔧', Infrastructure: '🏗️', Hostel: '🏠', Academics: '📚' };

export default function PublicComplaints() {
  const [category, setCategory] = useState('All');
  const [status, setStatus]     = useState('All');
  const [search, setSearch]     = useState('');
  const [votes, setVotes]       = useState({});
  const [expanded, setExpanded] = useState(null);
  const [sort, setSort]         = useState('date');

  const filtered = COMPLAINTS
    .filter(c => {
      const mc = category === 'All' || c.category === category;
      const ms = status   === 'All' || c.status   === status;
      const mq = c.title.toLowerCase().includes(search.toLowerCase()) ||
                 c.block.toLowerCase().includes(search.toLowerCase());
      return mc && ms && mq;
    })
    .sort((a, b) => {
      if (sort === 'votes') return (b.votes + (votes[b.id] ?? 0)) - (a.votes + (votes[a.id] ?? 0));
      if (sort === 'priority') {
        const p = { High: 3, Medium: 2, Low: 1 };
        return p[b.priority] - p[a.priority];
      }
      return new Date(b.date) - new Date(a.date); // date
    });

  const handleVote = (e, id) => {
    e.stopPropagation();
    setVotes(v => ({ ...v, [id]: (v[id] ?? 0) + 1 }));
  };

  const total    = COMPLAINTS.length;
  const pending  = COMPLAINTS.filter(c => c.status === 'Pending').length;
  const resolved = COMPLAINTS.filter(c => c.status === 'Resolved').length;

  return (
    <div className="pc-root">
      <Navbar />

      {/* Hero banner */}
      <div className="pc-hero">
        <div className="pc-hero-inner">
          <div style={{ filter: 'brightness(0) invert(1) opacity(0.75)', marginBottom: '0.5rem' }}>
            <Logo />
          </div>
          <span className="pc-hero-badge">📋 Transparency Board</span>
          <h1 className="pc-hero-title">Campus Complaints</h1>
          <p className="pc-hero-sub">All complaints raised by students — tracked publicly for transparency and accountability.</p>

          <div className="pc-hero-stats">
            <div className="pc-hero-stat">
              <span className="pc-hero-stat-num">{total}</span>
              <span className="pc-hero-stat-lbl">Total</span>
            </div>
            <div className="pc-hero-stat-div" />
            <div className="pc-hero-stat">
              <span className="pc-hero-stat-num pc-num-amber">{pending}</span>
              <span className="pc-hero-stat-lbl">Pending</span>
            </div>
            <div className="pc-hero-stat-div" />
            <div className="pc-hero-stat">
              <span className="pc-hero-stat-num pc-num-green">{resolved}</span>
              <span className="pc-hero-stat-lbl">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pc-content">

        {/* Toolbar */}
        <div className="pc-toolbar">
          {/* Search */}
          <div className="pc-search-wrap">
            <svg className="pc-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="pc-search"
              placeholder="Search complaints or blocks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select className="pc-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date">Sort: Latest</option>
            <option value="votes">Sort: Most Voted</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>

        {/* Category filter pills */}
        <div className="pc-filter-row">
          <div className="pc-filter-group">
            <span className="pc-filter-label">Category:</span>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`pc-pill ${category === c ? 'pc-pill--active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c !== 'All' && <span>{CAT_ICONS[c]}</span>}
                {c}
              </button>
            ))}
          </div>
          <div className="pc-filter-group">
            <span className="pc-filter-label">Status:</span>
            {STATUSES.map(s => (
              <button
                key={s}
                className={`pc-pill ${status === s ? 'pc-pill--active pc-pill--' + s.replace(' ', '-').toLowerCase() : ''}`}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="pc-results-count">
          Showing <strong>{filtered.length}</strong> complaint{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Complaint cards */}
        <div className="pc-cards">
          {filtered.length === 0 && (
            <div className="pc-empty">
              <span>😕</span>
              <p>No complaints match your filters.</p>
            </div>
          )}

          {filtered.map(c => {
            const isOpen  = expanded === c.id;
            const voteCount = c.votes + (votes[c.id] ?? 0);
            const voted = (votes[c.id] ?? 0) > 0;

            return (
              <div
                key={c.id}
                className={`pc-card ${isOpen ? 'pc-card--open' : ''}`}
                onClick={() => setExpanded(isOpen ? null : c.id)}
              >
                <div className="pc-card-main">
                  {/* Vote button */}
                  <button
                    className={`pc-vote ${voted ? 'pc-vote--voted' : ''}`}
                    onClick={e => handleVote(e, c.id)}
                    title="Upvote this complaint"
                  >
                    <svg viewBox="0 0 24 24" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                    <span>{voteCount}</span>
                  </button>

                  {/* Content */}
                  <div className="pc-card-body">
                    <div className="pc-card-top">
                      <span className="pc-card-id">{c.id}</span>
                      <span className="pc-tag" style={{ color: PRIORITY_COLOR[c.priority], background: PRIORITY_BG[c.priority] }}>{c.priority}</span>
                      <span className="pc-tag" style={{ color: STATUS_COLOR[c.status], background: STATUS_BG[c.status] }}>{c.status}</span>
                    </div>

                    <h3 className="pc-card-title">{c.title}</h3>

                    <div className="pc-card-meta">
                      <span>📍 {c.block}</span>
                      <span>🏷️ {c.category}</span>
                      <span>🗓️ {c.date}</span>
                    </div>

                    {isOpen && (
                      <p className="pc-card-desc">{c.description}</p>
                    )}
                  </div>

                  <span className="pc-card-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
