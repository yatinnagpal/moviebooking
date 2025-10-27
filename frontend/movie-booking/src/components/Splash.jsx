import React from 'react';

export default function Splash() {
  return (
    <div className="splash">
      <div className="splash-card">
        <div className="splash-logo">🎞️</div>
        <h1 className="splash-title">MovieBook</h1>
        <p className="splash-sub">Your seat. Your show. Your story.</p>

        <div className="splash-loader" aria-hidden>
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}
