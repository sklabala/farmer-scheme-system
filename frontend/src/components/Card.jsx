import React from 'react';
import './Card.css';

const Card = ({ title, children, actions }) => (
  <div className="card">
    <div className="card-header">
      <h3>{title}</h3>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
    <div className="card-content">{children}</div>
  </div>
);

export default Card;