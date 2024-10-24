import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 정보를 가져옴

  const handleButtonClick = (buttonName) => {
    navigate('/main/' + buttonName); // 클릭 시 경로로 이동
  };

  return (
    <div className='nav-wrap'>
      <button 
        onClick={() => handleButtonClick('friends')}
        style={{ color: location.pathname.startsWith( '/main/friends' )? 'var(--purple)' : 'var(--black200)' }}
      >
        친구들과
      </button>
      <button 
        onClick={() => handleButtonClick('community')}
        style={{ color: location.pathname.startsWith('/main/community') ? 'var(--purple)' : 'var(--black200)' }}
      >
        커뮤니티
      </button>
      <button 
        onClick={() => handleButtonClick('stars')}
        style={{ color: location.pathname.startsWith( '/main/stars') ? 'var(--purple)' : 'var(--black200)' }}
      >
        별이에게
      </button>
    </div>
  );
}

export default Nav;


