import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../assets/scss/components/friends.scss";
import "../../../assets/scss/components/friends-search.scss";
import moon from "../../../assets/img/moon.svg";
import friendsSearchBtn from "../../../assets/img/friends/friends-search-btn.svg";
import searchIcon from "../../../assets/img/friends/search.svg";
import noresult from "../../../assets/img/friends/no-results-icon.svg";
import mention from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";
import plusIcon from "../../../assets/img/plus-icon.svg";
import EXIT from "../../../assets/img/friends/exit.svg";
import SendInput from "../../../assets/img/friends/input-send.svg";
import Profile from "../../../assets/img/profile-colored.png";

const FriendsSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [friends, setFriends] = useState([]);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const [posts, setPosts] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [selectedProfile, setSelectedProfile] = useState("myProfile"); // 초기 상태: 자기 자신
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [myId, setMyId] = useState(null);
  const [notOwner, setNotOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/user/info`, {
          headers: { Authorization: token },
        });
        if (response.data.isSuccess) {
          setMyId(response.data.result.userId); // myId 설정
        } else {
          alert("사용자 정보를 가져오지 못했습니다. 다시 로그인해주세요.");
        }
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error.response || error);
      }
    };

    fetchMyInfo();
  }, []);

  // 친구 목록 조회
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/user/friend`, {
        headers: { Authorization: token },
      });
      if (response.data.isSuccess) {
        setFriends(response.data.result);
      } else {
        alert("로그인 다시 해주세요.");
      }
    } catch (error) {
      console.error("친구 목록 조회 오류:", error.response || error);
    }
  };

  // 내 게시물 조회
  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user`, {
        headers: { Authorization: token },
        params: { page: 0, size: 5 },
      });
      if (response.data.isSuccess) {
        setPosts(response.data.result);
        setSelectedFriend(userInfo);
      } else {
        alert("로그인 다시 해주세요.");
      }
    } catch (error) {
      console.error("내 게시물 조회 오류:", error.response || error);
    }
  };

  // 친구가 아닌 사용자 게시물 조회
  const fetchOtherPosts = async (page = 1, size = 5) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/others`, {
        headers: { Authorization: token },
        params: { page, size },
      });
      if (response.data.isSuccess && response.data.result.length > 0) {
        const postsData = response.data.result;
        setPosts(postsData);
        setSelectedFriend(postsData[0].author); // 첫 번째 게시물 작성자의 정보로 설정
      } else {
        setPosts([]);
        setSelectedFriend(null);
      }
    } catch (error) {
      console.error("친구가 아닌 사용자 게시물 조회 오류:", error.response || error);
    }
  };

  // 친구 게시물 조회
  const fetchUserPosts = async (friend) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user/${friend.id}`, {
        headers: { Authorization: token },
        params: { page: 0, size: 5 },
      });
      if (response.data.isSuccess) {
        setPosts(response.data.result);
        setSelectedFriend(friend);
        setIsSearchActive(false);
        setNoResults(false);
      } else {
        alert("로그인 다시 해주세요.");
      }
    } catch (error) {
      console.error("친구 게시물 조회 오류:", error.response || error);
    }
  };

  // 친구 검색
  const searchFriends = async () => {
    const token = localStorage.getItem("token");

    if (!searchTerm) {
      console.log("검색어가 비어 있습니다.");
      setNoResults(true);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/user/search`, {
        headers: { Authorization: token },
        params: { name: searchTerm, page: 0, size: 5 },
      });

      if (response.data.isSuccess && response.data.result.length > 0) {
        setSearchResults(response.data.result);
        setNoResults(false);
      } else {
        setSearchResults([]);
        setNoResults(true);
        setPosts([]);
      }
    } catch (error) {
      console.error("친구 검색 오류:", error);
      setNoResults(true);
      setPosts([]);
    }
  };

  const handleFriendClick = (friend) => {
    fetchUserPosts(friend);
  };

  // 댓글 조회
  const fetchComments = async (articleId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/comment/${articleId}`, {
        headers: { Authorization: token },
      });
      if (response.data.isSuccess) {
        setComments(response.data.result || []);
      }
    } catch (error) {
      console.error("댓글 조회 오류:", error);
    }
  };

  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setCommentOpen(true);
    fetchComments(postId);
  };

  // 댓글 추가
  const handleAddComment = async () => {
    if (!currentComment) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/comment/${selectedPostId}`,
        {
          articleId: selectedPostId,
          content: currentComment,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.isSuccess) {
        setComments((prevComments) => [...prevComments, response.data.result]);
        setCurrentComment("");
      } else {
        alert("댓글 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error.response || error);
      alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정
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
        alert(response.data.message);
        setComments((prevComments) => prevComments.map((comment) => (comment.commentId === commentId ? { ...comment, content: newContent } : comment)));
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 오류:", error.response || error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/comment/${commentId}`, {
        headers: { Authorization: token },
      });
      if (response.data.isSuccess) {
        alert(response.data.message);
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error.response || error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 친구 추가
  const addFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/user/friend`,
        { friendId },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.isSuccess) {
        alert(response.data.message);
        fetchFriends();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("친구 추가 오류:", error);
      alert("친구 추가 중 오류가 발생했습니다.");
    }
  };

  // 친구 삭제
  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/user/friend`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        data: { friendId },
      });

      if (response.data.isSuccess) {
        alert(response.data.message);
        setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
        setSelectedFriend(null);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("친구 끊기 오류:", error);
      alert("친구 끊기 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchMyPosts();
  }, []);

  // 프로필 클릭 시 게시물 초기화 및 재조회
  const handleMyprofileClick = () => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setSelectedProfile("myProfile");
    fetchMyPosts(0);
  };

  // 게시물 수정
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

  const openModal = (articleId) => {
    setPostToDelete(articleId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
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
          setPosts((prevPosts) => prevPosts.filter((post) => post.articleId !== postToDelete));
          closeModal();
        } else {
          alert("게시물 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시물 삭제 오류:", error.response || error);
        alert("게시물 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="friendSrh-wrap">
      <div className="main-container">
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              <div
                className={`moon-pro ${selectedProfile === "myProfile" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedProfile("myProfile"); // 선택 상태 업데이트
                  fetchMyPosts();
                }}
              >
                <img src={userInfo.profileImage || Profile} alt="Profile" className="moon-img" />
                <p>{userInfo.petName || "애완동물 이름"}</p>
              </div>

              {friends.map((friend) => (
                <div
                  className={`friend-with-pro ${selectedProfile === friend.id ? "selected" : ""}`}
                  key={friend.id}
                  onClick={() => {
                    setSelectedProfile(friend.id);
                    handleFriendClick(friend);
                  }}
                >
                  <img src={friend.profileImage || moon} alt={friend.petName} className="friends-img" />
                  <p>{friend.petName}</p>
                </div>
              ))}
            </div>
            <div className="friends-search-cnt">
              <img
                src={friendsSearchBtn}
                onClick={() => {
                  setIsSearchActive(true);
                  fetchOtherPosts();
                }}
                alt="Search Button"
              />
              <button
                onClick={() => {
                  setIsSearchActive(true);
                  fetchOtherPosts();
                }}
              >
                다른 친구들
              </button>
            </div>
          </div>
        </div>

        <div className="sub-container">
          {isSearchActive && (
            <div className="search-btn">
              <input type="text" placeholder="별나라의 친구들을 찾아보세요." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <img src={searchIcon} alt="Search Icon" onClick={searchFriends} />
            </div>
          )}
          {isSearchActive && (
            <div className="friends-list">
              {noResults ? (
                <div className="no-member">
                  <img src={noresult} alt="No Members" className="no-member-img" />
                  <p>검색하신 별나라 친구를 찾을 수 없어요.</p>
                  <p>다른 친구를 검색해주세요.</p>
                </div>
              ) : (
                searchResults.map((friend) => (
                  <div className="friend-profile" key={friend.id} onClick={() => handleFriendClick(friend)}>
                    <img src={friend.profileImage} className="friends-img" alt={`${friend.petName} 프로필`} />
                    <div className="friend-info">
                      <p className="friend-name">{friend.petName}</p>
                      <p className="friend-details">
                        {friend.category} · 생일: {friend.birthday} · 별이 된 날: {friend.starDay}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="friend-profile-container">
          {selectedFriend && !noResults && (
            <>
              <div className="friend-profile-header">
                <img src={selectedFriend.profileImage || moon} alt={`${selectedFriend.petName} 프로필`} className="pro-img-cnt" />
                <div className="friend-info">
                  <p className="friend-name">{selectedFriend.petName}</p>
                  <p className="friend-details">
                    {selectedFriend.category} · 생일: {selectedFriend.birthday} · 별이 된 날: {selectedFriend.starDay}
                  </p>
                </div>

                {/* 친구 추가/종료 버튼 조건부 렌더링 */}
                {selectedProfile !== "myProfile" &&
                  (friends.some((friend) => friend.id === selectedFriend.id) ? (
                    <button onClick={() => removeFriend(selectedFriend.id)} className="friend-unfriend-btn">
                      별나라 친구 종료하기
                    </button>
                  ) : (
                    <button onClick={() => addFriend(selectedFriend.id)} className="friend-unfriend-btn">
                      별나라 친구 시작하기
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>

        {!noResults && (
          <div className="friend-profile-container">
            {posts.map((post) => (
              <div className="friend-posts" key={post.articleId}>
                <div className="post-cnt">
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>

                  {/* 이미지가 있는 경우에만 렌더링 */}
                  {post.images && post.images.length > 0 && (
                    <div className="post-img-cnt">
                      {post.images.map((image) => (
                        <img key={image.imageId} src={image.url} alt="Post" />
                      ))}
                    </div>
                  )}

                  <div className="post-icons-cnt">
                    <div className="post-icons">
                      {/* 댓글 버튼 */}
                      <img src={mention} alt="Comment" onClick={() => handleCommentClick(post.articleId)} />

                      {post.owner && (
                        <>
                          {/* 수정 버튼 */}
                          <img src={postIcon2} alt="Edit Icon" onClick={() => handleEditClick(post.articleId, post.author.userId)} />
                          {/* 삭제 버튼 */}
                          <img src={postIcon3} alt="Delete Icon" onClick={() => openModal(post.articleId)} />
                        </>
                      )}
                    </div>
                    <p>{new Date(post.updatedAt).toISOString().slice(0, 10).replace(/-/g, ".")}</p>
                  </div>
                </div>

                {commentOpen && selectedPostId === post.articleId && (
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
                          <img src={comment.profileImage || moon} alt={comment.petName || "프로필 이미지"} className="comment-profile" />
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
                      <input type="text" value={currentComment} onChange={(e) => setCurrentComment(e.target.value)} placeholder="댓글을 입력하세요" />
                      <img src={SendInput} onClick={handleAddComment} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isModalOpen && (
              <>
                {/* 모달 배경 */}
                <div className="modal-overlay" onClick={closeModal}></div>
                {/* 모달 내용 */}
                <div className="modal">
                  <p>이 게시물을 삭제하시겠습니까?</p>
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
        )}
      </div>
    </div>
  );
};

export default FriendsSearch;
