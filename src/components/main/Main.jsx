import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./section/Header";
import Nav from "./section/Nav";
import { Outlet } from "react-router-dom";
import axios from "axios";
import mainImg from "../../assets/img/main-img.png";
import "../../assets/scss/components/_community.scss";

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const [communityPreviews, setCommunityPreviews] = useState([]);
  const [friends, setFriends] = useState([]); // 친구 상태 추가

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/user/info`, {
          headers: { Authorization: token },
        });

        if (response.data && response.data.isSuccess) {
          const fetchedUserInfo = response.data.result;
          setUserInfo(fetchedUserInfo);
          localStorage.setItem("userInfo", JSON.stringify(fetchedUserInfo));
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
      }
    };

    const fetchCommunityPreviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/community/preview/random`, {
          headers: { Authorization: token },
        });
        if (response.data && response.data.isSuccess) {
          setCommunityPreviews(response.data.result.slice(0, 3));
        }
      } catch (error) {
        console.error("커뮤니티 미리보기 가져오기 오류:", error);
      }
    };

    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/user/friend`, {
          headers: { Authorization: token },
        });
        if (response.data && response.data.isSuccess) {
          setFriends(response.data.result); // 친구 데이터 저장
        }
      } catch (error) {
        console.error("친구 정보 가져오기 오류:", error);
      }
    };

    fetchUserInfo();
    fetchCommunityPreviews();
    fetchFriends(); // 친구 정보 가져오기
  }, [BASE_URL]);

  const handleToCommunity = () => {
    navigate("/main/community");
  };

  const handleToStar = () => {
    navigate("/main/stars/");
  };

  return (
    <div className="main-wrap">
      <Header />
      <Nav />
      <Outlet />
      {location.pathname === "/" && (
        <div className="main-container">
          <img className="main-img" src={mainImg} alt="Main Visual" style={{ width: "100%" }} />
          <div className="main-toStar">
            <p>TO. {userInfo.petName}에게</p>
            <button onClick={handleToStar}>마음 보내기</button>
          </div>
          <div className="main-starFriends">
            <p>{userInfo.petName}의 별나라 친구들</p>
            <div className="friends-slide">
              {friends.map((friend) => (
                <div className="friend-pro" key={friend.id}>
                  <img src={friend.profileImage || "default-friend-img.png"} alt={friend.petName} />
                  <p>{friend.petName}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="main-coms-header">
            <h4>별빛 커뮤니티</h4>
            <button onClick={handleToCommunity}>더보기</button>
          </div>
          <div className="community-wrap">
            {communityPreviews.map((preview, index) => (
              <div className="coms" key={index}>
                <div className="contents" style={{ width: "100%" }}>
                  <img src={preview.profileImage || "default-com-img.png"} alt={preview.title} />
                  <div className="text">
                    <h1>{preview.title}</h1>
                    <p>{preview.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
