import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '.././section/Header';
import LetterDesign from '../../../assets/img/Tostar-bk.svg';

const ToStar = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [letterContent, setLetterContent] = useState('');
  const letterId = localStorage.getItem("desLetterId");

  useEffect(() => {
    const getdetailLetter =  async ()=>{
      try{
        const token = localStorage.getItem("token");

        // 토큰이 존재하지 않을 경우 처리
        if (!token) {
          alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/letters/${letterId}`, {
          headers: {
            Authorization: `${token}`, // 가져온 토큰 사용
          },
        });
        if (response.data.isSuccess) {
          setLetterContent(response.data.result.content);
        }else {
          console.error('편지가져오기 실패: ', response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    getdetailLetter();
  }, []);
    return (
        <div className='tostar-wrap'>
          <Header />
          <div className='write'>
            <div className='text'>
            {letterContent || '편지가 비어있습니다.'}
            </div>
            <img src={LetterDesign} alt="테두리장식" className='bk-img' />
          </div>
        </div>
      );
    };
    

export default ToStar
