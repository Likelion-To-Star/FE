import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MkImg from '../../../assets/img/mkCom.svg';
import Stamp from '../../../assets/img/stamp.svg';
import StampWhite from '../../../assets/img/stamp-white.svg';

const Stars = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleButtonClick = () => {
    setTimeout(() => {
      navigate('/stars/letter');
    }, 100);
  };

  const handleLetterButtonClick = (letterId, fromto) => {
    localStorage.setItem('desLetterId', letterId); // letterId를 localStorage에 저장
    navigate(`/stars/${fromto}star`); // fromto에 따라 경로 이동
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem("token");

        // 토큰이 존재하지 않을 경우 처리
        if (!token) {
          alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/letters`, {
          params: { page: 1, size: 16 },
          headers: {
            Authorization: `${token}`, // 가져온 토큰 사용
          },
        });

        if (response.data.isSuccess) {
          setLetters(response.data.result.reverse()); //.slice(0, 8)
        } else {
          console.error('편지가져오기 실패: ', response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  return (
    <div className='stars-wrap'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        letters.map((letter) => {
          const fromto = letter.sender === 'USER' ? 'to' : 'from'; // fromto 변수 설정
          return (
            <div key={letter.letterId} className={`content ${fromto}`}>
              <img src={letter.sender === 'USER' ? Stamp : StampWhite} alt="stamp" className='stamp' />
              <h1>{letter.sender === 'USER' ? `TO. ${letter.petName}에게` : `FROM. ${letter.petName}`}</h1>
              <h2>{letter.createdAt}</h2>
              <p>{letter.content}</p>
              <button onClick={() => handleLetterButtonClick(letter.letterId, fromto)}>
                {letter.sender === 'USER' ? '보냈던 마음 확인하기' : '달이의 마음 확인하기'}
              </button>
            </div>
          );
        })
      )}
      <button className='mk-com' onClick={handleButtonClick}>
        <img src={MkImg} alt="" />
        <p>마음보내기</p>
      </button>
    </div>
  );
};

export default Stars;
