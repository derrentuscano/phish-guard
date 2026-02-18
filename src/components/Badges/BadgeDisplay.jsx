import React from 'react';
import { getTierColor, getTierLabel } from '../../utils/badges';
import './BadgeDisplay.css';

const BadgeDisplay = ({ badge, size = 'medium', showDetails = true, earned = true }) => {
  const sizeClass = `badge-${size}`;
  
  return (
    <div className={`badge-card ${sizeClass} ${earned ? 'earned' : 'locked'}`}>
      <div 
        className="badge-icon" 
        style={{ borderColor: earned ? getTierColor(badge.tier) : '#ccc' }}
      >
        <span className="badge-emoji">{badge.icon}</span>
        {!earned && <div className="badge-lock">🔒</div>}
      </div>
      {showDetails && (
        <div className="badge-details">
          <div 
            className="badge-tier"
            style={{ color: earned ? getTierColor(badge.tier) : '#999' }}
          >
            {getTierLabel(badge.tier)}
          </div>
          <h4 className="badge-name">{badge.name}</h4>
          <p className="badge-description">{badge.description}</p>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
