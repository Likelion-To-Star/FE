import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../assets/scss/components/friends.scss";
import Profile from "../../../assets/img/profile-colored.png";
import plusIcon from "../../../assets/img/plus-icon.svg";
import logoGray from "../../../assets/img/friends/logo-gray.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";
import memory from "../../../assets/img/friends/memory.svg";
import AlertWhen from "../../Util/AlertWhen";
import EXIT from "../../../assets/img/friends/exit.svg";
import SendInput from "../../../assets/img/friends/input-send.svg";
import noresult from "../../../assets/img/friends/no-results-icon.svg";

const Friends = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const newPost = location.state?.newPost;

  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const [friends, setFriends] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [myId, setMyId] = useState(null);
  const [notOwner, setNotOwner] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [commentOpen, setCommentOpen] = useState(false);
  const starfriend = localStorage.getItem("starfriend");
  const [selectedProfile, setSelectedProfile] = useState("myProfile");
  const observerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 친구 목록 조회
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/user/friend`, {
        headers: { Authorization: token },
      });
      setFriends(response.data.result);
      if (response.data.isSuccess !== true) {
        alert("로그인 다시 해주세요");
      }
    } catch (error) {
      console.error("사용자 조회 오류:", error.response || error);
    }
  };
  // 내 게시물 조회
  const fetchMyPosts = async (currentPage) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user`, {
        headers: { Authorization: token },
        params: {
          page: currentPage,
          size: 5,
        },
      });
      const data = response.data.result;
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("내 게시물 조회 오류:", error.response || error);
    }
  };

  // 다른 사람 추억 조회
  const fetchUserPosts = async (searchId, currentPage) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user/${searchId}`, {
        headers: { Authorization: token },
        params: {
          page: currentPage,
          size: 5,
        },
      });
      const data = response.data.result;
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("게시물 조회 오류:", error.response || error);
    }
  };

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      const nextPage = page + 1;
      if (selectedProfile === "myProfile") {
        fetchMyPosts(nextPage);
      } else {
        fetchUserPosts(selectedProfile, nextPage);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (observerRef.current) observer.observe(observerRef.current);

    // 옵저버가 최신 상태를 반영할 수 있도록 설정
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [page, hasMore, selectedProfile, isInitialLoad]);

  // 댓글 조회
  const fetchComments = async (articleId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/comment/${articleId}`, {
        headers: { Authorization: token },
      });
      setComments(response.data.result || []);
    } catch (error) {
      console.error("댓글 조회 오류:", error);
    }
  };

  // 댓글 추가하기
  const handleAddComment = async () => {
    if (currentComment.trim() === "") return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/comment/${selectedPostId}`,
        {
          content: currentComment,
        },
        {
          headers: { Authorization: token },
        }
      );
      const newComment = response.data.result;
      setComments((prev) => [...prev, newComment]);
      setCurrentComment("");
    } catch (error) {
      console.error("댓글 추가 중 오류:", error);
    }
  };

  const confirmDelete = async () => {
    if (postToDelete !== null) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/api/articles/${postToDelete}`, {
          headers: { Authorization: token },
        });

        if (response.data.isSuccess) {
          alert("게시물이 성공적으로 삭제되었습니다.");
          // 삭제된 게시물을 제외한 나머지 게시물로 업데이트
          setPosts((prevPosts) => prevPosts.filter((post) => post.articleId !== postToDelete));
          closeModal();
        } else {
          alert("게시물 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시물 삭제 중 오류가 발생했습니다:", error.response || error);
        alert("게시물 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const openModal = (articleId) => {
    setPostToDelete(articleId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/comment/${commentId}`, {
        headers: { Authorization: token },
      });
      if (response.data.isSuccess) {
        alert(response.data.message); // "성공입니다." 메시지 출력
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error.response || error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 함수
  const handleEditComment = async (commentId) => {
    const newContent = prompt("수정할 댓글 내용을 입력하세요:");
    if (!newContent) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/comment/${commentId}`,
        { content: newContent },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.isSuccess) {
        alert(response.data.message); // "성공입니다." 메시지 출력
        setComments((prevComments) => prevComments.map((comment) => (comment.commentId === commentId ? { ...comment, content: newContent } : comment)));
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 오류:", error.response || error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 초기 게시물 로딩
  useEffect(() => {
    const initPosts = async () => {
      await fetchFriends();

      if (starfriend) {
        // starfriend가 있을 경우 해당 유저의 게시물 조회
        await fetchUserPosts(starfriend, 0);
        setSelectedProfile(starfriend);
      } else {
        // starfriend가 없을 경우 자신의 게시물 조회
        await fetchMyPosts(0);
        setSelectedProfile("myProfile");
      }

      // 초기 로딩 완료 후 옵저버 활성화
      setIsInitialLoad(false);
    };

    initPosts();
  }, []);

  const handleMemory = () => {
    navigate("/main/friends/newpost");
  };

  const handleFriendsSearch = () => {
    navigate("/main/friendsSearch");
  };
  // 프로필 클릭 시 게시물 초기화 및 재조회
  const handleMyprofileClick = () => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setSelectedProfile("myProfile");
    fetchMyPosts(0);
  };

  const handleProfileClick = (searchId) => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setSelectedProfile(searchId);
    fetchUserPosts(searchId, 0);
  };

  const openModal = (articleId) => {
    setPostToDelete(articleId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  const handleEditClick = (articleId, authorId) => {
    if (authorId === myId) {
      navigate(`/main/friends/editpost/${articleId}`);
    } else {
      setNotOwner(true);
      setTimeout(() => {
        setNotOwner(false);
      }, 3000);
    }
  };

  // 댓글 아이콘 클릭 시 댓글 창 열기
  const handleCommentClick = (postId) => {
    setSelectedPostId(postId); //선택한 아이디
    setCommentOpen(true);
    fetchComments(postId);
  };

  // // 댓글 삭제 모달 열기
  // const openDeleteModal = (commentId) => {
  //   setCommentToDelete(commentId);
  //   setIsDeleteModalOpen(true);
  // };

  // // 댓글 삭제 모달 닫기
  // const closeDeleteModal = () => {
  //   setIsDeleteModalOpen(false);
  //   setCommentToDelete(null);
  // };

  return (
    <div className="friends-wrap">
      {notOwner && <AlertWhen message="게시물의 주인이 아니에요." />}
      <div className="main-container">
        <div className="main-moon-Friends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              {/* 자기 자신 프로필 */}
              <div className="moon-pro" onClick={handleMyprofileClick}>
                <img src={userInfo.profileImage || Profile} alt="Profile" className={`moon-img ${selectedProfile === "myProfile" ? "selected" : ""}`} />
                <p>{userInfo.petName || "애완동물 이름"}</p>
              </div>
              {friends ? (
                friends.map((friend) => (
                  <div key={friend.id} className={`friend-with-pro`} onClick={() => handleProfileClick(friend.id)}>
                    <img
                      src={friend.profileImage || Profile}
                      className={`friends-img  ${selectedProfile == friend.id ? "selected" : ""}`}
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
            <div className="pro-words">
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
              <div className="post-img-cnt">{post.images && post.images.map((image) => <img key={image.imageId} src={image.url} alt="Post" />)}</div>
              <div className="post-icons-cnt">
                <div className="post-icons">
                  <img src={postIcon1} alt="Comment" onClick={() => handleCommentClick(post.articleId)} />
                  <img src={postIcon2} alt="Edit Icon" onClick={() => handleEditClick(post.articleId, post.author.userId)} />
                  <img src={postIcon3} alt="mention Delete" onClick={() => openModal(post.articleId)} />
                </div>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-member">
            <img src={noresult} alt="No Members" className="no-member-img" />
            <p>검색하신 별나라 친구를 찾을 수 없어요.</p>
            <p>다른 친구를 검색해주세요.</p>
          </div>
        )}
        <div ref={observerRef} style={{ height: "20px" }}></div>

        <img src={memory} className="memory-fixed" onClick={handleMemory} alt="Memory" />
      </div>
      {/* 댓글 섹션 */}
      {commentOpen && (
        <div className="comment-section">
          <div className="comment-header">
            <h4>마음 나누기</h4>
            <img
              src={EXIT}
              onClick={() => {
                setSelectedPostId(null);
                setCommentOpen(false);
              }}
            />
          </div>
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.commentId} className="comment-item">
                <img src={comment.profileImage || Profile} alt={comment.petName || "프로필 이미지"} className="comment-profile" />
                <div className="comment-content">
                  <p>
                    <strong>{comment.petName}</strong>
                  </p>
                  <p>{comment.content}</p>
                </div>
                {comment.isMine && (
                  <div className="comments-icons-cnt">
                    <img src={postIcon2} onClick={() => handleEditComment(comment.commentId)} alt="수정" />
                    <img src={postIcon3} onClick={() => handleDeleteComment(comment.commentId)} alt="삭제" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="comment-input">
            <input
              type="text"
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              placeholder="다들 너무 감사합니다. 우리 아이들 생각하면서 오늘도 힘내봐요!"
            />
            <img src={SendInput} onClick={handleAddComment} />
          </div>
        </div>
      )}
      {/* 게시물 삭제 모달 창 */}
      {isModalOpen && (
        <>
          {/* 모달 백그라운드 */}
          <div className="modal-overlay" onClick={closeModal}></div>

          {/* 모달 창 */}
          <div className="modal">
            <p>게시물을 삭제하시겠습니까?</p>
            <button className="modal-yes" onClick={confirmDelete}>
              삭제
            </button>
            <button className="modal-no" onClick={closeModal}>
              취소
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Friends;
