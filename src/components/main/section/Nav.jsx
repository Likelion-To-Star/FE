import React from 'react';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate(); 

  return (
    <div className='nav-wrap'>
        <button onClick={() => navigate('/friends')}>친구들과</button>
        <button onClick={() => navigate('/community')}>커뮤니티</button>
        <button onClick={() => navigate('/stars')}>별이에게</button>
    </div>
  );
}

export default Nav;

