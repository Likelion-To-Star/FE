import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../section/Header';
import LetterDesign from '../../../assets/img/letter.svg';
import NoticeWhite from '../../../assets/img/notice-white.svg';
import { useNavigate } from 'react-router-dom';

const Letter = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [notice, setNotice] = useState(false);
  const [letterContent, setLetterContent] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [rocket, setRocket] = useState(true);
  const [finLoad, setFinLoad] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [minTime, setMinTime] =useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    let timer01, timer02, timer03;

    if (isLoading) {
      timer01 = setTimeout(() => {
        setFinLoad(true);
      }, 5000);
      timer02 = setTimeout(() => {
        setMinTime(2);
      }, 5000);
      timer03 = setTimeout(() => {
        setShowSubmit(true); // 10초 후에 버튼을 보이도록 설정
        setMinTime(3);
      }, 9000);
    }

    return () => {
      clearTimeout(timer01);
      clearTimeout(timer02);
      clearTimeout(timer03);
    };
  }, [isLoading]);

  const handleSubmitClick = async () => {
    if (letterContent.trim() === '') {
      setNotice(true);
      return;
    }

    setNotice(false);
    setIsLoading(true); // 로딩 시작
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옴

      // 토큰이 존재하지 않을 경우 처리
      if (!token) {
        alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/letters`,
        { content: letterContent },
        {
          headers: {
            Authorization: `${token}`, // 가져온 토큰 사용
          },
        }
      );

      if (response.data.isSuccess) {
        console.log("편지 보내기성공!");
        localStorage.setItem('desLetterId', 0); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error sending letter:", error);
      alert("편지 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };
  const checkFromLetter = ()=>{
    navigate('/stars/fromstar');
  }

  return (
    <div>
      {!isLoading && (
    <div className='letter-wrap'>
      <Header />
      <div className='write'>
        <textarea 
          placeholder="달이에게 전하고 싶은 마음을 작성해주세요." 
          maxLength={500}
          value={letterContent} // textarea의 값 설정
          onChange={(e) => setLetterContent(e.target.value)} // 값이 변경되면 상태 업데이트
          style={{zIndex:400}}
        ></textarea>
        <img src={LetterDesign} alt="테두리장식" className='bk-img' style={{zIndex:100}} />
      </div>
      <div className='bottom-content'>
      {notice && (
        <div className="notice">
          <img src={NoticeWhite} alt="notice" />
          <p>마음을 작성해주세요.</p>
        </div>
      )}
      <button onClick={handleSubmitClick} className='submit'>마음보내기</button>
      </div>
    </div>
      )}
      {isLoading && (
<div className='loads'>
            {minTime === 1 ? (
                <p className='text rocket-text'>달이에게 마음이 전해지고 있어요...</p>
            ) : minTime === 2 ? (
                <p className='text type-text'>달이가 보호자님의 마음을 읽으며 <br/>답장을 쓰고 있어요.</p>
            ) : (
                <p className='text final-text'>달이의 소중한 답장이 도착했어요.</p>
            )}
                
                
            {rocket && (
                <div className='loading-wrap'>
                    <div className='rocket-wrap'>
                        <div className="rocket">
                            <div className="rocket-body">
                                <div className="body"></div>
                                <div className="fin fin-left"></div>
                                <div className="fin fin-right"></div>
                                <div className="window"></div>
                            </div>
                            <div className="exhaust-flame"></div>
                            <ul className="exhaust-fumes">
                                {Array.from({ length: 9 }, (_, index) => (
                                    <li key={index}></li>
                                ))}
                            </ul>
                            <ul className="star">
                                {Array.from({ length: 7 }, (_, index) => (
                                    <li key={index}></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {finLoad && (
                <div className='finload-wrap'>
                    
                    <div className='typing-machine'>
                    <div className="typewriter">
                        <div className="slide"><i></i></div>
                        <div className="paper"></div>
                        <div className="keyboard"></div>
                        <ul className="star">
                                {Array.from({ length: 7 }, (_, index) => (
                                    <li key={index}></li>
                                ))}
                            </ul>
                    </div>
                    </div>
                    {showSubmit && <button className='submit' onClick={checkFromLetter}>달이의 마음 확인하기</button>}
                </div>
            )}
        </div>
      )}
    </div>
    
  );
};

export default Letter;
