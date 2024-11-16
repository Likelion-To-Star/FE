import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./section/Header";
import Nav from "./section/Nav";
import { Outlet } from "react-router-dom";
import axios from "axios";
import mainImg from "../../assets/img/main-img.png";
import "../../assets/scss/components/_community.scss";
import AlertWhen from "../Util/AlertWhen";

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const [communityPreviews, setCommunityPreviews] = useState([]);
  const [friends, setFriends] = useState([]); // 친구 상태 추가
  const [error, setError] = useState(false);

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

  //현재 선택한 별나라 친구 프로필 저장
  const handlefriendId = (friend) => {
    localStorage.setItem("starfriend", JSON.stringify(friend)); // 친구 전체 정보 저장
    navigate("/main/friends");
  };

  const handleCommunityClick = async (communityId) => {
    localStorage.setItem("ComId", communityId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/community/${communityId}/preview`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.isSuccess) {
        if (response.data.result.isOwner === false) navigate("/main/community/entercom");
        else navigate("/main/community/changecom");
      }
    } catch (error) {
      console.error("error getcommunityData", error);
      setError(true);
    }
  };
  const handleChattingClick = async (communityId) => {
    localStorage.setItem("ComId", communityId);
    const jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
      alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/community/${communityId}/membership-check`, {
        headers: {
          Authorization: jwtToken,
        },
      });

      if (response.data.isSuccess) {
        const isMember = response.data.result;
        console.log("회원 여부 : ", isMember);

        if (isMember) {
          // 회원일 경우 채팅방으로 이동
          navigate("/main/community/chatting");
        } else {
          // 회원이 아닐 경우, 회원 가입 후 채팅방으로 이동
          navigate("/main/community/entercom");
        }
      }
    } catch (error) {
      console.error("회원 여부 확인 중 오류 발생:", error);
      setError(true);
    }
  };

  return (
    <div className="main-wrap">
      {error && <AlertWhen message="별나라에서 추억을 불러오는 중이에요. 다시 한번 시도해 주세요." />}
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
                <div className="friend-pro" key={friend.id} onClick={() => handlefriendId(friend.id)}>
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
                  <div className="img-wrap" onClick={() => handleCommunityClick(preview.communityId)}>
                    <img src={preview.profileImage || "default-com-img.png"} alt="커뮤니티 이미지" />
                  </div>

                  <div className="text" onClick={() => handleChattingClick(preview.communityId)}>
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
