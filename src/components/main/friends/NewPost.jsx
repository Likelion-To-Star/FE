// NewPost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../section/Header";
import Nav from "../section/Nav";
import newpostImg from "../../../assets/img/friends/newpost-img.svg";
import "../../../assets/scss/components/newpost.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // 이미지 선택 핸들러
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    const newPost = { title, description, images };
    navigate("/friends", { state: { newPost } });
  };

  return (
    <div className="main-wrap">
      <Header />
      <Nav />
      <div className="main-container" style={{ backgroundColor: "#FAF7FE" }}>
        <div className="new-cnt">
          <div className="new-img-plus">
            <div className="new-img-title">
              <h4>사진을 등록해주세요</h4>
              <p>* 사진은 0~5장까지 등록 가능합니다.</p>
            </div>
            {/* 이미지 추가 */}
            <div className="imgs-cnt">
              <label htmlFor="file-upload" className="custom-file-upload">
                <img src={newpostImg} alt="Upload" />
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*" // 이미지 파일만 선택하도록 제한
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div className="preview-images">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)} // 선택된 이미지의 URL 생성
                    alt="Preview"
                    style={{ width: "77px", marginRight: "10px" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 추억명 / 아이와의 추억 */}
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
            <input placeholder="아이와의 추억을 작성해주세요." value={description} onChange={(e) => setDescription(e.target.value)} />
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
