import React from "react";
import Header from "../section/Header";
import Nav from "../section/Nav";
import moon from "../../../assets/img/moon.svg";
import "../../../assets/scss/components/mypage.scss";
import about1 from "../../../assets/img/mypage-about1.svg";
import about2 from "../../../assets/img/mypage-about2.svg";
import about3 from "../../../assets/img/mypage-about3.svg";
import more from "../../../assets/img/mypage-more.svg";
const Mypage = () => {
  return (
    <div className="main-wrap">
      <Header />
      <Nav />
      <div className="mypage-container">
        <div className="mypage-pro">
          <img src={moon}></img>
          <div className="pro-info">
            <p>달이와 함께</p>
            <h4>김사자</h4>
            <span>likelion@example.com</span>
          </div>
        </div>
        <div className="mypage-container2">
          <div className="mypage-about">
            <img src={about1}></img>
            <p>우리 아이 정보 수정</p>
            <img src={more}></img>
          </div>
          <div className="mypage-about">
            <img src={about2}></img>
            <p>서비스 이용 약관</p>
            <img src={more} style={{ marginLeft: "40px" }}></img>
          </div>
          <div className="mypage-about">
            <img src={about3}></img>
            <p>로그아웃</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
