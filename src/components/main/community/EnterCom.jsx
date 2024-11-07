import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Bkimg from '../../../assets/img/bk-img.png';
import Profile from '../../../assets/img/profile.png';


const EnterCom = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [communityData, setcommunityData] = useState(null);
    const [assign,setAssign] =useState(false);
    const communityId = localStorage.getItem("ComId");
    
    useEffect(()=>{
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
            }
        };
        const getIsmemeber = async () => {
          try{
            // 로컬 스토리지에서 토큰 가져오기
          const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옴
         
          // 토큰이 존재하지 않을 경우 처리
          if (!token) {
            alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
            return;
          }
          
        const response = await axios.get(`${BASE_URL}/api/community/${communityId}/membership-check`, {
            headers: {
              Authorization: token, // 발급받은 JWT 토큰 삽입
            },
          });
          if(response.data.isSuccess){
            setAssign(response.data.result);
          }
    }
    catch(error){
        console.error("error getIsmemeber", error);
    }
        };
        getcommunityData();
        getIsmemeber();
    },[]);
  
    const handleAssignClick  = async () => {
      if(!assign){
        setAssign(true);
      try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옴
  
        // 토큰이 존재하지 않을 경우 처리
        if (!token) {
          alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
          return;
        }
        const response = await axios.post(
          `${BASE_URL}/api/community/${communityId}/join`, // URL
          {}, // POST 요청의 body (빈 객체로 설정)
          {
            headers: {
              Authorization: `${token}`, // Bearer 접두어 추가
            },
          }
        );
        if (response.data.isSuccess) {
          setcommunityData(response.data.result);
        } else {
          console.error('Failed to fetch communities:', response.data.message);
        }
      } catch (error) {
        console.error("error postcommunityJoin", error);
      }
    }
      else{
        setAssign(false); 
       
        try {
          // 로컬 스토리지에서 토큰 가져오기
          const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옴
          
          // 토큰이 존재하지 않을 경우 처리
          if (!token) {
            alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
            return;
          }
        
          // 요청 전송
          const response = await axios.post(
            `${BASE_URL}/api/community/${communityId}/leave`, // URL
            {}, // POST 요청의 body (빈 객체로 설정)
            {
              headers: {
                Authorization: `${token}`, // Bearer 접두어 추가
              },
            }
          );
        
          if (response.data.isSuccess) {
            setcommunityData(response.data.result);
          } else {
            console.error("Failed to leave community:", response.data.message);
          }
        } catch (error) {
          console.error("Error in post community leave:", error);
        }
        
      }
        
      };
  
    return (
    <div className='entercom-wrap'  style={{
        backgroundImage: communityData ? `url(${communityData.communityProfileImage})` : `url(${Bkimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className='cen-align'>
            <div className='profile'><img src={Profile} alt="주인이미지" /><p>토토</p></div>
            <h1>작은 별들의 이야기</h1>
            <p>아이들이 작은 별처럼 반짝이며 남긴 이야기들을 나누는 공간입니다. 작은 이야기들을 모아 큰 추억을 만들어 봐요 :)</p>
            
        </div>
        <button onClick={handleAssignClick}> {assign ? "커뮤니티 떠나기" : "커뮤니티 참여하기"}</button>
    </div>
  )
}

export default EnterCom
