import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./section/Header";
import Nav from "./section/Nav";
import { Outlet } from "react-router-dom";
import mainImg from "../../assets/img/main-img.png";
import moon from "../../assets/img/moon.svg";
import friends1 from "../../assets/img/friends-1.svg";
import friends2 from "../../assets/img/friends-2.svg";
import friends3 from "../../assets/img/friends-3.svg";
import friends4 from "../../assets/img/friends-4.svg";

const Main = () => {
  const location = useLocation();
  
  return (
    <div className="main-wrap">
      <Header />
      <Nav />
      <Outlet />
      {location.pathname === "/main" && (
        <div className="main-container">
          <img className="main-img" src={mainImg} alt="Main Visual" />
          <div className="main-toStar">
            <p>TO. 달이에게</p>
            <button>마음 보내기</button>
          </div>
          <div className="main-starFriends">
            <p>달이의 별나라 친구들</p>
            <div className="friends-slide">
              <div className="friend-pro">
                <img src={friends1} alt="미아" />
                <p>미아</p>
              </div>
              <div className="friend-pro">
                <img src={friends2} alt="밤이" />
                <p>밤이</p>
              </div>
              <div className="friend-pro">
                <img src={friends3} alt="로이" />
                <p>로이</p>
              </div>
              <div className="friend-pro">
                <img src={friends4} alt="초코" />
                <p>초코</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
