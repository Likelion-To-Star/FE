import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Bkimg from '../../../assets/img/bk-img.png';
import Profile from '../../../assets/img/profile.png';
import { useNavigate } from 'react-router-dom';

const EnterCom = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [communityData, setcommunityData] = useState(null);
  const [assign, setAssign] = useState(false);
  const communityId = localStorage.getItem('ComId');
  const navigate = useNavigate();

  // 커뮤니티 데이터 가져오기
  const getcommunityData = async () => {
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
        setcommunityData(response.data.result);
      }
    } catch (error) {
      console.error('error getcommunityData', error);
    }
  };

  // 커뮤니티 회원 여부 확인
  const getIsMember = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.');
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/community/${communityId}/membership-check`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.isSuccess) {
        setAssign(response.data.result);
      }
    } catch (error) {
      console.error('error getIsMember', error);
    }
  };

  useEffect(() => {
    getcommunityData();
    getIsMember();
  }, []);

  useEffect(() => {
    // assign 값이 변경될 때마다 최신 데이터를 다시 가져옴
    getcommunityData();
  }, [assign]);

  // 참가, 퇴장 처리 함수
  const handleAssignClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.');
        return;
      }

      if (!assign) {
        // 커뮤니티 참여하기
        const response = await axios.post(
          `${BASE_URL}/api/community/${communityId}/join`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.data.isSuccess) {
          setAssign(true);
          await getcommunityData();
        } else {
          console.error('Failed to join community:', response.data.message);
        }
      } else {
        // 커뮤니티 떠나기
        const response = await axios.post(
          `${BASE_URL}/api/community/${communityId}/leave`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.data.isSuccess) {
          setAssign(false);
          await getcommunityData();
        } else {
          console.error('Failed to leave community:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error in handleAssignClick:', error);
    }
  };
    return (
    <div className='entercom-wrap'  style={{
        backgroundImage: communityData ? `url(${communityData.communityProfileImage})` : '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className='cen-align'>
            <div className='profile'>
            <div className='img-wrap'>
              <img src={communityData && communityData.ownerPetProfileImage ? communityData.ownerPetProfileImage:Profile} alt="주인이미지" />
             </div> 
              <p>{ communityData ? communityData.ownerPetName: "이름 없음"}</p></div>
            <h1>{ communityData ? communityData.communityName: '로딩중'}</h1>
            <p>{ communityData ? communityData.communityDescription: '로딩중'}</p>
            
        </div>
        <button onClick={handleAssignClick}> {assign ? "커뮤니티 떠나기" : "커뮤니티 참여하기"}</button>
    </div>
  )
}

export default EnterCom
