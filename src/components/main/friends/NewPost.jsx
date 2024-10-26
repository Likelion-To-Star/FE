import React from "react";
import Header from "../section/Header";
import Nav from "../section/Nav";
import "../../../assets/scss/components/newpost.scss";
import moon from "../../../assets/img/moon.svg";
import newpostImg from "../../../assets/img/friends/newpost-img.svg";
const NewPost = () => {
  return (
    <div className="main-wrap">
      <Header></Header>
      <Nav></Nav>
      <div className="main-container" style={{ backgroundColor: "#FAF7FE" }}>
        <div className="new-cnt">
          <div className="new-img-plus">
            <div className="new-img-title">
              <h4>사진을 등록해주세요</h4>
              <p>* 사진은 0~5장까지 등록 가능합니다.</p>
            </div>
            <div className="imgs-cnt">
              <img src={newpostImg}></img>
              <img src={newpostImg}></img>
            </div>
          </div>
          <div className="new-text-cnt">
            <div className="new-text">
              <h4>추억명</h4>
              <p>* 필수 입력 항목입니다</p>
            </div>
            <input placeholder="추억의 이름을 작성해주세요."></input>
          </div>
          <div className="new-text-cnt">
            <div className="new-text">
              <h4>아이와의 추억</h4>
              <p>* 필수 입력 항목입니다. 추억은 300자 이내로 작성해주세요.</p>
            </div>
            <input placeholder="아이와의 추억을 작성해주세요."></input>
          </div>
        </div>
        <button className="memory-btn">추억 등록하기</button>
      </div>
    </div>
  );
};

export default NewPost;
