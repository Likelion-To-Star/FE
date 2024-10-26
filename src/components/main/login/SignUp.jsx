import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/scss/components/signup.scss"; // SCSS 파일 import
import backbtn from "../../../assets/img/signup-back-btn.svg";
import errorIcon from "../../../assets/img/error-icon.svg"; // 에러 아이콘 import

const SignUp = () => {
  const navigate = useNavigate();
  const [isAgreedAll, setIsAgreedAll] = useState(false); // 약관 전체 동의 상태
  const [isAgreed1, setIsAgreed1] = useState(false); // 만 14세 이상 동의 상태
  const [isAgreed2, setIsAgreed2] = useState(false); // 개인정보 수집 동의 상태
  const [isAgreed3, setIsAgreed3] = useState(false); // 서비스 이용 약관 동의 상태
  const [isAgreed4, setIsAgreed4] = useState(false); // 서비스 이용 약관 동의 상태
  const [isAgreed5, setIsAgreed5] = useState(false); // 서비스 이용 약관 동의 상태
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // 에러 메시지 상태

  const handleLogin = () => {
    navigate("/login");
  };

  // 약관 전체 동의 및 개별 약관 동의 상태 관리
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;

    if (id === "terms") {
      setIsAgreedAll(checked);
      setIsAgreed1(checked);
      setIsAgreed2(checked);
      setIsAgreed3(checked);
      setIsAgreed4(checked);
      setIsAgreed5(checked);
    } else if (id === "terms-small-1") {
      setIsAgreed1(checked);
    } else if (id === "terms-small-2") {
      setIsAgreed2(checked);
    } else if (id === "terms-small-3") {
      setIsAgreed3(checked);
    } else if (id === "terms-small-4") {
      setIsAgreed4(checked);
    } else if (id === "terms-small-5") {
      setIsAgreed5(checked);
    }
  };

  // 개별 체크박스가 변경될 때 전체 동의 상태도 업데이트
  React.useEffect(() => {
    if (isAgreed1 && isAgreed2 && isAgreed3 && isAgreed4 && isAgreed5) {
      setIsAgreedAll(true);
    } else {
      setIsAgreedAll(false);
    }
  }, [isAgreed1, isAgreed2, isAgreed3, isAgreed4, isAgreed5]);

  const handleNext = (e) => {
    e.preventDefault(); // 페이지 리로드 방지

    // 에러 상태 초기화
    setErrors({});

    // 유효성 검사
    let newErrors = {};
    if (!name) {
      newErrors.name = "이름을 입력해주세요.";
    }
    if (!email) {
      newErrors.email = "올바른 이메일 형식이 아닙니다. 이메일을 입력해주세요.";
    }
    if (!password) {
      newErrors.password = "비밀번호는 영문/숫자/특수문자를 포함한 8~12자리여야 합니다. 비밀번호를 입력해주세요.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 에러가 없으면 다음 단계로 진행
    if (Object.keys(newErrors).length === 0) {
      console.log("이름:", name, "이메일:", email, "비밀번호:", password);
      // 다음 단계로 이동 (여기서 페이지 이동을 수행)
      navigate("/signup-next");
    } else {
      setErrors(newErrors); // 에러 상태 업데이트
    }
  };

  // 모든 필수 입력값 및 동의 사항 확인
  const isNextButtonEnabled = name && email && password && confirmPassword === password && isAgreed1 && isAgreed2 && isAgreed3 && isAgreed4 && isAgreed5;

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-header">
          <img src={backbtn} onClick={handleLogin} alt="Back" />
          <h4>회원가입</h4>
        </div>
        <div className="signup-body">
          <form className="sign-form" onSubmit={handleNext}>
            <div className="sign-header">
              <p>안녕하세요:)</p>
              <p>보호자님에 대해 알려주세요.</p>
            </div>
            <div className="form-container">
              <div className="form-header">
                <h3>이름</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input type="text" className="sign-input" placeholder="김사자" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name ? (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.name}</p>
                </div>
              ) : (
                <div style={{ marginBottom: "23px" }}></div>
              )}
            </div>

            <div className="form-container">
              <div className="form-header">
                <h3>이메일</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input type="text" className="sign-input" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email ? (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.email}</p>
                </div>
              ) : (
                <div style={{ marginBottom: "25px" }}></div>
              )}
            </div>

            <div className="form-container">
              <div className="form-header">
                <h3>비밀번호</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input type="password" className="sign-input" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password ? (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.password}</p>
                </div>
              ) : (
                <div style={{ marginBottom: "23px" }}></div>
              )}
            </div>

            <div className="form-container">
              <div className="form-header">
                <h3>비밀번호 확인</h3>
                <p>* 필수 입력 항목입니다.</p>
              </div>
              <input
                type="password"
                className="sign-input"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword ? (
                <div className="error-container">
                  <img src={errorIcon} alt="Warning" className="error-icon" />
                  <p className="error-message">{errors.confirmPassword}</p>
                </div>
              ) : (
                <div style={{ marginBottom: "23px" }}></div>
              )}
            </div>

            {/* 체크박스 추가 */}
            <div className="form-container checkbox-big">
              <input type="checkbox" id="terms" checked={isAgreedAll} onChange={handleCheckboxChange} />
              <label style={{ marginLeft: "8px", fontSize: "17px", fontFamily: "Pretendard-SemiBold" }}>약관 전체 동의</label>
            </div>

            <div className="form-container checkbox-small">
              <input type="checkbox" id="terms-small-1" checked={isAgreed1} onChange={handleCheckboxChange} />
              <label style={{ marginLeft: "8px", fontSize: "12px", fontFamily: "Pretendard-SemiBold" }}>[필수] 만 14세 이상 서비스 이용 동의</label>
            </div>

            <div className="form-container checkbox-small">
              <input type="checkbox" id="terms-small-2" checked={isAgreed2} onChange={handleCheckboxChange} />
              <label style={{ marginLeft: "8px", fontSize: "12px", fontFamily: "Pretendard-SemiBold" }}>[필수] 개인정보 수집/이용 동의</label>
              <p style={{ marginLeft: "155px" }} onClick={() => navigate("/signup-agree1")}>
                보기
              </p>
            </div>

            <div className="form-container checkbox-small">
              <input type="checkbox" id="terms-small-3" checked={isAgreed3} onChange={handleCheckboxChange} />
              <label style={{ marginLeft: "8px", fontSize: "12px", fontFamily: "Pretendard-SemiBold" }}>[필수] 서비스 이용 약관</label>
              <p style={{ marginLeft: "190px" }} onClick={() => navigate("/signup-agree2")}>
                보기
              </p>
            </div>

            <div className="form-container checkbox-small">
              <input type="checkbox" id="terms-small-4" checked={isAgreed4} onChange={handleCheckboxChange} />
              <label style={{ marginLeft: "8px", fontSize: "12px", fontFamily: "Pretendard-SemiBold" }}>[선택] 광고성 정보 수신 동의</label>
            </div>

            <div className="form-container checkbox-small">
              <input type="checkbox" id="terms-small-5" checked={isAgreed5} onChange={handleCheckboxChange} />
              <label style={{ marginLeft: "8px", fontSize: "12px", fontFamily: "Pretendard-SemiBold" }}>[선택]마케팅 정보/이용 동의</label>
            </div>

            <button type="submit" className="signup-button" disabled={!isNextButtonEnabled}>
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
