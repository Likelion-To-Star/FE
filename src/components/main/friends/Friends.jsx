import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../assets/scss/components/friends.scss";
import moon from "../../../assets/img/moon.svg";
import memory from "../../../assets/img/friends/memory.svg";
import newFriends from "../../../assets/img/new-friends.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";

const Friends = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendInfo, setFriendInfo] = useState(null); // 친구 정보를 저장하는 상태
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // 달이의 친구 목록 불러오기
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/user/friend`, {
          headers: { Authorization: token },
        });

        if (response.data && response.data.isSuccess) {
          setFriends(response.data.result);
        }
      } catch (error) {
        console.error("친구 목록 불러오기 오류:", error);
      }
    };

    fetchFriends();
  }, []);

  // 특정 친구의 게시물 및 정보 불러오기
  const fetchUserPosts = async (friendId, page = 0, size = 4) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user/${friendId}?page=${page}&size=${size}`, {
        headers: { Authorization: token },
      });

      if (response.data && response.data.isSuccess) {
        setPosts(response.data.result);
        const friend = friends.find((f) => f.id === friendId);
        setFriendInfo(friend); // 친구 정보 저장
      }
    } catch (error) {
      console.error("게시물 불러오기 오류:", error);
    }
  };

  const handleProfileClick = () => {
    setFriendInfo(userInfo); // 자신의 프로필 정보 설정
    fetchUserPosts(userInfo.userId);
  };

  const handleFriendProfileClick = (friendId) => {
    fetchUserPosts(friendId);
  };

  const handleMemory = () => {
    navigate("/friends/newpost");
  };

  const handleFriendsSearch = () => {
    navigate("/friendsSearch");
  };

  const handleEndFriendship = (friendId) => {
    console.log(`별나라 친구 ${friendId} 종료`);
  };

  return (
    <div className="main-wrap">
      <div className="main-container">
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              {/* 회원의 이미지와 이름 표시 */}
              <div className="moon-pro" onClick={handleProfileClick}>
                <img src={userInfo.profileImage || moon} alt="Profile" className="moon-img" />
                <p>{userInfo.petName || "내 이름"}</p>
              </div>
              {/* 친구 목록 표시 */}
              {friends.map((friend) => (
                <div key={friend.id} className="friend-with-pro" onClick={() => handleFriendProfileClick(friend.id)}>
                  <img src={friend.profileImage || moon} className="friends-img" alt={friend.petName} />
                  <p>{friend.petName}</p>
                </div>
              ))}
            </div>
            <div className="new-friends-cnt" onClick={handleFriendsSearch}>
              <img src={newFriends} alt="새 친구 찾기" />
              <button>다른 친구들</button>
            </div>
          </div>
        </div>

        {/* 선택된 친구의 정보 표시 */}
        {friendInfo && (
          <div className="friend-profile">
            <img src={friendInfo.profileImage || moon} alt={friendInfo.petName} className="pro-img-cnt" />
            <div className="friend-info">
              <p className="friend-name">{friendInfo.petName}</p>
              <p className="friend-details">
                생일: {friendInfo.birthDay} • 별이 된 날: {friendInfo.starDay}
              </p>
            </div>
            {friendInfo.userId !== userInfo.userId && (
              <button className="end-friendship-btn" onClick={() => handleEndFriendship(friendInfo.userId)}>
                별나라 친구 종료하기
              </button>
            )}
          </div>
        )}

        {/* 게시물 리스트 */}
        <div className="pro-cnt">
          {posts.map((post) => (
            <div key={post.articleId} className="post-cnt">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <div className="post-img-cnt">{post.images && post.images.map((image) => <img key={image.imageId} src={image.url} alt="Post" />)}</div>
              <div className="post-icons-cnt">
                <div className="post-icons">
                  <img src={postIcon1} alt="Comment" />
                  <>
                    <img src={postIcon2} alt="Edit Icon" />
                    <img src={postIcon3} alt="Delete" />
                  </>
                </div>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
        <img src={memory} className="memory-fixed" onClick={handleMemory} alt="Memory" />
      </div>
    </div>
  );
};

export default Friends;
