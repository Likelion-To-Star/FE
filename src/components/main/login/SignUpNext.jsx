import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../assets/scss/components/signup.scss"; // SCSS 파일 import
import backbtn from "../../../assets/img/signup-back-btn.svg";
import errorIcon from "../../../assets/img/error-icon.svg"; // 에러 아이콘 import
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 날짜 선택기 스타일
import mybabyimg from "../../../assets/img/mybabyimg.png"; // 기본 이미지 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(""); // 아이 이름 상태
  const [parentName, setParentName] = useState(""); // 보호자 이름 상태
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [errors, setErrors] = useState({}); // 에러 메시지 상태
  const [selectedGender, setSelectedGender] = useState(null); // 성별 선택 상태
  const [selectedAnimal, setSelectedAnimal] = useState(""); // 종류 선택 상태
  const [birthDate, setBirthDate] = useState(null); // 생일 상태
  const [starDate, setStarDate] = useState(null); // 별이 된 날 상태
  const [profileImage, setProfileImage] = useState(mybabyimg); // 프로필 이미지 상태
  const fileInputRef = useRef(null); // 파일 입력 참조

  // 이미지 로컬 스토리지에서 불러오기
  useEffect(() => {
    const storedImage = localStorage.getItem("mybabyimg");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, [location.search]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // 파일을 읽어서 이미지 상태 업데이트
        localStorage.setItem("mybabyimg", reader.result); // 로컬 스토리지에 저장
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // 파일 입력 열기
  };

  const handleSignupGo = () => {
    navigate("/signup-go");
  };

  const handleDateChange = (date) => setBirthDate(date);
  const handleDateChange2 = (date) => setStarDate(date);
  const handleAnimalChange = (event) => setSelectedAnimal(event.target.value);

  const handleNext = (e) => {
    e.preventDefault(); // 페이지 리로드 방지

    // 에러 상태 초기화
    setErrors({});

    // 유효성 검사
    let newErrors = {};
    if (!name) newErrors.name = "아이 이름을 입력해주세요.";
    if (!parentName) newErrors.parentName = "보호자 이름을 입력해주세요.";
    if (!email) newErrors.email = "올바른 이메일 형식이 아닙니다.";
    if (!password) newErrors.password = "비밀번호는 8~12자리여야 합니다.";
    if (password !== confirmPassword) newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    // 에러가 없으면 다음 단계로 진행
    if (Object.keys(newErrors).length === 0) {
      navigate("/signup-next");
    } else {
      setErrors(newErrors); // 에러 상태 업데이트
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
          <form className="sign-form" onSubmit={handleNext}>
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
              <input type="text" className="sign-input" placeholder="아이 이름" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            {/* 보호자 이름 */}
            <div className="form-container">
              <div className="form-header">
                <h3>보호자 이름</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input type="text" className="sign-input" placeholder="보호자 이름" value={parentName} onChange={(e) => setParentName(e.target.value)} />
              {errors.parentName && <div className="error-message">{errors.parentName}</div>}
            </div>

            {/* 성별 */}
            {/* 성별 */}
            <div className="form-container">
              <div className="form-header" style={{ display: "block" }}>
                <h3>성별</h3>
                <div className="fm-btn-container">
                  <div className="fm-btn">
                    <button className={selectedGender === "남자" ? "active" : ""} onClick={() => setSelectedGender("남자")}>
                      남자
                    </button>
                  </div>
                  <div className="fm-btn">
                    <button className={selectedGender === "여자" ? "active" : ""} onClick={() => setSelectedGender("여자")}>
                      여자
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 종류 */}
            <div className="form-container">
              <div className="form-group">
                <div className="form-header">
                  <h3>종류</h3>
                  <p>* 필수 입력 항목입니다.</p>
                </div>
                <select id="animal-select" value={selectedAnimal} onChange={handleAnimalChange}>
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
                  <option value="기타 친구들">기타 친구들</option>
                </select>
              </div>
            </div>

            {/* 생일 선택 */}
            <div className="form-container">
              <div className="form-header">
                <h3>생일</h3>
              </div>
              <div className="date-btn">
                <DatePicker
                  id="birthday-picker"
                  selected={birthDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd" // 날짜 형식 설정
                  placeholderText="날짜를 선택하세요"
                  isClearable // 클리어 버튼 추가
                  showPopperArrow={false} // 화살표 숨기기
                  className="date-picker" // 커스텀 클래스 이름
                />
              </div>
            </div>

            {/* 별이 된 날 */}
            <div className="form-container">
              <div className="form-header">
                <h3>별이 된 날</h3>
              </div>
              <div className="date-btn">
                <DatePicker
                  id="birthday-picker"
                  selected={starDate}
                  onChange={handleDateChange2}
                  dateFormat="yyyy/MM/dd" // 날짜 형식 설정
                  placeholderText="날짜를 선택하세요"
                  isClearable // 클리어 버튼 추가
                  showPopperArrow={false} // 화살표 숨기기
                  className="date-picker" // 커스텀 클래스 이름
                />
              </div>
            </div>

            {/* 다음 버튼 */}
            <button type="submit" className="signup-button" onClick={handleSignupGo}>
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
