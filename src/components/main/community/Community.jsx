import React, { useState } from 'react';

const Community = () => {
  const [activeButton, setActiveButton] = useState('ongoing');

  const toggleButton = () => {
    setActiveButton(activeButton === 'ongoing' ? 'all' : 'ongoing');
  };

  return (
    <div className="community-wrap">
      <div className="select-com">
        <div className={`slider-bg ${activeButton}`}></div>
        <button
          className={`ongoing-com ${activeButton === 'ongoing' ? 'active' : ''}`}
          onClick={toggleButton}
        >
          참여 중인 커뮤니티
        </button>
        <button
          className={`all-com ${activeButton === 'all' ? 'active' : ''}`}
          onClick={toggleButton}
        >
          모든 커뮤니티
        </button>
      </div>
    </div>
  );
};

export default Community;
