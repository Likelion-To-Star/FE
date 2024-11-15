import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../section/Header";
import Nav from "../section/Nav";
import "../../../assets/scss/components/mypage.scss";
import about1 from "../../../assets/img/mypage-about1.svg";
import about2 from "../../../assets/img/mypage-about2.svg";
import about3 from "../../../assets/img/mypage-about3.svg";
import more from "../../../assets/img/mypage-more.svg";

const Mypage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const savedUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const name = localStorage.getItem("userName") || savedUserInfo.userName || "";
    const email = localStorage.getItem("userEmail") || savedUserInfo.email || "";

    setUserInfo(savedUserInfo);
    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = () => {
    navigate("/mypage/mypageEdit", { state: userInfo });
  };

  const handleAgree = () => {
    navigate("/signup-agree1");
  };

  return (
    <div className="main-wrap">
      <div className="mypage-container">
        <div className="mypage-pro">
          <img src={userInfo.profileImage || "default-profile.png"} alt="Profile" />
          <div className="pro-info">
            <p>{userInfo.petName}와 함께</p>
            <h4>{userName}</h4>
            <span>{userEmail}</span>
          </div>
        </div>
        <div className="mypage-container2">
          <div className="mypage-about" onClick={handleEdit}>
            <img src={about1} alt="About Pet Info" />
            <p>우리 아이 정보 수정</p>
            <img src={more} alt="More" />
          </div>
          <div className="mypage-about" onClick={handleAgree}>
            <img src={about2} alt="Terms of Service" />
            <p>서비스 이용 약관</p>
            <img src={more} alt="More" style={{ marginLeft: "40px" }} />
          </div>
          <div className="mypage-about" onClick={handleLogout}>
            <img src={about3} alt="Logout" />
            <p>로그아웃</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
