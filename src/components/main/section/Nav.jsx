import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(''); // 초기 버튼 상태 설정

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName); // 클릭한 버튼의 이름으로 상태 업데이트
    navigate('/main/' + buttonName); // 경로로 이동
  };

  return (
    <div className='nav-wrap'>
      <button 
        onClick={() => handleButtonClick('friends')}
        style={{ color: activeButton === 'friends' ? 'var(--purple)' : 'var(--black200)' }}
      >
        친구들과
      </button>
      <button 
        onClick={() => handleButtonClick('community')}
        style={{ color: activeButton === 'community' ? 'var(--purple)' : 'var(--black200)' }}
      >
        커뮤니티
      </button>
      <button 
        onClick={() => handleButtonClick('stars')}
        style={{ color: activeButton === 'stars' ? 'var(--purple)' : 'var(--black200)' }}
      >
        별이에게
      </button>
    </div>
  );
}

export default Nav;

