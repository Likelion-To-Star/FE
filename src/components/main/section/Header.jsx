import React from "react";
import Logo from "../../../assets/img/upper-logo.svg";
import BackBtn from "../../../assets/img/back-btn.svg";
import { useNavigate, useLocation } from "react-router-dom";
import MypageLogo from "../../../assets/img/mypage.svg";
import MypageLogo2 from "../../../assets/img/mypage2.svg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLogo = location.pathname === "/mypage" ? MypageLogo2 : MypageLogo;

  const handleMypage = () => {
    navigate("/main/mypage");
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleHome = () => {
    navigate("/"); // 이전 페이지로 이동
  };

  return (
    <div className="header-wrap">
      <div className="hd-title">
        <button className="bk" onClick={handleBack}>
          <img src={BackBtn} alt="뒤로가기" className="back-btn" />
        </button>
        <img className="logo" src={Logo} alt="logo" onClick={handleHome} />
        <button className="my" onClick={handleMypage}>
          <img src={currentLogo} alt="Tomypage" />
        </button>
      </div>
    </div>
  );
};

export default Header;
