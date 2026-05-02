/* ─── Route Transition Loading Screen ───────────────────── */
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './LoadingScreen.css';

export default function RouteTransition({ children }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Skip transition on initial mount
    if (prevPath.current === location.pathname) return;

    prevPath.current = location.pathname;
    setShowContent(false);
    setIsTransitioning(true);

    // Show loading for 600ms, then fade in the new content
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setShowContent(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isTransitioning && (
        <div className="cp-transition-root">
          {/* Spinner rings */}
          <div className="cp-loading-spinner-wrap">
            <div className="cp-loading-ring cp-loading-ring--1" />
            <div className="cp-loading-ring cp-loading-ring--2" />
            <div className="cp-loading-ring cp-loading-ring--3" />
            <div className="cp-loading-dot-center" />
          </div>

          {/* Brand */}
          <h1 className="cp-loading-brand">CampusPulse</h1>
          <p className="cp-loading-tagline">CONNECT · REPORT · RESOLVE</p>

          {/* Progress bar */}
          <div className="cp-loading-bar-wrap">
            <div className="cp-loading-bar">
              <div className="cp-loading-bar-fill" />
              <div className="cp-loading-bar-glow" />
            </div>
          </div>
        </div>
      )}
      <div style={{
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.15s ease',
      }}>
        {children}
      </div>
    </>
  );
}
