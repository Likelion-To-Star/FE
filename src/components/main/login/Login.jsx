import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../assets/scss/components/login.scss"; // SCSS import
import loginLogo from "../../../assets/img/login-logo.svg";
import mainLogo from "../../../assets/img/main-logo.svg";
import star from "../../../assets/img/star.svg";
import errorIcon from "../../../assets/img/error-icon.svg";

const Login = ({ onLogin }) => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("이메일과 비밀번호를 정확히 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, { email, password });
      const { accessToken, userName, petName, profileImage } = response.data.result;
      localStorage.setItem("petName",petName);
      localStorage.setItem("userName",userName);
      localStorage.setItem("userEmail",response.data.result.email);
      if (accessToken) {
        setErrorMessage("");
        localStorage.setItem("token", accessToken);
        localStorage.setItem("loginTime", new Date().getTime());

        // email과 userName을 userInfo에 추가하여 저장
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            email, // 로그인할 때 사용한 email
            userName, // 응답에서 받아온 userName
            petName,
            profileImage,
          })
        );

        onLogin(accessToken);
        navigate("/");
      } else {
        setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("이메일이나 비밀번호가 잘못되었습니다.");
    }
  };

  const handleSignUp = () => {
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

          <div className="button-wrapper">

          <button type="submit" className="login-button">
            로그인
            {errorMessage && (
            <div className="error-container" style={{ marginBottom: "5px", fontSize: "12px" }}>
              <img src={errorIcon} alt="Warning" className="error-icon" />
              <p className="error-message">{errorMessage}</p>
            </div>
          )}
          </button>
          </div>
        </form>
        <div className="login-footer">
          <p>
            아직 회원이 아니신가요? <span onClick={handleSignUp}>회원가입하기</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
