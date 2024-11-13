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
  const { name, email, password } = location.state || {}; // SignUp 페이지에서 전달된 데이터 가져오기
  const [parentName, setParentName] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [starDate, setStarDate] = useState(null);
  const [profileImage, setProfileImage] = useState(mybabyimg);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

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

    if (!parentName) newErrors.parentName = "보호자 이름을 입력해주세요.";
    if (!selectedGender) newErrors.gender = "성별을 선택해주세요.";
    if (!selectedAnimal) newErrors.animal = "종류를 선택해주세요.";

    if (Object.keys(newErrors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("userName", name); // SignUp 페이지에서 전달된 이름
        formData.append("email", email); // SignUp 페이지에서 전달된 이메일
        formData.append("password", password); // SignUp 페이지에서 전달된 비밀번호
        formData.append("petName", parentName); // 보호자 이름
        formData.append("ownerName", parentName); // 주인 이름
        formData.append("pet_gender", selectedGender); // 성별
        formData.append("category", selectedAnimal); // 종류
        formData.append("birthDay", birthDate ? birthDate.toISOString().split("T")[0] : ""); // 생일을 YYYY-MM-DD 형식으로
        formData.append("starDay", starDate ? starDate.toISOString().split("T")[0] : ""); // 별이 된 날을 YYYY-MM-DD 형식으로
        if (fileInputRef.current.files[0]) {
          formData.append("image", fileInputRef.current.files[0]);
        }

        const response = await axios.post(`${BASE_URL}/api/user/join`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.isSuccess) {
          // userInfo를 localStorage에 저장
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email,
              userName: name,
              petName: parentName,
              profileImage,
            })
          );
          navigate("/login");
        } else {
          setErrors({ submit: response.data.message });
        }
      } catch (error) {
        const errorData = error.response?.data;
        setErrors({
          submit: errorData?.message || "회원가입 중 오류가 발생했습니다.",
          ...errorData?.result, // 유효성 검사 실패 메시지들
        });
        console.error("회원가입 중 오류:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-header">
          <img src={backbtn} onClick={() => navigate("/signup")} alt="Back" />
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
              {errors.petName && <div className="error-message">{errors.petName}</div>}
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
                  <option value="개구리">개구리</option>
                  <option value="거북이">거북이</option>
                  <option value="다람쥐">다람쥐</option>
                  <option value="도마뱀">도마뱀</option>
                  <option value="물고기">물고기</option>
                  <option value="뱀">뱀</option>
                  <option value="새">새</option>
                  <option value="소라게">소라게</option>
                  <option value="사슴벌레">사슴벌레</option>
                  <option value="토끼">토끼</option>
                  <option value="햄스터">햄스터</option>
                  <option value="기타 아이들">기타 아이들</option>
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
