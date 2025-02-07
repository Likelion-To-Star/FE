import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PreviewImg from '../../../assets/img/foot.svg';
import PlusIcon from '../../../assets/img/plus-icon.svg';
import NoticeIcon from '../../../assets/img/notice-icon.svg';
import AlertWhen from "../../Util/AlertWhen";

const MkCom = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태
  const [communityName, setCommunityName] = useState(''); // 커뮤니티 이름 상태
  const [communityDescription, setCommunityDescription] = useState(''); // 커뮤니티 설명 상태
  const [requireContents, setRequireContents] = useState(true); // 필수 항목 상태
  const navigate = useNavigate();
  const [error,setError] =useState(false);
  
  // 파일 선택 시 이미지 미리보기 설정
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 파일 읽기 완료 후 미리보기 이미지 설정
      };
      reader.readAsDataURL(file); // 이미지 파일을 Data URL로 읽기
    }
  };

  // input 클릭 트리거
  const triggerFileInput = () => {
    document.getElementById('imageUploadInput').click();
  };

  // 폼 제출 처리
  const handleSubmit = async (event) => {
    event.preventDefault();
    const imageFile = document.getElementById('imageUploadInput').files[0];
    if (!communityName || !communityDescription || !imageFile) {
      setRequireContents(false); // 필수 항목이 충족되지 않으면 메시지 표시
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile); // 이미지 파일 추가
    formData.append('title', communityName); // 커뮤니티명 추가
    formData.append('description', communityDescription); // 커뮤니티 소개 추가

    try {
            const token = localStorage.getItem("token"); 
            if (!token) {
              alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
              return;
            }
      const response = await axios.post(`${BASE_URL}/api/community`, formData, {
        headers: {
          'Authorization': token, 
          'Content-Type': 'multipart/form-data', 
        },
      });
      console.log('서버 응답:', response.data);
      setRequireContents(true); 
    } catch (error) {
      console.error('에러 발생:', error);
      setError(true);
    }
    navigate('/main/community');
  };

  return (
    <div className='MkCom-wrap'>
      {error && <AlertWhen message="별나라에 추억을 보내지 못했어요. 다시 한번 시도해 주세요." />}
      <form onSubmit={handleSubmit}>
        <div className='say'>
          <h2>사진을 등록해주세요.</h2>
          <p>* 필수 입력 항목입니다.</p>
        </div>

        <div className='input-img' onClick={triggerFileInput}>
          {imagePreview ? (
            <img src={imagePreview} alt="업로드 이미지 미리보기" className="image-preview" />
          ) : (
            <img src={PreviewImg} alt="업로드 아이콘" className="upload-icon" />
          )}
          <div className="add-icon">
            <img src={PlusIcon} alt="plus icon" />
          </div>
        </div>

        {/* 파일업로드 (숨김 처리) */}
        <input 
          id="imageUploadInput" 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleImageUpload} 
        />
        
        <div className='say name'>
          <h2>커뮤니티명</h2>
          <p>* 필수 입력 항목입니다.</p>
        </div>
        <textarea className='comName'
            type="text" 
            value={communityName} 
            onChange={(e) => setCommunityName(e.target.value)} 
            placeholder="커뮤니티명을 작성해주세요." 
          />
        <div className='say description'>
          <h2>커뮤니티 소개</h2>
          <p>* 필수 입력 항목입니다. 소개는 200자 이내로 작성해주세요.</p>
        </div>
        <textarea className='comDescription'
            value={communityDescription} 
            onChange={(e) => setCommunityDescription(e.target.value)} 
            placeholder="간략한 소개를 작성해주세요." 
            maxLength={200} 
        />

        <div className='bottom-content'>
          {!requireContents && <div className="notice">
            <img src={NoticeIcon} alt="notice" /><p>필수 입력 항목을 모두 작성해주세요.</p></div>}

          <button className="submit" type="submit">등록하기</button>
        </div>

      </form>
    </div>
  );
};

export default MkCom;
