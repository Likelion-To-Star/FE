import React, { useState} from 'react';
import ComImg from '../../../assets/img/com-img1.png'
import MkImg from '../../../assets/img/mkCom.svg'
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const [activeTab, setActiveTab] = useState('ongoing'); // 기본 상태: 'ongoing'
  const navigate = useNavigate();
  const handleButtonClick= ()=>{
    setTimeout(() => {
      navigate('/main/community/mkcom');
    }, 100);
  }
  return (
    <div className="community-wrap">
      <div className="select-com">
        <button
          className={`ongoing-com ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
         <p> 참여 중인 커뮤니티</p>
        </button>
        <button
          className={`all-com ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <p>모든 커뮤니티</p>
        </button>
        <div className={`slider-bg ${activeTab === 'all' ? 'move-right' : 'move-left'}`}></div>
      </div>
      <div className='coms'>
        <div className='contents'>
          <img src={ComImg} alt="예시 이미지" />
          <div className='text'>
            <h1>반짝이는 기억들</h1>
            <p>우리 아이와 함께했던 행복한 순간들을 기억하고 기념해요</p>
          </div>
        </div>
      </div>
      <button className='mk-com' onClick={handleButtonClick}><img src={MkImg} alt="" /><p>커뮤니티 만들기</p></button>
    </div>
  );
};

export default Community;
