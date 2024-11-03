import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/main/Main.jsx";
import MkCom from "./components/main/community/MkCom.jsx";
import EnterCom from "./components/main/community/EnterCom.jsx";
import ChangeCom from "./components/main/community/ChangeCom.jsx";
import EditCom from "./components/main/community/EditCom.jsx";
import Letter from "./components/main/toStar/Letter.jsx";
import FinLoad from "./components/main/toStar/FinLoad.jsx";
import ToStar from "./components/main/toStar/ToStar.jsx";
import FromStar from "./components/main/toStar/FromStar.jsx";
import Chatting from "./components/main/community/Chatting.jsx";
import Friends from "./components/main/friends/Friends.jsx";
import Community from "./components/main/community/Community.jsx";
import Stars from "./components/main/toStar/Stars.jsx";
import Login from "./components/main/login/Login.jsx";
import SignUp from "./components/main/login/SignUp.jsx";
import Agree1 from "./components/main/login/Agree1.jsx";
import Agree2 from "./components/main/login/Agree2.jsx";
import SignUpNext from "./components/main/login/SignUpNext.jsx";
import SignUpGo from "./components/main/login/SignUpGo.jsx";
import Mypage from "./components/main/section/Mypage.jsx";
import NewPost from "./components/main/friends/NewPost.jsx";
import FriendsSearch from "./components/main/friends/Friends-search.jsx";

import "./assets/scss/styles.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 상태를 true로 변경
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 여부에 따른 메인 경로 */}
        <Route path="/" element={isLoggedIn ? <Main /> : <Navigate to="/login" />} />

        {/* 로그인 페이지 및 회원가입 관련 페이지 */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-agree1" element={<Agree1 />} />
        <Route path="/signup-agree2" element={<Agree2 />} />
        <Route path="/signup-next" element={<SignUpNext />} />
        <Route path="/signup-go" element={<SignUpGo />} />

        {/* 로그인 후에만 접근 가능한 경로들 */}
        <Route path="/main/*" element={isLoggedIn ? <Main /> : <Navigate to="/login" />}>
          <Route path="community" element={<Community />} />
          <Route path="community/mkcom" element={<MkCom />} />
          <Route path="community/editcom" element={<EditCom />} />
          <Route path="community/entercom" element={<EnterCom />} />
          <Route path="community/changecom" element={<ChangeCom />} />
          <Route path="community/chatting" element={<Chatting />} />
          <Route path="friends" element={<Friends />} />
          <Route path="stars" element={<Stars />} />
        </Route>

        {/* 별 관련 페이지 */}
        <Route path="/stars/letter" element={isLoggedIn ? <Letter /> : <Navigate to="/login" />} />
        <Route path="/stars/finload" element={isLoggedIn ? <FinLoad /> : <Navigate to="/login" />} />
        <Route path="/stars/tostar" element={isLoggedIn ? <ToStar /> : <Navigate to="/login" />} />
        <Route path="/stars/fromstar" element={isLoggedIn ? <FromStar /> : <Navigate to="/login" />} />

        {/* 친구 및 커뮤니티 페이지 */}
        <Route path="/friends" element={isLoggedIn ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/friends/newpost" element={isLoggedIn ? <NewPost /> : <Navigate to="/login" />} />
        <Route path="/friends/frinedsSearch" element={isLoggedIn ? <FriendsSearch /> : <Navigate to="/login" />} />
        <Route path="/community" element={isLoggedIn ? <Community /> : <Navigate to="/login" />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={isLoggedIn ? <Mypage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
