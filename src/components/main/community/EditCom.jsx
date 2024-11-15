import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PreviewImg from '../../../assets/img/foot.svg';
import PlusIcon from '../../../assets/img/plus-icon.svg';
import AlertWhen from "../../Util/AlertWhen";

const EditCom = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [imagePreview, setImagePreview] = useState(null);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const communityId = localStorage.getItem("ComId");
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  // URL을 File로 변환하는 함수
  const urlToFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // 커뮤니티 정보 가져오기
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/community/${communityId}/preview`, {
          headers: { Authorization: token },
        });

        const { communityName, communityDescription, communityProfileImage } = response.data.result;

        setCommunityName(communityName || '');
        setCommunityDescription(communityDescription || '');

        if (communityProfileImage) {
          setImagePreview(communityProfileImage);
          const file = await urlToFile(communityProfileImage, 'community-image.jpg');
          setImageFile(file);
        }
      } catch (error) {
        console.error('커뮤니티 정보 가져오기 에러:', error);
        setError(true);
      }
    };

    fetchCommunityData();
  }, [BASE_URL, communityId]);

  // 파일 선택 시 이미지 미리보기 설정
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // input 클릭 트리거
  const triggerFileInput = () => {
    document.getElementById('imageUploadInput').click();
  };

  // 폼 제출 처리
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', communityName);
    formData.append('description', communityDescription);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.');
        return;
      }

      const response = await axios.put(`${BASE_URL}/api/community/${communityId}`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('서버 응답:', response.data);
      navigate('/main/community');
    } catch (error) {
      console.error('에러 발생:', error);
      setError(true);
    }
  };

  return (
    <div className='MkCom-wrap'>
      {error && <AlertWhen message="별나라에 닿지 못했어요. 다시 한번 시도해 주세요." />}
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
        <textarea
          className='comName'
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          placeholder="커뮤니티명을 작성해주세요."
        />

        <div className='say description'>
          <h2>커뮤니티 소개</h2>
          <p>* 필수 입력 항목입니다. 소개는 200자 이내로 작성해주세요.</p>
        </div>
        <textarea
          className='comDescription'
          value={communityDescription}
          onChange={(e) => setCommunityDescription(e.target.value)}
          placeholder="간략한 소개를 작성해주세요."
          maxLength={200}
        />

        <div className='bottom-content'>
          <button className="submit" type="submit">등록하기</button>
        </div>
      </form>
    </div>
  );
};

export default EditCom;
