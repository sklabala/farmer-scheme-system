import React from 'react';
import './Button.css';

const Button = ({ onClick, children, type = 'primary', disabled = false }) => (
  <button className={`btn ${type}`} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export default Button;