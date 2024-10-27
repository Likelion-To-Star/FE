import React from 'react'
import Logo from '../../../assets/img/upper-logo.svg'
import BackBtn from '../../../assets/img/back-btn.svg';
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import MypageLogo from "../../../assets/img/mypage.svg"; // MyPage 로고 import
import MypageLogo2 from "../../../assets/img/mypage2.svg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인

  // 페이지에 따라 로고 변경
  const currentLogo = location.pathname === "/mypage" ? MypageLogo2 : MypageLogo;

  const handleMypage = () => {
    navigate("/mypage");
  };

  return (
    <div className='header-wrap'>
      
        <div className='hd-title'>
         {/* 경로에 따라 로고를 다르게 표시 */}
         <img className="logo" src={Logo} alt="logo" />
        <button>
          <img src={currentLogo} alt="Tomypage" onClick={handleMypage} />
        </button>
      </div>
        </div>
    </div>
  );
};

export default Header;
