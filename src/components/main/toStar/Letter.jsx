import React, { useState } from 'react';
import Header from '.././section/Header';
import LetterDesign from '../../../assets/img/letter.svg';
import NoticeWhite from '../../../assets/img/notice-white.svg';

const Letter = () => {
  const [notice, setNotice] = useState(false);
  const [letterContent, setLetterContent] = useState(''); // textarea의 값을 저장

  // submit 버튼 클릭 시 실행되는 함수
  const handleSubmitClick = () => {
    if (letterContent.trim() === '') { // textarea가 비어 있으면 notice를 보여줌
      setNotice(true);
    } else {
      setNotice(false);
      // 여기서 추가적인 제출 로직을 작성할 수 있습니다 (예: 서버로 데이터 전송)
    }
  };

  return (
    <div className='letter-wrap'>
      <Header />
      <div className='write'>
        <textarea 
          placeholder="달이에게 전하고 싶은 마음을 작성해주세요." 
          maxLength={500}
          value={letterContent} // textarea의 값 설정
          onChange={(e) => setLetterContent(e.target.value)} // 값이 변경되면 상태 업데이트
        ></textarea>
        <img src={LetterDesign} alt="테두리장식" className='bk-img' />
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
  );
};

export default Letter;
