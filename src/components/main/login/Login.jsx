import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/scss/components/login.scss"; // SCSS 파일 import
import loginLogo from "../../../assets/img/login-logo.svg";
import mainLogo from "../../../assets/img/main-logo.svg";
import star from "../../../assets/img/star.svg";
import errorIcon from "../../../assets/img/error-icon.svg";
import axios from 'axios';

const Login = ({ onLogin }) => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검증
    if (email.trim() === "" && password.trim() === "") {
      setErrorMessage("이메일과 비밀번호를 정확히 입력해주세요.");
      return;
    } else if (email.trim() === "") {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    } else if (password.trim() === "") {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, { email, password });
      const token = response.data.result.accessToken; 

      if (token) {
        setErrorMessage(""); // 에러 메시지 초기화
        localStorage.setItem("token", token);
        localStorage.setItem("loginTime", new Date().getTime());
        onLogin(token); // 로그인 성공 시 onLogin 호출 및 토큰 전달
        navigate("/"); // 메인 페이지로 이동
      } else {
        setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("이메일이나 비밀번호가 잘못되었습니다.");
    }
  };

  const handleSingUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <img src={star} className="star" alt="star" />
        <div className="login-logo">
          <p>별나라에 보내는 나의 소중한 마음</p>
          <img src={loginLogo} alt="Login Logo" className="logo-svg" />
        </div>
        <img src={mainLogo} alt="main logo" className="main-logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input type="text" className="login-input" placeholder="이메일" value={email} onChange={(e) => setUserEmail(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <input type="password" className="pwd-input" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {/* 에러 메시지를 로그인 버튼 바로 위에 출력 */}
          {errorMessage ? (
            <div className="error-container" style={{ marginBottom: "5px" }}>
              <img src={errorIcon} alt="Warning" className="error-icon" />
              <p className="error-message">{errorMessage}</p>
            </div>
          ) : (
            <div style={{ marginBottom: "35px" }}></div>
          )}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="login-footer">
          <p>
            아직 회원이 아니신가요? <span onClick={handleSingUp}>회원가입하기</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
