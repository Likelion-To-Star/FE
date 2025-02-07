import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MkImg from '../../../assets/img/mkCom.svg';
import Stamp from '../../../assets/img/stamp.svg';
import StampWhite from '../../../assets/img/stamp-white.svg';
import AlertWhen from "../../Util/AlertWhen";

const Stars = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // 페이지 상태 추가
  const [hasMore, setHasMore] = useState(true); // 데이터 추가 여부 확인

  const [error,setError] =useState(false);
  const observer = useRef();

  const handleButtonClick = () => {
    setTimeout(() => {
      navigate('/stars/letter');
    }, 100);
  };

  const handleLetterButtonClick = (letterId, fromto) => {
    localStorage.setItem('desLetterId', letterId);
    navigate(`/stars/${fromto}star`);
  };
  const lastLetterElementRef = useCallback(
    (node) => {
     
      if (loading || letters.length < 4) return; // 데이터가 4개 미만이면 observer 작동 안 함
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, letters.length]
  );
  

  useEffect(() => {
    const fetchLetters = async () => {
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/letters`, {
          params: { page, size: 4 },
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.data.isSuccess&&response.data.result.length > 0) {
          const newLetters = response.data.result;
          setLetters((prevLetters) => [...prevLetters, ...newLetters]);
          console.log(letters.length);
          setHasMore(newLetters.length > 0);
        } else {
          console.error('편지가져오기 실패: ', response.data.message);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setHasMore(false);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, [page]);

  return (
    <div className='stars-wrap'>
         {error && <AlertWhen message="별나라에서 편지를 불러오지 못했어요. 다시 한번 시도해 주세요." />}
      {letters.map((letter, index) => {
        const fromto = letter.sender === 'USER' ? 'to' : 'from';
        return (
          <div
            key={letter.letterId}
            ref={letters.length >= 4 && letters.length === index + 1 ? lastLetterElementRef : null}
 // 마지막 요소에 ref 할당
            className={`content ${fromto}`}
          >
            <img src={letter.sender === 'USER' ? Stamp : StampWhite} alt="stamp" className='stamp' />
            <h1>{letter.sender === 'USER' ? `TO. ${letter.petName}에게` : `FROM. ${letter.petName}`}</h1>
            <h2>{letter.createdAt}</h2>
            <p>{letter.content}</p>
            <button onClick={() => handleLetterButtonClick(letter.letterId, fromto)}>
              {letter.sender === 'USER' ? '보냈던 마음 확인하기' : `${letter.petName}의 마음 확인하기`}
            </button>
          </div>
        );
      })}
      {loading && <p>Loading...</p>}
      <button className='mk-com' onClick={handleButtonClick}>
        <img src={MkImg} alt="" />
        <p>마음보내기</p>
      </button>
    </div>
  );
};

export default Stars;
