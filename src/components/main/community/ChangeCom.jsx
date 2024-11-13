import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Bkimg from '../../../assets/img/bk-img.png';
import Profile from '../../../assets/img/profile.png';
import Exit from '../../../assets/img/exit.svg';
import AlertWhen from "../../Util/AlertWhen";

const ChangeCom = () => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [communityData, setcommunityData] = useState(null);
    const communityId = localStorage.getItem("ComId");
    const [popup,setPopup] = useState(false);
    const navigate = useNavigate();
    const [error,setError] =useState(false);

    useEffect(()=>{
        //특정 페이지 가져오기
          const getcommunityData = async () => {
              try{
                      // 로컬 스토리지에서 토큰 가져오기
                    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옴
                   
                    // 토큰이 존재하지 않을 경우 처리
                    if (!token) {
                      alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
                      return;
                    }
                    
                  const response = await axios.get(`${BASE_URL}/api/community/${communityId}/preview`, { 
                      headers: {
                        Authorization: token, // 발급받은 JWT 토큰 삽입
                      },
                    });
                    if(response.data.isSuccess){
                      setcommunityData(response.data.result);
                    }
              }
              catch(error){
                  console.error("error getcommunityData", error);
                  setError(true);
              }
          };

  
          getcommunityData();
  
      },[]);
  
    const handlePopup = () => {
        setPopup(true);
    };
  // 커뮤니티 삭제 요청
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(true);
        return;
      }

      const response = await axios.delete(`${BASE_URL}/api/community/${communityId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.data.isSuccess) {
        navigate('/main/community'); // 메인 페이지로 이동
      } else {
        alert(`삭제 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError(true);
    } finally {
      setPopup(false);
    }
  };

    const popupRemove = () => {
        // 여기에 삭제 로직 추가
        console.log("삭제 확인");
        setPopup(false); 
    };
    const handleEdit = () => {
        navigate('/main/community/editcom');
    };
    return (
    <div className='changecom-wrap'  style={{
        backgroundImage: communityData ? `url(${communityData.communityProfileImage})` : `url(${Bkimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {error && <AlertWhen message="별나라에 닿지 못했어요. 다시 한번 시도해 주세요." />}
        <div className='cen-align'>
            <div className='profile'>
              <div className='img-wrap'>
                <img src={ communityData && communityData.ownerPetProfileImage ? communityData.ownerPetProfileImage : Profile} alt="주인이미지" />
              </div>
              <p>{ communityData ? communityData.ownerPetName: "이름 없음"}</p></div>
            <h1>{ communityData ? communityData.communityName: '로딩중'}</h1>
            <p>{ communityData ? communityData.communityDescription: '로딩중'}</p>
        </div>
        <div className='change-btn'>
            <button className='left' onClick={handleEdit}>수정하기</button>
            <button className='right' onClick={handlePopup}>삭제하기</button>
        </div>
        {popup && (
                <div className='del-popup'>
                    <img src={Exit} alt="exit" onClick={popupRemove}/>
                    <p>정말로 삭제하시겠습니까?</p>
                    <div className='pop-btn'>
                        <button className='left' onClick={handleDelete}>확인</button>
                        <button className='right' onClick={popupRemove}>취소</button>
                    </div>
                </div>
            )}
    </div>
  )
}

export default ChangeCom
