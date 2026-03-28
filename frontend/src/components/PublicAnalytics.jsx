import { useState } from 'react';
import Navbar from './Navbar';
import Logo from './Logo';
import './PublicAnalytics.css';

/* ── Data ───────────────────────────────────── */
const TREND = [
  { day: 'Mon', raised: 5,  resolved: 3  },
  { day: 'Tue', raised: 8,  resolved: 6  },
  { day: 'Wed', raised: 3,  resolved: 5  },
  { day: 'Thu', raised: 10, resolved: 7  },
  { day: 'Fri', raised: 6,  resolved: 9  },
  { day: 'Sat', raised: 4,  resolved: 4  },
  { day: 'Sun', raised: 2,  resolved: 2  },
];

const CATEGORIES = [
  { label: 'Maintenance',    count: 3,  color: '#667eea', pct: 30 },
  { label: 'Infrastructure', count: 3,  color: '#3b82f6', pct: 30 },
  { label: 'Hostel',         count: 2,  color: '#f59e0b', pct: 20 },
  { label: 'Academics',      count: 2,  color: '#10b981', pct: 20 },
];

const PRIORITY_DATA = [
  { label: 'High',   count: 4, color: '#ef4444', pct: 40 },
  { label: 'Medium', count: 4, color: '#f59e0b', pct: 40 },
  { label: 'Low',    count: 2, color: '#10b981', pct: 20 },
];

const BLOCK_DATA = [
  { block: 'Block A',   complaints: 3, resolved: 1, color: '#667eea' },
  { block: 'Block B',   complaints: 2, resolved: 0, color: '#3b82f6' },
  { block: 'Block C',   complaints: 2, resolved: 2, color: '#10b981' },
  { block: 'Block D',   complaints: 1, resolved: 1, color: '#a855f7' },
  { block: 'Library',   complaints: 1, resolved: 0, color: '#f59e0b' },
  { block: 'Mess Hall', complaints: 1, resolved: 1, color: '#ef4444' },
];

const STATUS_TREND = [
  { month: 'Nov', pending: 18, inProgress: 8,  resolved: 12 },
  { month: 'Dec', pending: 22, inProgress: 10, resolved: 15 },
  { month: 'Jan', pending: 15, inProgress: 12, resolved: 20 },
  { month: 'Feb', pending: 12, inProgress: 9,  resolved: 25 },
  { month: 'Mar', pending: 10, inProgress: 6,  resolved: 30 },
];

const SENTIMENT = [
  { label: 'Negative', count: 7,  color: '#ef4444', bg: '#fef2f2', emoji: '😡', pct: 70 },
  { label: 'Neutral',  count: 2,  color: '#f59e0b', bg: '#fffbeb', emoji: '😐', pct: 20 },
  { label: 'Positive', count: 1,  color: '#10b981', bg: '#ecfdf5', emoji: '😊', pct: 10 },
];

const maxTrend = Math.max(...TREND.map(t => Math.max(t.raised, t.resolved)));
const maxBlock = Math.max(...BLOCK_DATA.map(b => b.complaints));

