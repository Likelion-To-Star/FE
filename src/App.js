import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/main/Main.jsx";
import MkCom from "./components/main/community/MkCom.jsx";
import EnterCom from "./components/main/community/EnterCom.jsx";
import ChangeCom from "./components/main/community/ChangeCom.jsx";
import EditCom from "./components/main/community/EditCom.jsx";
import Letter from "./components/main/toStar/Letter.jsx";
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
import MypageEdit from "./components/main/section/MypageEdit.jsx";
import EditPost from "./components/main/friends/EditPost.jsx";
import "./assets/scss/styles.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - loginTime;
      return timeDiff <= 24 * 60 * 60 * 1000; // 24시간이 지나지 않았을 경우 true 반환
    }
    return false;
  });

  useEffect(() => {
    // 로그인 여부를 정기적으로 확인하여 만료된 세션을 감지할 수도 있음
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - loginTime;
        if (timeDiff > 24 * 60 * 60 * 1000) {
          setIsLoggedIn(false);
          localStorage.removeItem("loginTime");
        }
      }
    }, 60000); // 1분마다 확인
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    const loginTime = new Date().getTime();
    localStorage.setItem("loginTime", loginTime);
    setIsLoggedIn(true);
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

        {/* 메인 경로 */}
        <Route path="/main/*" element={<Main />}>
          <Route path="community" element={isLoggedIn ? <Community /> : <Navigate to="/login" />} />
          <Route path="community/mkcom" element={<MkCom />} />
          <Route path="community/editcom" element={<EditCom />} />
          <Route path="community/entercom" element={<EnterCom />} />
          <Route path="community/changecom" element={<ChangeCom />} />
          <Route path="community/chatting" element={<Chatting />} />
          <Route path="friends" element={<Friends />} />
          <Route path="stars" element={<Stars />} />
        </Route>

        <Route path="/friends" element={isLoggedIn ? <Friends /> : <Navigate to="/login" />} />
        <Route path="/friends/editpost/:articleId" element={isLoggedIn ? <EditPost /> : <Navigate to="/login" />} />
        <Route path="/friendsSearch" element={isLoggedIn ? <FriendsSearch /> : <Navigate to="/login" />} />
        <Route path="/friends/newpost" element={isLoggedIn ? <NewPost /> : <Navigate to="/login" />} />
        <Route path="/mypage" element={isLoggedIn ? <Mypage /> : <Navigate to="/login" />} />
        <Route path="/mypage/mypageEdit" element={isLoggedIn ? <MypageEdit /> : <Navigate to="/login" />} />

        <Route path="stars/letter" element={<Letter />} />
        <Route path="stars/tostar" element={<ToStar />} />
        <Route path="stars/fromstar" element={<FromStar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
