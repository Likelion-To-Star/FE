import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main/Main.jsx";
import Friends from "./components/main/friends/Friends.jsx"; 
import Community from "./components/main/community/Community.jsx"; // 커뮤니티 관련 컴포넌트
import Stars from "./components/main/toStar/Stars.jsx"; // 별이에게 관련 컴포넌트
import './assets/scss/styles.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/community' element={<Community />} />
        <Route path='/stars' element={<Stars />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

