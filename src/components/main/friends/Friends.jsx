import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../section/Header";
import Nav from "../section/Nav";
import "../../../assets/scss/components/friends.scss";
import moon from "../../../assets/img/moon.svg";
import friends1 from "../../../assets/img/friends-1.svg";
import friends2 from "../../../assets/img/friends-2.svg";
import friends3 from "../../../assets/img/friends-3.svg";
import friends4 from "../../../assets/img/friends-4.svg";
import newFriends from "../../../assets/img/new-friends.svg";
import postImg1 from "../../../assets/img/f-post-sample1.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";
import memory from "../../../assets/img/friends/memory.svg";

const Friends = () => {
  const navigate = useNavigate();

  const handelMemory = () => {
    navigate("/friends/newpost");
  };
  return (
    <div className="main-wrap">
      <Header></Header>
      <Nav></Nav>
      <div className="main-container">
        <div className="main-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              <div className="moon-pro">
                <img src={moon} className="moon-img"></img>
                <p>달이</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends1} className="friends-img"></img>
                <p>미아</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends2} className="friends-img"></img>
                <p>밤이</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends3} className="friends-img"></img>
                <p>로이</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends4} className="friends-img"></img>
                <p>초코</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends4} className="friends-img"></img>
                <p>초코</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends4} className="friends-img"></img>
                <p>초코</p>
              </div>
            </div>
            <div className="new-friends-cnt">
              <img src={newFriends}></img>
              <button>다른 친구들</button>
            </div>
          </div>
        </div>
        <div className="pro-cnt">
          <div className="pro-img-cnt">
            <img src={moon}></img>
            <div className="pro-cnt">
              <h4>달이</h4>
              <div className="pro-p-cnt">
                <p id="animal">고양이</p>
                <p id="birth-date">생일</p>
                <p id="star-date">별이 된 날</p>
              </div>
            </div>
          </div>
        </div>
        <div className="post-cnt">
          <h4>10월이 되니 생각나는 달이의 생일</h4>
          <p>10월이면 곧 그리운 달이의 생일이 다가와요. 생일에 함께 보냈던 시간들을 되돌아보니 달이가 더 그리워지는 하루네요.</p>
          <div className="post-img-cnt">
            <img src={postImg1}></img>
            <img src={postImg1}></img>
          </div>
          <div className="post-icons-cnt">
            <div className="post-icons">
              <img src={postIcon1}></img>
              <img src={postIcon2}></img>
              <img src={postIcon3}></img>
            </div>
            <p>날짜</p>
          </div>
        </div>
        <img src={memory} className="memory-fixed" onClick={handelMemory}></img>
      </div>
    </div>
  );
};

export default Friends;
