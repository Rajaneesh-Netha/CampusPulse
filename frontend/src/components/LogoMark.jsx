/* ─── LogoMark — compact brand mark for sidebars & headers ─── */

/**
 * Props:
 *   variant: 'dark' (default) | 'light' | 'colored'
 *     dark    → white text/paths,  for dark sidebars (Admin / InCharge)
 *     light   → dark text,         for light sidebars (Student / Login)
 *     colored → full multicolor gradient wave (matches homepage Logo)
 *   showText: true (default) | false
 *   size: icon size in px, default 36
 */
export default function LogoMark({ variant = 'dark', showText = true, size = 36 }) {
  const isDark    = variant === 'dark';
  const isColored = variant === 'colored';

  const textColor = isDark ? '#ffffff' : '#1a1a2e';
  const tagColor  = isColored ? '#667eea' : (isDark ? 'rgba(255,255,255,0.55)' : '#94a3b8');

  /* Unique ID prefix so multiple instances don't share gradient IDs */
  const uid = `lm${size}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>

      {/* Icon square */}
      <div style={{
        width:  size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isDark
          ? '0 4px 12px rgba(102,126,234,0.45)'
          : '0 3px 10px rgba(102,126,234,0.30)',
      }}>
        {isColored ? (
          <svg viewBox="0 0 36 36" width={size * 0.65} height={size * 0.65} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`${uid}wg`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#67e8f9" stopOpacity="0.85" />
                <stop offset="50%"  stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path d="M3 18 Q7 10 11 18 T19 18 T27 18 T33 18" stroke={`url(#${uid}wg)`} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="18" r="2.2" fill="white" opacity="0.9" />
            <circle cx="19" cy="18" r="2.2" fill="white" opacity="0.9" />
            <circle cx="27" cy="18" r="2.2" fill="white" opacity="0.9" />
            <line x1="19" y1="18" x2="19" y2="11" stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="19" cy="9" r="1.4" fill="rgba(255,255,255,0.65)" />
          </svg>
        ) : (
          <svg viewBox="0 0 36 36" width={size * 0.62} height={size * 0.62} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18 Q7 10 11 18 T19 18 T27 18 T33 18" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="18" r="2.5" fill="white" />
            <circle cx="19" cy="18" r="2.5" fill="white" />
            <circle cx="27" cy="18" r="2.5" fill="white" />
            <line x1="19" y1="18" x2="19" y2="11" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="19" cy="9" r="1.5" fill="rgba(255,255,255,0.6)" />
          </svg>
        )}
      </div>

      {/* Text */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, minWidth: 0 }}>
          <span style={{
            fontSize: Math.round(size * 0.38),
            fontWeight: 800,
            ...(isColored ? {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 55%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            } : {
              color: textColor,
            }),
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}>
            CampusPulse
          </span>
          <span style={{
            fontSize: Math.round(size * 0.24),
            fontWeight: 500,
            color: tagColor,
            whiteSpace: 'nowrap',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}>
            Campus Portal
          </span>
        </div>
      )}
    </div>
  );
}
