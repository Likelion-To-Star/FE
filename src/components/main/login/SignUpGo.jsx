import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/scss/components/signupGo.scss"; // SCSS 파일 import
import mainLogo from "../../../assets/img/main-logo.svg";
import toStar from "../../../assets/img/toStar.svg";

const SignUpGo = () => {
  const navigate = useNavigate();

  const handlenext = () => {
    navigate("/");
  };

  return (
    <div className="go-background">
      <div className="go-container">
        <img src={mainLogo} className="mainlogo-img"></img>
        <p>아이와의 소중한 추억을 </p>
        <div className="text-cnt">
          <img src={toStar} className="toStar-img"></img>
          <p>와</p>
        </div>
        <p>함께해 주셔서 감사합니다.</p>
        <div className="text-cnt">
          <img src={toStar} className="toStar-img"></img>
          <p>가 보호자님의 마음에</p>
        </div>
        <p>작은 위안이 되는 공간이기를 바랍니다.</p>
        <button type="submit" className="go-button" onClick={handlenext}>
          별이에게 시작하기
        </button>
      </div>
    </div>
  );
};

export default SignUpGo;
