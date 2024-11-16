import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../section/Header";
import Nav from "../section/Nav";
import newpostImg from "../../../assets/img/friends/newpost-img.svg";
import "../../../assets/scss/components/newpost.scss";
import plusIcon from "../../../assets/img/plus-icon.svg";
import AlertWhen from "../../Util/AlertWhen";
import MemAlert from "../../../assets/img/friends/memory-alert.svg";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // 선택된 이미지 인덱스를 저장
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fileInputRef = useRef(null);
  const [alertmem, setAlertMem] = useState(false);
  const textareaRef = useRef(null);
  const [error314,setError314] =useState(false);
  const [error,setError] =useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);

    // 높이를 자동으로 조정
    textareaRef.current.style.height = "auto"; // 높이를 초기화
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용에 따라 높이 설정
  };

  // 이미지 선택 핸들러
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedImageIndex !== null) {
      // 선택된 이미지가 있을 경우 해당 이미지를 갱신
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedImageIndex] = selectedFiles[0]; // 새 파일로 교체
        return updatedImages;
      });
      setSelectedImageIndex(null); // 수정이 끝났으므로 인덱스 초기화
    } else {
      // 새로운 이미지를 추가
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  // 이미지를 클릭하면 파일 선택 창을 열도록 하는 함수
  const handleImageClick = (index) => {
    setSelectedImageIndex(index); // 수정할 이미지의 인덱스를 저장
    fileInputRef.current.click(); // 파일 선택 창 열기
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!title.trim()) {
      setAlertMem(true);
      return;
    }
    if (!content.trim()) {
      setAlertMem(true);
      return;
    }

    const handleContentChange = (e) => {
      setContent(e.target.value);
      e.target.style.height = "auto"; // 높이를 자동으로 초기화
      e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 따라 높이 조정
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const imagesToUpload = images.slice(0, 5); // 배열에서 5개까지만 선택
    imagesToUpload.forEach((image) => formData.append("images", image));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("토큰이 없습니다. 다시 로그인해 주세요.");
        navigate("/login");
        return;
      }

      const response = await axios.post(`${BASE_URL}/api/articles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

         // 413 오류 처리
    if (response.status === 413) {
      setError314("true");
      return;
    }
      if (response.data.isSuccess) {
        const newPost = response.data.result;
        navigate("/main/friends", { state: { newPost } });
        
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("게시물 등록 중 오류가 발생했습니다:", error);
      if (error.response) {
        console.error("서버 응답:", error.response.data);
        console.log(`게시물 등록 중 오류가 발생했습니다: ${error.response.data.message}`);
        setError(true);
      } else {
        console.log("네트워크 오류 또는 서버에 문제가 발생했습니다.");
        setError(true);
      }
    }
  };

  return (
    <div className="newpost-wrap">
      {error314 && <AlertWhen message="이미지 크기가 너무 큽니다." />}
      {error && <AlertWhen message="별나라에 추억을 보내지 못했어요. 다시 한번 시도해 주세요." />}
      <div className="newpost-container" style={{ backgroundColor: "#FAF7FE" }}>
        <div className="new-cnt">
          <div className="new-img-plus">
            <div className="new-img-title">
              <h4>사진을 등록해주세요</h4>
              <p>* 사진은 0~5장까지 등록 가능합니다.</p>
            </div>
            <div className="imgs-cnt">
              <label htmlFor="file-upload" className="custom-file-upload">
                <img src={newpostImg} alt="Upload" />
              </label>
              <input id="file-upload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} ref={fileInputRef} />
              <div className="preview-images">
                {images.slice(0, 5).map((img, idx) => (
                  <div className="oneImg" key={idx} onClick={() => handleImageClick(idx)}>
                    <img src={URL.createObjectURL(img)} alt="Preview" className="addedImg" />
                    <div className="plus-icon">
                      <img src={plusIcon} alt="plus" />
                    </div>
                  </div>
                ))}
                {/* 5개 이상 이미지를 추가하려고 할 때 안내 메시지 */}
                {images.length > 5 && <AlertWhen message="이미지는 최대 5개까지만 업로드할 수 있습니다." />}
              </div>
            </div>
          </div>

          <div className="new-text-cnt">
            <div className="new-text">
              <h4>추억명</h4>
              <p>* 필수 입력 항목입니다</p>
            </div>
            <input placeholder="추억의 이름을 작성해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="new-text-cnt">
            <div className="new-text">
              <h4>아이와의 추억</h4>
              <p>* 필수 입력 항목입니다. 추억은 300자 이내로 작성해주세요.</p>
            </div>
            <textarea
              ref={textareaRef} // ref를 textarea에 연결
              placeholder="아이와의 추억을 작성해주세요."
              value={content}
              onChange={handleContentChange}
              rows={1} // 초기 한 줄 설정
              style={{
                resize: "none", // 사용자가 수동으로 크기 조정 불가
                width: "100%", // 부모 컨테이너에 맞춤
                fontSize: "16px", // 가독성을 위해 적절한 크기 설정
                overflow: "hidden", // 스크롤 숨기기
              }}
            />
          </div>
        </div>
        <button className="memory-btn" onClick={handleSubmit}>
          추억 등록하기
          {alertmem ? (
            <p className="memory-alert">
              {" "}
              <img src={MemAlert} alt="alert" />
              필수 입력 항목을 모두 작성해주세요.
            </p>
          ) : (
            <></>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewPost;
