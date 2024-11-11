import React, { useState, useEffect } from 'react';
import ComImg from '../../../assets/img/com-img1.png';
import MkImg from '../../../assets/img/mkCom.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Allcom from './Allcom';
import Mycom from './Mycom';

const Community = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [activeTab, setActiveTab] = useState('ongoing');

  const navigate = useNavigate();

  //커뮤니티 생성페이지로 이동
  const handleButtonClick = () => {
    setTimeout(() => {
      navigate('/main/community/mkcom');
    }, 100);
  };


  return (
    <div className="community-wrap">
      <div className="select-com">
        <button
          className={`ongoing-com ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          <p>참여 중인 커뮤니티</p>
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
        {activeTab === 'all'? (
          <Allcom/>
        ) : (
          <Mycom/>
        )}
      </div>

      <button className='mk-com' onClick={handleButtonClick}>
        <img src={MkImg} alt="" />
        <p>커뮤니티 만들기</p>
      </button>
    </div>
  );
};

export default Community;
