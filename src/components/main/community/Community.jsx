import React, { useState } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('ongoing'); // 기본 상태: 'ongoing'

  return (
    <div className="community-wrap">
      <div className="select-com">
        {/* 참여 중인 커뮤니티 버튼 */}
        <button
          className={`ongoing-com ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          참여 중인 커뮤니티
        </button>

        {/* 모든 커뮤니티 버튼 */}
        <button
          className={`all-com ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          모든 커뮤니티
        </button>

        {/* 슬라이더 배경: 버튼 활성화에 따라 이동 */}
        <div className={`slider-bg ${activeTab === 'all' ? 'move-right' : 'move-left'}`}></div>
      </div>
    </div>
  );
};

export default Community;
