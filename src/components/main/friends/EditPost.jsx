import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../section/Header";
import Nav from "../section/Nav";
import newpostImg from "../../../assets/img/friends/newpost-img.svg";
import "../../../assets/scss/components/newpost.scss";

const EditPost = () => {
  const { articleId } = useParams(); // articleId를 경로에서 받아옴
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    // 기존 게시물 데이터 불러오기
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/articles/others${articleId}`, {});
        const { title, content, images } = response.data.result;
        setTitle(title);
        setContent(content);
        setExistingImages(images || []);
      } catch (error) {
        console.error("게시물 불러오기 오류:", error);
        alert("게시물 데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchPost();
  }, [articleId, BASE_URL]);

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + images.length + existingImages.length > 5) {
      alert("최대 5개의 이미지까지 업로드할 수 있습니다.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

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
      await axios.put(`${BASE_URL}/api/articles/${articleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          headers: { Authorization: `Bearer ${token}` },
        },
      });

      alert("게시물이 성공적으로 수정되었습니다.");
      navigate("/friends"); // 수정 완료 후 게시물 목록 페이지로 이동
    } catch (error) {
      console.error("게시물 수정 중 오류가 발생했습니다:", error);
      alert("게시물 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="main-wrap">
      <div className="main-container" style={{ backgroundColor: "#FAF7FE" }}>
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
                {existingImages.map((img, idx) => (
                  <img key={idx} src={img.url} alt="Existing Preview" style={{ width: "77px", marginRight: "10px" }} />
                ))}
                {images.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="New Preview" style={{ width: "77px", marginRight: "10px" }} />
                ))}
              </div>
            </div>
          </div>

          {/* 제목 / 내용 */}
          <div className="new-text-cnt">
            <div className="new-text">
              <h4>제목</h4>
              <p>* 필수 입력 항목입니다</p>
            </div>
            <input placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="new-text-cnt">
            <div className="new-text">
              <h4>내용</h4>
              <p>* 필수 입력 항목입니다. 최대 300자 입력 가능합니다.</p>
            </div>
            <input placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </div>
        <button className="memory-btn" onClick={handleSubmit}>
          수정 완료
        </button>
      </div>
    </div>
  );
};

export default EditPost;
