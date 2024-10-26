import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Main from "./components/main/Main.jsx";
import Friends from "./components/main/friends/Friends.jsx";
import Community from "./components/main/community/Community.jsx"; // 커뮤니티 관련 컴포넌트
import Stars from "./components/main/toStar/Stars.jsx"; // 별이에게 관련 컴포넌트
import Login from "./components/main/login/Login.jsx"; // 로그인 페이지 컴포넌트
import "./assets/scss/styles.scss";
import SignUp from "./components/main/login/SignUp.jsx";
import Agree1 from "./components/main/login/Agree1.jsx";
import Agree2 from "./components/main/login/Agree2.jsx";
import SignUpNext from "./components/main/login/SignUpNext.jsx";
import SignUpGo from "./components/main/login/SignUpGo.jsx";
import Mypage from "./components/main/section/Mypage.jsx";
import NewPost from "./components/main/friends/NewPost.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 상태를 true로 변경
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 여부에 따른 라우팅 */}
        <Route path="/" element={isLoggedIn ? <Main /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-agree1" element={<Agree1 />} />
        <Route path="/signup-agree2" element={<Agree2 />} />
        <Route path="/signup-next" element={<SignUpNext />} />
        <Route path="/signup-go" element={<SignUpGo />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/friends" element={isLoggedIn ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/friends/newpost" element={isLoggedIn ? <NewPost /> : <Navigate to="/login" />} />
        <Route path="/community" element={isLoggedIn ? <Community /> : <Navigate to="/community" />} />
        <Route path="/stars" element={isLoggedIn ? <Stars /> : <Navigate to="/login" />} />
        <Route path="/mypage" element={isLoggedIn ? <Mypage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
