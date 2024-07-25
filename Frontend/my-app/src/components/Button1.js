import React from 'react';

const Button1 = ({ className }) => (
  <button className={className} onClick={() => alert('Button 1 clicked')}>
    Bet
  </button>
);

export default Button1;
