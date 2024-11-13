import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 정보를 가져옴

  const handleButtonClick = (buttonName) => {
    navigate('/main/' + buttonName); // 클릭 시 경로로 이동
  };

  // 현재 경로와 버튼 이름이 일치할 경우 스타일 설정
  const getButtonStyle = (path) => ({
    color: location.pathname.startsWith(path) ? 'var(--purple)' : 'var(--black200)',
    borderBottom: location.pathname.startsWith(path) ? '1px solid var(--purple500)' : 'none',
  });

  return (
    <div className='nav-wrap'>
      <button
        onClick={() => handleButtonClick('friends')}
        style={getButtonStyle('/main/friends')}
      >
        친구들과
      </button>
      <button
        onClick={() => handleButtonClick('community')}
        style={getButtonStyle('/main/community')}
      >
        커뮤니티
      </button>
      <button
        onClick={() => handleButtonClick('stars')}
        style={getButtonStyle('/main/stars')}
      >
        별이에게
      </button>
    </div>
  );
};

export default Nav;



