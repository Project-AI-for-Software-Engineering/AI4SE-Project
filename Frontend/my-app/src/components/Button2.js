import React from 'react';

const Button2 = ({ className }) => (
  <button className={className} onClick={() => alert('Button 2 clicked')}>
    See Results
  </button>
);

export default Button2;
