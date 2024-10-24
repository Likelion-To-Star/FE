import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main/Main.jsx";
import Friends from "./components/main/friends/Friends.jsx"; 
import Community from "./components/main/community/Community.jsx"; 
import Stars from "./components/main/toStar/Stars.jsx"; 
import './assets/scss/styles.scss';
import MkCom from "./components/main/community/MkCom.jsx";
import EnterCom from "./components/main/community/EnterCom.jsx";
import ChangeCom from "./components/main/community/ChangeCom.jsx";
import EditCom from "./components/main/community/EditCom.jsx";
import Letter from "./components/main/toStar/Letter.jsx";
import FinLoad from "./components/main/toStar/FinLoad.jsx";
import ToStar from "./components/main/toStar/ToStar.jsx";
import FromStar from "./components/main/toStar/FromStar.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 경로 */}
        <Route path='/main/*' element={<Main />} >
          {/* Main 내부 하위 라우팅 */}
          <Route path='community' element={<Community />} />
          <Route path='community/mkcom' element={<MkCom />} />
          <Route path='community/editcom' element={<EditCom/>} />
          <Route path='community/entercom' element={<EnterCom/>} />
          <Route path='community/changecom' element={<ChangeCom/>} />
          <Route path='friends' element={<Friends />} />
          <Route path='stars' element={<Stars />} />
        </Route>
        <Route path='stars/letter' element={<Letter />} />
        <Route path='stars/finload' element={<FinLoad />} />
        <Route path='stars/tostar' element={<ToStar />} />
        <Route path='stars/fromstar' element={<FromStar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

