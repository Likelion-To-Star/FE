import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../assets/scss/components/friends.scss";
import moon from "../../../assets/img/moon.svg";
import memory from "../../../assets/img/friends/memory.svg";
import friends1 from "../../../assets/img/friends-1.svg";
import friends2 from "../../../assets/img/friends-2.svg";
import friends3 from "../../../assets/img/friends-3.svg";
import friends4 from "../../../assets/img/friends-4.svg";
import logoGray from "../../../assets/img/friends/logo-gray.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";
import Profile from '../../../assets/img/profile-colored.png';
import plusIcon from '../../../assets/img/plus-icon.svg';

const Friends = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const newPost = location.state?.newPost;

  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {}); // localStorage에서 userInfo 가져오기
  const userId = localStorage.getItem("userInfo");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
 //로컬 스토리지에서 사용자 정보 가져오기
  if(!userId){
  alert("로그인 다시해");
  }
    fetchUserPosts(userInfo.userId); //사용자가 만든 추억 조회하기
  }, []);

  //사용자 추억조회하기
  const fetchUserPosts = async (userId) => {
    if (!userId) {
      console.error("user_id is undefined");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user/${userId}`, {
        headers: { Authorization: `${token}` },
        params: {
          page: 0,
          size: 5,
        },
      });
      const article = response.data.result.articles;
      setPosts(article ? [article] : []);
      localStorage.setItem("posts", JSON.stringify(article));
    } catch (error) {
      if(response.data.istSuccess !==true)
      {
        alert("로그인 다시 해");
      }
      console.error("게시물 불러오기 오류:", error.response || error);
    }
  };

  useEffect(() => {
    if (newPost) {
      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    }
  }, [newPost]);

  const handleMemory = () => {
    navigate("/main/friends/newpost");
  };

  const handleFriendsSearch = () => {
    navigate("/main/friends/friendsSearch");
  };

  const handleProfileClick = (userId) => {
    fetchUserPosts(userId);
  };

  const openModal = (articleId) => {
    setPostToDelete(articleId);
    setIsModalOpen(true);
  };

  const handleEditPost = (articleId) => {
    navigate(`/main/friends/editpost/${articleId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  const confirmDelete = async () => {
    if (postToDelete !== null) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/api/articles/user/${postToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedPosts = posts.filter((post) => post.article_id !== postToDelete);
        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        closeModal();
        alert("게시물이 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("게시물 삭제 중 오류가 발생했습니다:", error.response || error);
        alert("게시물 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCommentClick = (articleId) => {
    navigate(`/main/articles/${articleId}/comments`);
  };

  return (
    <div className="friends-wrap">
      <div className="main-container">
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              <div className="moon-pro" onClick={() => handleProfileClick(userInfo.userId)}>
                <img src={userInfo.profileImage || Profile} alt="Profile" className="moon-img selected img " />
                <p>{userInfo.petName || "애완동물 이름"}</p>
              </div>
              <div className="friend-with-pro" onClick={() => handleProfileClick("friendId1")}>
                <img src={friends1} className="friends-img" alt="미아" />
                <p>미아</p>
              </div>
              <div className="friend-with-pro" onClick={() => handleProfileClick("friendId2")}>
                <img src={friends2} className="friends-img" alt="밤이" />
                <p>밤이</p>
              </div>
              <div className="friend-with-pro" onClick={() => handleProfileClick("friendId3")}>
                <img src={friends3} className="friends-img" alt="로이" />
                <p>로이</p>
              </div>
              <div className="friend-with-pro" onClick={() => handleProfileClick("friendId4")}>
                <img src={friends4} className="friends-img" alt="초코" />
                <p>초코</p>
              </div>
            </div>
            <div className="new-friends-cnt" onClick={handleFriendsSearch}>
              <div className="plus-icon">
              <img src={plusIcon} alt="plus" />
              </div>
              <button className="new-friends-btn">
              <img src={logoGray} alt="" />
              </button>
              <p>다른 친구들</p>
            </div>
          </div>
        </div>
        <div className="pro-cnt">
          <div className="pro-img-cnt">
            <img src={userInfo.profileImage || Profile} alt="Profile" />
            <div className="pro-cnt">
              <h4>{userInfo.petName || "반려동물 이름"}</h4>
              <div className="pro-p-cnt">
                <p id="animal">{userInfo.category || "종류"} •</p>
                <p id="birth-date">생일 {userInfo.birthDay}</p>
                <p id="star-date">별이된 날 {userInfo.starDay}</p>
              </div>
            </div>
          </div>
        </div>

        {posts.map((post) => (
          <div key={post.article_id} className="post-cnt">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <div className="post-img-cnt">{post.images && post.images.map((image) => <img key={image.imageId} src={image.url} alt="Post" />)}</div>
            <div className="post-icons-cnt">
              <div className="post-icons">
                <img src={postIcon1} alt="Comment" onClick={() => handleCommentClick(post.article_id)} />
                <img src={postIcon2} alt="Edit Icon" onClick={() => handleEditPost(post.article_id)} />
                <img src={postIcon3} alt="Delete" onClick={() => openModal(post.article_id)} />
              </div>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}

        <img src={memory} className="memory-fixed" onClick={handleMemory} alt="Memory" />
      </div>
    </div>
  );
};

export default Friends;