/* ── SVG Donut chart helper ─────────────────── */
function DonutChart({ slices, size = 160, thickness = 32 }) {
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let cumulativeDeg = -90; // start from 12 o'clock

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
      {slices.map((s, i) => {
        const angle = cumulativeDeg;
        const dash  = (s.pct / 100) * circ;
        cumulativeDeg += (s.pct / 100) * 360;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={0}
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}

/* ── Heatmap data ───────────────────────────── */
const HEATMAP = [
  { block: 'Block A',   Mon:2, Tue:3, Wed:0, Thu:1, Fri:0, Sat:1, Sun:0 },
  { block: 'Block B',   Mon:0, Tue:2, Wed:1, Thu:3, Fri:1, Sat:0, Sun:0 },
  { block: 'Block C',   Mon:1, Tue:0, Wed:2, Thu:0, Fri:2, Sat:0, Sun:1 },
  { block: 'Block D',   Mon:0, Tue:1, Wed:0, Thu:2, Fri:0, Sat:1, Sun:0 },
  { block: 'Library',   Mon:1, Tue:0, Wed:1, Thu:0, Fri:1, Sat:0, Sun:0 },
  { block: 'Mess Hall', Mon:0, Tue:1, Wed:0, Thu:1, Fri:1, Sat:0, Sun:0 },
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MAX_HEAT = 3;

export default function PublicAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const totalComplaints = 10;
  const totalResolved   = 4;
  const resRate         = Math.round((totalResolved / totalComplaints) * 100);
  const avgResTime      = '2.4 days';

  return (
    <div className="pa-root">
      <Navbar />

      {/* Hero */}
      <div className="pa-hero">
        <div className="pa-hero-inner">
          <div style={{ filter: 'brightness(0) invert(1) opacity(0.75)', marginBottom: '0.5rem' }}>
            <Logo />
          </div>
          <span className="pa-hero-badge">📊 Public Analytics</span>
          <h1 className="pa-hero-title">Campus Insights</h1>
          <p className="pa-hero-sub">Real-time analytics on complaint trends, resolution rates, and block-level performance across campus.</p>

          {/* Tab switcher inside hero */}
          <div className="pa-tabs">
            {['overview','trends','blocks','sentiment'].map(t => (
              <button
                key={t}
                className={`pa-tab ${activeTab === t ? 'pa-tab--active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pa-content">

        {/* KPI Strip */}
        <div className="pa-kpi-row">
          {[
            { label: 'Total Complaints',  value: totalComplaints, icon: '📋', color: '#667eea', bg: '#eef2ff'  },
            { label: 'Resolved',          value: totalResolved,   icon: '✅', color: '#10b981', bg: '#ecfdf5'  },
            { label: 'Resolution Rate',   value: `${resRate}%`,   icon: '📈', color: '#3b82f6', bg: '#eff6ff'  },
            { label: 'Avg. Resolution',   value: avgResTime,      icon: '⏱️', color: '#f59e0b', bg: '#fffbeb'  },
          ].map(k => (
            <div key={k.label} className="pa-kpi-card">
              <div className="pa-kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
              <div>
                <p className="pa-kpi-value">{k.value}</p>
                <p className="pa-kpi-label">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── OVERVIEW tab ─────────────────────── */}
        {activeTab === 'overview' && (
          <>
        {/* Row 1: two donuts */}
        <div className="pa-row">

          {/* Donut — Category breakdown */}
          <div className="pa-card">
            <h3 className="pa-card-title">Complaints by Category</h3>
            <p className="pa-card-sub">Distribution of complaint types</p>
            <div className="pa-donut-wrap">
              <div className="pa-donut-chart">
                <DonutChart slices={CATEGORIES} size={180} thickness={36} />
                <div className="pa-donut-center">
                  <span className="pa-donut-num">{totalComplaints}</span>
                  <span className="pa-donut-sub">Total</span>
                </div>
              </div>
              <div className="pa-donut-legend">
                {CATEGORIES.map(c => (
                  <div key={c.label} className="pa-legend-row">
                    <span className="pa-legend-dot" style={{ background: c.color }} />
                    <span className="pa-legend-label">{c.label}</span>
                    <span className="pa-legend-val">{c.count}</span>
                    <span className="pa-legend-pct">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donut — Priority breakdown */}
          <div className="pa-card">
            <h3 className="pa-card-title">Priority Distribution</h3>
            <p className="pa-card-sub">High / Medium / Low complaints</p>
            <div className="pa-donut-wrap">
              <div className="pa-donut-chart">
                <DonutChart slices={PRIORITY_DATA} size={180} thickness={36} />
                <div className="pa-donut-center">
                  <span className="pa-donut-num">{totalComplaints}</span>
                  <span className="pa-donut-sub">Issues</span>
                </div>
              </div>
              <div className="pa-donut-legend">
                {PRIORITY_DATA.map(p => (
                  <div key={p.label} className="pa-legend-row">
                    <span className="pa-legend-dot" style={{ background: p.color }} />
                    <span className="pa-legend-label">{p.label}</span>
                    <span className="pa-legend-val">{p.count}</span>
                    <span className="pa-legend-pct">{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: resolution donut + insight */}
        <div className="pa-row">
          {/* Donut — Resolution status */}
          <div className="pa-card">
            <h3 className="pa-card-title">Resolution Status</h3>
            <p className="pa-card-sub">Current state of all complaints</p>
            <div className="pa-donut-wrap">
              <div className="pa-donut-chart">
                <DonutChart
                  slices={[
                    { label:'Resolved',    count:4, color:'#10b981', pct:40 },
                    { label:'In Progress', count:2, color:'#3b82f6', pct:20 },
                    { label:'Pending',     count:4, color:'#f59e0b', pct:40 },
                  ]}
                  size={180} thickness={36}
                />
                <div className="pa-donut-center">
                  <span className="pa-donut-num">{resRate}%</span>
                  <span className="pa-donut-sub">Resolved</span>
                </div>
              </div>
              <div className="pa-donut-legend">
                {[
                  { label:'Resolved',    count:4, color:'#10b981', pct:40 },
                  { label:'In Progress', count:2, color:'#3b82f6', pct:20 },
                  { label:'Pending',     count:4, color:'#f59e0b', pct:40 },
                ].map(s => (
                  <div key={s.label} className="pa-legend-row">
                    <span className="pa-legend-dot" style={{ background: s.color }} />
                    <span className="pa-legend-label">{s.label}</span>
                    <span className="pa-legend-val">{s.count}</span>
                    <span className="pa-legend-pct">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly resolution progress — second card in Row 2 */}
          <div className="pa-card">
            <h3 className="pa-card-title">Monthly Resolution Progress</h3>
            <p className="pa-card-sub">Complaints resolved per month over 5 months</p>
            <div className="pa-monthly-bars">
              {STATUS_TREND.map(m => {
                const maxM = Math.max(...STATUS_TREND.map(x => x.resolved));
                return (
                  <div key={m.month} className="pa-monthly-col">
                    <div className="pa-monthly-bar-wrap">
                      <div className="pa-monthly-bar" style={{ height: `${(m.resolved/maxM)*100}%` }}>
                        <span className="pa-monthly-bar-tip">{m.resolved}</span>
                      </div>
                    </div>
                    <span className="pa-monthly-lbl">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="pa-insight-box" style={{marginTop:'1rem'}}>
              <span className="pa-insight-icon">💡</span>
              <div>
                <p className="pa-insight-title">Improving Trend</p>
                <p className="pa-insight-desc">Resolution rate improved by <strong>+150%</strong> over 5 months — from 12 in Nov to 30 in Mar.</p>
              </div>
            </div>
          </div>
        </div>{/* end Row 2 */}
        </>
        )}

        {/* ── TRENDS tab ───────────────────────── */}
        {activeTab === 'trends' && (
          <>
            {/* Weekly bar chart */}
            <div className="pa-card pa-card--full">
              <h3 className="pa-card-title">Weekly Complaint Trend</h3>
              <p className="pa-card-sub">Complaints raised vs resolved this week</p>
              <div className="pa-bar-chart">
                {TREND.map(t => (
                  <div key={t.day} className="pa-bar-group">
                    <div className="pa-bar-pair">
                      <div className="pa-bar pa-bar--raised" style={{ height: `${(t.raised/maxTrend)*100}%` }}>
                        <span className="pa-bar-tip">{t.raised}</span>
                      </div>
                      <div className="pa-bar pa-bar--resolved" style={{ height: `${(t.resolved/maxTrend)*100}%` }}>
                        <span className="pa-bar-tip">{t.resolved}</span>
                      </div>
                    </div>
                    <span className="pa-bar-day">{t.day}</span>
                  </div>
                ))}
              </div>
              <div className="pa-legend">
                <span><span className="pa-dot" style={{ background:'#667eea' }}/>Raised</span>
                <span><span className="pa-dot" style={{ background:'#10b981' }}/>Resolved</span>
              </div>
            </div>

            {/* Stacked monthly area */}
            <div className="pa-card pa-card--full">
              <h3 className="pa-card-title">Monthly Status Breakdown</h3>
              <p className="pa-card-sub">Pending / In Progress / Resolved by month</p>
              <div className="pa-stacked-chart">
                {STATUS_TREND.map(m => {
                  const total = m.pending + m.inProgress + m.resolved;
                  return (
                    <div key={m.month} className="pa-stacked-col">
                      <div className="pa-stacked-bar-wrap">
                        <div className="pa-stacked-bar">
                          <div className="pa-stacked-seg" style={{ height:`${(m.resolved/total)*100}%`, background:'#10b981' }} title={`Resolved: ${m.resolved}`} />
                          <div className="pa-stacked-seg" style={{ height:`${(m.inProgress/total)*100}%`, background:'#3b82f6' }} title={`In Progress: ${m.inProgress}`} />
                          <div className="pa-stacked-seg" style={{ height:`${(m.pending/total)*100}%`, background:'#f59e0b' }} title={`Pending: ${m.pending}`} />
                        </div>
                      </div>
                      <span className="pa-stacked-lbl">{m.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="pa-legend" style={{marginTop:'0.75rem'}}>
                <span><span className="pa-dot" style={{background:'#10b981'}}/>Resolved</span>
                <span><span className="pa-dot" style={{background:'#3b82f6'}}/>In Progress</span>
                <span><span className="pa-dot" style={{background:'#f59e0b'}}/>Pending</span>
              </div>
            </div>
          </>
        )}

        {/* ── BLOCKS tab ───────────────────────── */}
        {activeTab === 'blocks' && (
          <>
            {/* Heatmap */}
            <div className="pa-card pa-card--full">
              <h3 className="pa-card-title">Complaint Heatmap</h3>
              <p className="pa-card-sub">Number of complaints per block per day (darker = more)</p>
              <div className="pa-heatmap-wrap">
                <div className="pa-heatmap-days">
                  <div className="pa-heatmap-corner" />
                  {DAYS.map(d => <div key={d} className="pa-heatmap-day-label">{d}</div>)}
                </div>
                {HEATMAP.map(row => (
                  <div key={row.block} className="pa-heatmap-row">
                    <div className="pa-heatmap-block-label">{row.block}</div>
                    {DAYS.map(d => {
                      const val = row[d];
                      const intensity = val / MAX_HEAT;
                      return (
                        <div
                          key={d}
                          className="pa-heatmap-cell"
                          style={{ background: `rgba(102,126,234,${0.08 + intensity * 0.85})` }}
                          title={`${row.block} ${d}: ${val} complaint${val !== 1 ? 's' : ''}`}
                        >
                          {val > 0 && <span className="pa-heatmap-val">{val}</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="pa-heatmap-scale">
                <span>Low</span>
                {[0.08,0.3,0.55,0.75,0.93].map((op,i) => (
                  <div key={i} className="pa-scale-cell" style={{background:`rgba(102,126,234,${op})`}} />
                ))}
                <span>High</span>
              </div>
            </div>

            {/* Block comparison bars */}
            <div className="pa-card pa-card--full">
              <h3 className="pa-card-title">Complaints by Block</h3>
              <p className="pa-card-sub">Raised vs resolved per block</p>
              <div className="pa-block-chart">
                {BLOCK_DATA.map(b => (
                  <div key={b.block} className="pa-block-row">
                    <span className="pa-block-name">{b.block}</span>
                    <div className="pa-block-bars">
                      <div className="pa-block-bg">
                        <div className="pa-block-raised" style={{ width:`${(b.complaints/maxBlock)*100}%`, background:b.color }} />
                      </div>
                      <div className="pa-block-bg">
                        <div className="pa-block-resolved" style={{ width:`${(b.resolved/maxBlock)*100}%` }} />
                      </div>
                    </div>
                    <div className="pa-block-nums-wrap">
                      <span className="pa-block-nums">{b.resolved}/{b.complaints}</span>
                      <span className="pa-block-rate">{b.complaints > 0 ? Math.round((b.resolved/b.complaints)*100) : 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pa-legend" style={{marginTop:'1rem'}}>
                <span><span className="pa-dot" style={{background:'#667eea'}}/>Raised</span>
                <span><span className="pa-dot" style={{background:'#10b981'}}/>Resolved</span>
              </div>
            </div>
          </>
        )}

        {/* ── SENTIMENT tab ────────────────────── */}
        {activeTab === 'sentiment' && (
          <>
            <div className="pa-row">
              {/* Sentiment donut */}
              <div className="pa-card">
                <h3 className="pa-card-title">AI Sentiment Analysis</h3>
                <p className="pa-card-sub">Complaint tone classification by AI</p>
                <div className="pa-donut-wrap">
                  <div className="pa-donut-chart">
                    <DonutChart slices={SENTIMENT} size={160} thickness={34} />
                    <div className="pa-donut-center">
                      <span className="pa-donut-num">10</span>
                      <span className="pa-donut-sub">Analysed</span>
                    </div>
                  </div>
                  <div className="pa-donut-legend">
                    {SENTIMENT.map(s => (
                      <div key={s.label} className="pa-legend-row">
                        <span className="pa-legend-dot" style={{ background: s.color }} />
                        <span className="pa-legend-label">{s.emoji} {s.label}</span>
                        <span className="pa-legend-val">{s.count}</span>
                        <span className="pa-legend-pct">{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sentiment bar breakdown */}
              <div className="pa-card" style={{flex:2}}>
                <h3 className="pa-card-title">Sentiment by Category</h3>
                <p className="pa-card-sub">Which categories generate the most negative feedback</p>
                <div className="pa-sent-breakdown">
                  {[
                    { cat:'Maintenance',    neg:2, neu:1, pos:0 },
                    { cat:'Infrastructure', neg:3, neu:0, pos:0 },
                    { cat:'Hostel',         neg:1, neu:1, pos:0 },
                    { cat:'Academics',      neg:1, neu:0, pos:1 },
                  ].map(row => {
                    const total = row.neg + row.neu + row.pos;
                    return (
                      <div key={row.cat} className="pa-sent-row">
                        <span className="pa-sent-cat">{row.cat}</span>
                        <div className="pa-sent-bar-wrap">
                          <div className="pa-sent-bar-seg" style={{ width:`${(row.neg/total)*100}%`, background:'#ef4444' }} title={`Negative: ${row.neg}`} />
                          <div className="pa-sent-bar-seg" style={{ width:`${(row.neu/total)*100}%`, background:'#f59e0b' }} title={`Neutral: ${row.neu}`} />
                          <div className="pa-sent-bar-seg" style={{ width:`${(row.pos/total)*100}%`, background:'#10b981' }} title={`Positive: ${row.pos}`} />
                        </div>
                        <span className="pa-sent-total">{total}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pa-legend" style={{marginTop:'1rem'}}>
                  <span><span className="pa-dot" style={{background:'#ef4444'}}/>Negative</span>
                  <span><span className="pa-dot" style={{background:'#f59e0b'}}/>Neutral</span>
                  <span><span className="pa-dot" style={{background:'#10b981'}}/>Positive</span>
                </div>
              </div>
            </div>

            {/* AI insight cards */}
            <div className="pa-insight-grid">
              {[
                { icon:'🎯', title:'Top Pain Point', desc:'Infrastructure complaints generate the highest negativity — 3 of 3 rated negative.', color:'#fef2f2', border:'#fca5a5' },
                { icon:'⚡', title:'Fast Resolution', desc:'Block C has the highest resolution rate at 100% across 2 complaints.', color:'#ecfdf5', border:'#6ee7b7' },
                { icon:'📅', title:'Peak Day', desc:'Thursday sees the most complaints raised (10) — likely after mid-week maintenance cycles.', color:'#eff6ff', border:'#93c5fd' },
                { icon:'🤖', title:'AI Recommendation', desc:'Prioritise elevator and Wi-Fi infrastructure repairs to reduce recurring complaints.', color:'#f5f3ff', border:'#c4b5fd' },
              ].map(ins => (
                <div key={ins.title} className="pa-insight-card" style={{ background:ins.color, borderColor:ins.border }}>
                  <span className="pa-insight-icon">{ins.icon}</span>
                  <div>
                    <p className="pa-insight-title">{ins.title}</p>
                    <p className="pa-insight-desc">{ins.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer note */}
        <div className="pa-note">
          <span>🔒</span>
          <span>Data is anonymised. Personal details are not disclosed publicly. For detailed admin analytics, use the Admin Dashboard.</span>
        </div>

      </div>
    </div>
  );
}
