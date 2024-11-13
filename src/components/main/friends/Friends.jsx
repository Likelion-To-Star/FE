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
  const [articleId,setArticleId]=useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [friends, setFriends] = useState([]);
 
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//사용자 searchid(==id 친구전체 조회의)조회
const fetchFriends = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/api/user/friend`, {
      headers: { Authorization: `${token}` },
    });
    //console.log(response.data.result);
    setFriends(response.data.result);
    if (response.data.isSuccess !== true) {
      alert("로그인 다시 해주세요");
    }
  } catch (error) {
    console.error("사용자 조회 오류:", error.response || error);
  }
};


//사용자 추억조회하기(나)
const fetchOMyPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/api/articles/user`, {
      headers: { Authorization: `${token}` },
      params: {
        page: 0,
        size: 5,
      },
    });
    if (response.data.result) {
      setPosts(response.data.result);
      console.log(posts);
    } else {
      setPosts([]); // 데이터가 없으면 빈 배열 설정
    }

    if (response.data.isSuccess !== true) {
      alert("로그인 다시 해주세요");
    }
  } catch (error) {
    console.error("내 게시물 조회 오류:", error.response || error);
  }
};

//다른 사람 추억조회하기
const fetchUserPosts = async (searchid) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/api/articles/user/${searchid}`, {
      headers: { Authorization: `${token}` },
      params: {
        page: 0,
        size: 5,
      },
    });
    if (response.data.result) {
      setPosts(response.data.result);
      console.log(posts);
    } else {
      setPosts([]); // 데이터가 없으면 빈 배열 설정
    }

    if (response.data.isSuccess !== true) {
      alert("로그인 다시 해주세요");
    }
  } catch (error) {
    console.error("게시물 불러오기 오류:", error.response || error);
  }
};

  useEffect(() => {
    fetchFriends();
    console.log(friends);
    fetchOMyPosts();
  }, []);

  

  // useEffect(() => {
  //   if (newPost) {
  //     const updatedPosts = [...posts, newPost];
  //     setPosts(updatedPosts);
  //     localStorage.setItem("posts", JSON.stringify(updatedPosts));
  //   }
  // }, [newPost]);

  const handleMemory = () => {
    navigate("/main/friends/newpost");
  };

  const handleFriendsSearch = () => {
    navigate("/main/friends/friendsSearch");
  };

const handleMyprofileClick=() =>{
  fetchOMyPosts();
}

  const handleProfileClick = (searchid) => {
    fetchUserPosts(searchid); //사용자가 만든 추억 조회하기
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
          headers: { Authorization: `${token}` },
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
          {/* 자기 자신 프로필 */}
          <div className="moon-pro" onClick={() => handleMyprofileClick(userInfo.userId)}>
            <img src={userInfo.profileImage || Profile} alt="Profile" className="moon-img selected img " />
            <p>{userInfo.petName || "애완동물 이름"}</p>
          </div>
          {friends ? (
            friends.map((friend) => (
              <div key={friend.id} className="friend-with-pro" onClick={() => handleProfileClick(friend.id)}>
                <img
                  src={friend.profileImage || 'default-image-url'}
                  className="friends-img"
                  alt={friend.petName}
                />
                <p>{friend.petName}</p>
              </div>
            ))
          ) : (
            <div className="no-friends">
              <p>현재 친구가 없습니다.</p>
            </div>
          )}


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

        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.articleId} className="post-cnt">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <div className="post-img-cnt">
                {post.images && post.images.map((image) => (
                  <img key={image.imageId} src={image.url} alt="Post" />
                ))}
              </div>
              <div className="post-icons-cnt">
                <div className="post-icons">
                  <img src={postIcon1} alt="Comment" onClick={() => handleCommentClick(post.articleId)} />
                  <img src={postIcon2} alt="Edit Icon" onClick={() => handleEditPost(post.articleId)} />
                  <img src={postIcon3} alt="Delete" onClick={() => openModal(post.articleId)} />
                </div>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>게시물이 없습니다.</p>
        )}



        <img src={memory} className="memory-fixed" onClick={handleMemory} alt="Memory" />
      </div>
    </div>
  );
};

export default Friends;
