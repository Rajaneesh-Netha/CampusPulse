/* ─── CampusPulse Loading Screen (no logo) ──────────────── */
import './LoadingScreen.css';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="cp-loading-root">
      {/* Floating particles */}
      <div className="cp-loading-particles">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="cp-particle" style={{ '--i': i }} />
        ))}
      </div>

      {/* Animated loader rings */}
      <div className="cp-loading-spinner-wrap">
        <div className="cp-loading-ring cp-loading-ring--1" />
        <div className="cp-loading-ring cp-loading-ring--2" />
        <div className="cp-loading-ring cp-loading-ring--3" />
        <div className="cp-loading-dot-center" />
      </div>

      {/* Brand text */}
      <h1 className="cp-loading-brand">CampusPulse</h1>
      <p className="cp-loading-tagline">CONNECT · REPORT · RESOLVE</p>

      {/* Progress bar */}
      <div className="cp-loading-bar-wrap">
        <div className="cp-loading-bar">
          <div className="cp-loading-bar-fill" />
          <div className="cp-loading-bar-glow" />
        </div>
      </div>

      {/* Message */}
      <p className="cp-loading-message">{message}</p>
    </div>
  );
}
