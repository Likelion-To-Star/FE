import React, { useState, useEffect, useRef } from 'react';
import ComImg from '../../../assets/img/com-img1.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertWhen from "../../Util/AlertWhen";

const Mycom = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [mycommunities, setMyCommunities] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const [error,setError] =useState(false);
  
  // 커뮤니티 데이터 가져오기
  const fetchMyCommunities = async (currentPage) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/community/preview/my`, {
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
          setMyCommunities((prevCommunities) => [
            ...prevCommunities,
            ...newCommunities,
          ]);
        }
      } else {
        console.error('Failed to fetch communities:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      setError(true);
    }
  };

  // 페이지 변경 시 데이터 요청
  useEffect(() => {
    if (hasMore) {
      fetchMyCommunities(page);
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
      setError(true);
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
      setError(true);
    }
  };

  return (
    <div>
      {error && <AlertWhen message="별나라에 닿지 못했어요. 다시 한번 시도해 주세요." />}
      {mycommunities.map((community) => (
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

export default Mycom;
