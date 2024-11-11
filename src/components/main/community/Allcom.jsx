import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ComImg from '../../../assets/img/com-img1.png';
import axios from 'axios';

const Allcom = () => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [communities, setCommunities] = useState([]);
  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const observerRef = useRef(null);
  const navigate = useNavigate();
  
  const fetchCommunities = async (currentPage) => {
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
          page: currentPage,
          size: 5,
        },
      });

      if (response.data.isSuccess) {
        const newCommunities = response.data.result;

        // 데이터가 더 이상 없으면 hasMore를 false로 설정
        if (newCommunities.length === 0) {
          setHasMore(false);
        } else {
          setCommunities((prevCommunities) => [
            ...prevCommunities,
            ...newCommunities,
          ]);
        }
      } else {
        console.error('Failed to fetch communities:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  // 페이지가 변경될 때마다 데이터를 요청
  useEffect(() => {
    if (hasMore) {
      fetchCommunities(page);
    }
  }, [page]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore]);


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
    <div>
      {communities.map((community) => (
        <button key={community.communityId} className='contents'>
          <div className='img-wrap' onClick={() => handleCommunityClick(community.communityId)}>
            <img src={community.profileImage || ComImg} alt="커뮤니티 이미지" />
          </div>
          <div className='text' onClick={() => handleChattingClick(community.communityId)}>
            <h1>{community.title}</h1>
            <p>{community.description}</p>
          </div>
        </button>
      ))}
      {/* 로딩 감지용 div */}
      <div ref={observerRef} style={{ height: '1px' }} />
    </div>
  );
};

export default Allcom;
