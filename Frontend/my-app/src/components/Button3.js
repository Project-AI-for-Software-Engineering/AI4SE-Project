import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button3 = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/MyBets');
  };

  return (
    <button className={className} onClick={handleClick}>
      My Bets
    </button>
  );
};

export default Button3;
