import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../section/Header";
import Nav from "../section/Nav";
import newpostImg from "../../../assets/img/friends/newpost-img.svg";
import "../../../assets/scss/components/newpost.scss";
import plusIcon from "../../../assets/img/plus-icon.svg";
import MemAlert from "../../../assets/img/friends/memory-alert.svg";
import AlertWhen from "../../Util/AlertWhen";

const EditPost = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [alertmem, setAlertMem] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // 선택된 이미지 인덱스를 저장
  const textareaRef = useRef(null);
  const [error314,setError314] =useState(false);
  const [error,setError] =useState(false);

  async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
    adjustTextareaHeight(); // 내용 변경 시 높이 조정
  };

  // textarea 높이 조정 함수
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용에 맞게 높이 설정
    }
  };

  // 불러온 content 값에 따라 textarea 높이 조정
  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/articles/${articleId}`, {
          headers: { Authorization: `${token}` },
        });
        const { title, content, images } = response.data.result;

        setTitle(title);
        setContent(content);

        // URL을 파일 객체로 변환하여 allImages 배열에 추가
        const imageFiles = await Promise.all(images.map((image) => urlToFile(image.url)));
        setAllImages(imageFiles);
      } catch (error) {
        console.error("게시물 불러오기 오류:", error);
        setError(true);
      }
    };
    fetchPost();
  }, []);

  //이미지 수정
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedImageIndex !== null) {
      // 선택된 이미지가 있을 경우 해당 이미지를 갱신
      setAllImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[selectedImageIndex] = selectedFiles[0]; // 새 파일로 교체
        return updatedImages;
      });
      setSelectedImageIndex(null); // 수정이 끝났으므로 인덱스 초기화
    } else {
      // 새로운 이미지를 추가
      setAllImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };
  // 이미지를 클릭하면 파일 선택 창을 열도록 하는 함수
  const handleImageClick = (index) => {
    setSelectedImageIndex(index); // 수정할 이미지의 인덱스를 저장
    fileInputRef.current.click(); // 파일 선택 창 열기
  };

  //이미지 제출
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setAlertMem(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    allImages.forEach((image) => formData.append("images", image));

    try {
      const token = localStorage.getItem("token");
      const response =await axios.put(`${BASE_URL}/api/articles/${articleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });
          // 413 오류 처리
    if (response.status === 413) {
      setError314("true");
      return;
    }
    if (response.data.isSuccess){
      navigate("/main/friends"); // Navigate to the posts list page after success
    }
      } catch (error) {
      console.error("게시물 수정 중 오류가 발생했습니다:", error);
      setError(true);
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
                {allImages.map((img, idx) => (
                  <div className="oneImg" key={idx} onClick={() => handleImageClick(idx)}>
                    <img src={URL.createObjectURL(img)} alt="New Preview" className="addedImg" />
                    <div className="plus-icon">
                      <img src={plusIcon} alt="plus" />
                    </div>
                  </div>
                ))}
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
                fontSize: "14px", // 가독성을 위해 적절한 크기 설정
                overflow: "hidden", // 스크롤 숨기기
              }}
            />
          </div>
          {alertmem && (
            <div className="alert-mem">
              <img src={MemAlert} alt="alert" />
              필수 입력 항목을 모두 작성해주세요.
            </div>
          )}
        </div>

        <button className="memory-btn" onClick={handleSubmit}>
          수정 완료
        </button>
      </div>
    </div>
  );
};

export default EditPost;
