import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "../../../assets/scss/components/signup.scss";
import backbtn from "../../../assets/img/signup-back-btn.svg";
import mybabyimg from "../../../assets/img/mybabyimg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const SignUpNext = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email, password } = location.state || {}; // 이전 페이지에서 받은 정보
  const [parentName, setParentName] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [starDate, setStarDate] = useState(null);
  const [profileImage, setProfileImage] = useState(mybabyimg);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  // 파일 변경 시 이미지 업데이트
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // 필수 필드 유효성 검사
    if (!parentName) newErrors.parentName = "보호자 이름을 입력해주세요.";
    if (!selectedGender) newErrors.gender = "성별을 선택해주세요.";
    if (!selectedAnimal) newErrors.animal = "종류를 선택해주세요.";

    if (Object.keys(newErrors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("userName", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("petName", parentName);
        formData.append("ownerName", parentName);
        formData.append("petGender", selectedGender);
        formData.append("category", selectedAnimal);
        formData.append("birthDay", birthDate ? birthDate.toISOString().split("T")[0] : "");
        formData.append("starDay", starDate ? starDate.toISOString().split("T")[0] : "");
        if (fileInputRef.current.files[0]) {
          formData.append("image", fileInputRef.current.files[0]);
        }

        // 회원가입 API 요청
        const response = await axios.post(`${BASE_URL}/api/user/join`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // 응답 확인 후 처리
        if (response.data.isSuccess) {
          navigate("/");
        } else {
          setErrors({ submit: response.data.message });
        }
      } catch (error) {
        setErrors({ submit: "회원가입 중 오류가 발생했습니다." });
        console.error("Error during signup:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-header">
          <img src={backbtn} onClick={() => navigate("/login")} alt="Back" />
          <h4>회원가입</h4>
        </div>
        <div className="signup-body">
          <form className="sign-form" onSubmit={handleSignup}>
            <div className="sign-header">
              <p>소중한 추억을 간직하기 위해</p>
              <p>사랑하는 아이에 대해 알려주세요.</p>
            </div>

            {/* 아이 사진 */}
            <div className="form-container">
              <div className="form-header">
                <h3>우리 아이 사진</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <div className="profile-img-cnt">
                <img src={profileImage} alt="Profile Avatar" className="profile-img" />
                <div className="edit-icon" onClick={handleIconClick}>
                  <FontAwesomeIcon icon={faCamera} size="lg" />
                </div>
              </div>
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

            {/* 아이 이름 */}
            <div className="form-container">
              <div className="form-header">
                <h3>우리 아이 이름</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input type="text" className="sign-input" placeholder="아이 이름" value={parentName} onChange={(e) => setParentName(e.target.value)} />
              {errors.parentName && <div className="error-message">{errors.parentName}</div>}
            </div>

            {/* 성별 */}
            <div className="form-container">
              <div className="form-header" style={{ display: "block" }}>
                <h3>성별</h3>
                <div className="fm-btn-container">
                  <div className="fm-btn">
                    <button type="button" className={selectedGender === "남자" ? "active" : ""} onClick={() => setSelectedGender("남자")}>
                      남자
                    </button>
                  </div>
                  <div className="fm-btn">
                    <button type="button" className={selectedGender === "여자" ? "active" : ""} onClick={() => setSelectedGender("여자")}>
                      여자
                    </button>
                  </div>
                </div>
              </div>
              {errors.gender && <div className="error-message">{errors.gender}</div>}
            </div>

            {/* 종류 */}
            <div className="form-container">
              <div className="form-group">
                <div className="form-header">
                  <h3>종류</h3>
                  <p>* 필수 입력 항목입니다.</p>
                </div>
                <select id="animal-select" value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)}>
                  <option value="">-- 선택하세요 --</option>
                  <option value="강아지">강아지</option>
                  <option value="고양이">고양이</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              {errors.animal && <div className="error-message">{errors.animal}</div>}
            </div>

            {/* 생일 선택 */}
            <div className="form-container">
              <div className="form-header">
                <h3>생일</h3>
              </div>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="yyyy/MM/dd"
                placeholderText="날짜를 선택하세요"
                className="date-picker"
              />
            </div>

            {/* 별이 된 날 선택 */}
            <div className="form-container">
              <div className="form-header">
                <h3>별이 된 날</h3>
              </div>
              <DatePicker
                selected={starDate}
                onChange={(date) => setStarDate(date)}
                dateFormat="yyyy/MM/dd"
                placeholderText="날짜를 선택하세요"
                className="date-picker"
              />
            </div>

            {/* 회원가입 완료 버튼 */}
            <button type="submit" className="signup-button">
              회원가입 완료
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpNext;
