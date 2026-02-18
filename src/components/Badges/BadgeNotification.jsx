import React, { useEffect } from 'react';
import BadgeDisplay from './BadgeDisplay';
import './BadgeDisplay.css';

const BadgeNotification = ({ badge, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="badge-notification">
      <div className="badge-notification-header">
        <span className="badge-notification-icon">🎉</span>
        <h3>Achievement Unlocked!</h3>
      </div>
      <div className="badge-notification-content">
        <BadgeDisplay badge={badge} size="small" showDetails={false} />
        <div className="badge-notification-details">
          <h4 className="badge-notification-name">{badge.name}</h4>
          <p className="badge-notification-description">{badge.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;
