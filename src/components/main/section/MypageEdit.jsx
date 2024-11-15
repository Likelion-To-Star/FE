import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assets/scss/components/signup.scss";
import backbtn from "../../../assets/img/signup-back-btn.svg";
import mybabyimg from "../../../assets/img/mybabyimg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import errorIcon from "../../../assets/img/error-icon.svg"; 

const MypageEdit = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [parentName, setParentName] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [starDate, setStarDate] = useState(null);
  const [profileImage, setProfileImage] = useState(mybabyimg);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const storedToken = localStorage.getItem("token");
  const [childName, setChildName] = useState("");
  useEffect(() => {
    const fetchLoginInfo = async () => {
      if (!token) {
        console.error("토큰이 누락되었습니다.");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/user/login`, {
          headers: { Authorization: token },
        });
        const loginData = response.data.result;

        // 로컬스토리지에 userName, profileImage 저장
        const existingUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        const updatedUserInfo = {
          ...existingUserInfo,
          userName: loginData.userName,
          profileImage: loginData.profileImage,
          email: loginData.email,
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      } catch (error) {
        console.error("Error fetching login info:", error);
      }
    };

    fetchLoginInfo();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!storedToken) {
        console.error("토큰이 누락되었습니다.");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/user/info`, {
          headers: { Authorization: token },
        });
        const userInfo = response.data.result;

        // 로컬스토리지에 추가 정보 업데이트
        const existingUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        const updatedUserInfo = { ...existingUserInfo, ...userInfo };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

        // 상태 업데이트
        setParentName(userInfo.petName || "");
        setSelectedGender(userInfo.petGender || "");
        setSelectedAnimal(userInfo.category || "");
        setBirthDate(userInfo.birthDay ? new Date(userInfo.birthDay) : null);
        setStarDate(userInfo.starDay ? new Date(userInfo.starDay) : null);
        setProfileImage(userInfo.profileImage || mybabyimg);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    //utc이 iso로 바뀌어야
const toLocalISOString = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split("T")[0];
};

    if (!parentName) newErrors.parentName = "보호자 이름을 입력해주세요.";
    if (!selectedGender) newErrors.gender = "성별을 선택해주세요.";
    if (!selectedAnimal) newErrors.animal = "종류를 선택해주세요.";
    if (Object.keys(newErrors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("petName", childName);
        formData.append("ownerName", parentName);
        formData.append("petGender", selectedGender);
        formData.append("category", selectedAnimal);
        formData.append("birthDay", birthDate ? toLocalISOString(birthDate) : "");
        formData.append("starDay", starDate ? toLocalISOString(starDate) : "");
        if (fileInputRef.current.files[0]) {
          formData.append("image", fileInputRef.current.files[0]);
        }

        const response = await axios.put(`${BASE_URL}/api/user/edit`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        });

        if (response.data.isSuccess) {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...JSON.parse(localStorage.getItem("userInfo")),
              petName: parentName,
              profileImage,
            })
          );
          navigate("/");
        } else {
          setErrors({ submit: response.data.message });
        }
      } catch (error) {
        setErrors({ submit: "저장 중 오류가 발생했습니다." });
        console.error("Error during saving:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-wrap-wrap">
    <div className="signup-background">
    <div className="bor"></div>
      <div className="signup-container">
        <div className="signup-header">
          <img src={backbtn} onClick={() => navigate("/mypage")} alt="Back" />
          <h4>우리 아이</h4>
        </div>
        <div className="signupNext-body">
          <form className="sign-form" onSubmit={handleSave}>
            <div className="sign-header">
              <p>소중한 추억을 간직하기 위해</p>
              <p>사랑하는 아이에 대해 알려주세요.</p>
            </div>

           {/* 아이 사진 */}
           <div className="signNext-container">
              <div className="form-header">
                <h3>우리 아이 사진</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <div className="profile-img-cnt" onClick={handleIconClick}>
                <img
                  src={profileImage}
                  alt="Profile Avatar"
                  className="profile-img"
                  style={{
                    borderRadius: profileImage === mybabyimg ? "0" : "50%", // 기본 이미지일 때만 둥근 모서리 적용
                  }}
                />
              </div>
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

            {/* 아이 이름 */}
            <div className="signNext-container">
              <div className="form-header">
                <h3>우리 아이 이름</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input
                type="text"
                className="sign-input"
                placeholder="아이의 이름을 작성해주세요."
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
              {errors.petName && (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.petName}</p>
                </div>
              )}
            </div>

            {/*아이 보호자 이름 */}
            <div className="signNext-container">
              <div className="form-header">
                <h3>아이에게 보호자님의 이름</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input
                type="text"
                className="sign-input"
                placeholder="아이에게 보호자님의 이름을 작성해주세요."
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
              {errors.ownerName && (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.ownerName}</p>
                </div>
              )}
            </div>

            {/* 성별 */}
            <div className="signNext-container">
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
            </div>

            {/* 종류 */}
            <div className="signNext-container">
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
              {errors.animal && (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.animal}</p>
                </div>
              )}
            </div>

            {/* 생일 선택 */}
            <div className="signNext-container">
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
            <div className="signNext-container">
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

            <button type="submit" className="signup-button">
              저장
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MypageEdit;
