import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Bkimg from '../../../assets/img/bk-img.png';
import Profile from '../../../assets/img/profile.png';
import Exit from '../../../assets/img/exit.svg';

const ChangeCom = () => {
    const [communityData, setcommunityData] = useState(null);
    const [popup,setPopup] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        const getcommunityData = async () => {
            try{
                const response = await axios.get('http://13.209.61.158:8080/api/community/1/preview', { //{communityId}는 현재 커뮤니티에 따라 달라짐
                    headers: {
                      Authorization: 'Bearer YOUR_JWT_TOKEN', // 발급받은 JWT 토큰 삽입
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
        getcommunityData();
    },[]);
  
    const handlePopup = () => {
        setPopup(true);
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
        <div className='cen-align'>
            <div className='profile'><img src={Profile} alt="주인이미지" /><p>토토</p></div>
            <h1>작은 별들의 이야기</h1>
            <p>아이들이 작은 별처럼 반짝이며 남긴 이야기들을 나누는 공간입니다. 작은 이야기들을 모아 큰 추억을 만들어 봐요 :)</p>
            
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
                        <button className='left' onClick={popupRemove}>확인</button>
                        <button className='right' onClick={popupRemove}>취소</button>
                    </div>
                </div>
            )}
    </div>
  )
}

export default ChangeCom
