import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button1 = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ListEvents');
  };

  return (
    <button className={className} onClick={handleClick}>
      Ver Partidos
    </button>
  );
};

export default Button1;
