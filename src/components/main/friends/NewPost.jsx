import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../section/Header";
import Nav from "../section/Nav";
import newpostImg from "../../../assets/img/friends/newpost-img.svg";
import "../../../assets/scss/components/newpost.scss";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // 이미지 선택 핸들러
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + images.length > 5) {
      alert("최대 5개의 이미지까지 업로드할 수 있습니다.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((image) => formData.append("images", image));

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
          Authorization: token, // Bearer 키워드 추가
        },
      });

      if (response.data.isSuccess) {
        const newPost = response.data.result; // 성공적인 응답에서 새로운 게시물 정보 가져오기
        navigate("/main/friends", { state: { newPost } });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("게시물 등록 중 오류가 발생했습니다:", error);
      if (error.response) {
        console.error("서버 응답:", error.response.data);
        alert(`게시물 등록 중 오류가 발생했습니다: ${error.response.data.message}`);
      } else {
        alert("네트워크 오류 또는 서버에 문제가 발생했습니다.");
      }
    }
  };

  return (
    <div className="newpost-wrap">
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
              <input id="file-upload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              <div className="preview-images">
                {images.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="Preview" style={{ width: "77px", marginRight: "10px" }} />
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
            <input placeholder="아이와의 추억을 작성해주세요." value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </div>
        <button className="memory-btn" onClick={handleSubmit}>
          추억 등록하기
        </button>
      </div>
    </div>
  );
};

export default NewPost;
