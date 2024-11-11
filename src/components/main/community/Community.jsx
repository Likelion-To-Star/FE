import React, { useState, useEffect } from 'react';
import ComImg from '../../../assets/img/com-img1.png';
import MkImg from '../../../assets/img/mkCom.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Community = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [activeTab, setActiveTab] = useState('ongoing');
  const [communities, setCommunities] = useState([]);
  const [mycommunities,setMyCommmunities] = useState([]);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setTimeout(() => {
      navigate('/main/community/mkcom');
    }, 100);
  };


  const handleAllCommunitiesClick = async () => {
    
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
        return;
      }
      const response = await axios.get(`${BASE_URL}/api/community/preview/all`, {
        headers: {
          Authorization: token,
        },
        params: {
          page: 0, // 초기 페이지 번호
          size: 5, // 조회할 커뮤니티 개수
        },
      });
      
      if (response.data.isSuccess) {
        setCommunities(response.data.result);
      } else {
        console.error('Failed to fetch communities:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const handleMyCommunitiesClick = async () => {
    
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옴

      // 토큰이 존재하지 않을 경우 처리
      if (!token) {
        alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
        return;
      }
      const response = await axios.get(`${BASE_URL}/api/community/preview/my`, {
        headers: {
          Authorization: token,
        },
        params: {
          page: 0, // 초기 페이지 번호
          size: 5, // 조회할 커뮤니티 개수
        },
      });
      
      if (response.data.isSuccess) {
        setMyCommmunities(response.data.result);
      } else {
        console.error('Failed to fetch communities:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      handleAllCommunitiesClick();
    }
    if(activeTab === 'ongoing'){
      handleMyCommunitiesClick();
    }
  }, [activeTab]);

  const handleCommunityClick = async(communityId) => {
    localStorage.setItem("ComId", communityId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.');
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/community/${communityId}/preview`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.isSuccess) {
        if(response.data.result.isOwner===false)
          navigate('/main/community/entercom');
        else
          navigate('/main/community/changecom');
      }
    } catch (error) {
      console.error('error getcommunityData', error);
    }
  };
  const handleChattingClick = async (communityId) => {
    localStorage.setItem("ComId", communityId);
    const jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
      alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/community/${communityId}/membership-check`, {
        headers: {
          Authorization: jwtToken,
        },
      });

      if (response.data.isSuccess) {
        const isMember = response.data.result;
        console.log("회원 여부 : ", isMember);

        if (isMember) {
          // 회원일 경우 채팅방으로 이동
          navigate('/main/community/chatting');
        } else {
          // 회원이 아닐 경우, 회원 가입 후 채팅방으로 이동
          navigate('/main/community/entercom');
        }
      }
    } catch (error) {
      console.error("회원 여부 확인 중 오류 발생:", error);
    }
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
        {activeTab === 'all' && communities.length > 0 ? (
          communities.map((community) => (
            <button
              key={community.communityId}
              className='contents'
            >
              <div className='img-wrap' onClick={() => handleCommunityClick(community.communityId)}>
              <img src={community.profileImage || ComImg} alt="커뮤니티 이미지" />
              </div>
              <div className='text'
              onClick={() => handleChattingClick(community.communityId)}>
                <h1>{community.title}</h1>
                <p>{community.description}</p>
              </div>
            </button>
          ))
        ) : (
          mycommunities.map((community) => (
            <button key={community.communityId} className='contents' >
              <div className='img-wrap' onClick={() => handleCommunityClick(community.communityId)}>
                <img src={community.profileImage || ComImg} alt="커뮤니티 이미지" />
              </div>
              <div className='text'
              onClick={() => handleChattingClick(community.communityId)}>
                <h1>{community.title}</h1>
                <p>{community.description}</p>
              </div>
            </button>
          ))
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
