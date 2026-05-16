import React from 'react';

const GlassCard = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`glass-card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
