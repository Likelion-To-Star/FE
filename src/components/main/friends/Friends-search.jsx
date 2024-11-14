import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../../assets/scss/components/friends.scss";
import "../../../assets/scss/components/friends-search.scss";
import Header from "../section/Header";
import Nav from "../section/Nav";
import moon from "../../../assets/img/moon.svg";
import friendsSearchBtn from "../../../assets/img/friends/friends-search-btn.svg";
import searchIcon from "../../../assets/img/friends/search.svg";
import noresult from "../../../assets/img/friends/no-results-icon.svg";
import mention from "../../../assets/img/friends/post-icon1.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";
import plusIcon from "../../../assets/img/plus-icon.svg";

const FriendsSearch = () => {
  const location = useLocation();
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
  const [currentComment, setCurrentComment] = useState(""); // 댓글 입력 상태
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // 친구 목록 불러오기
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

  // 친구가 아닌 사람들의 게시물 조회
  const fetchOtherPosts = async (page = 1, size = 5) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/others`, {
        headers: { Authorization: token },
        params: { page, size },
      });
      if (response.data.isSuccess) {
        setPosts(response.data.result);
        setSelectedFriend(null);
      } else {
        console.error("게시물 조회 실패:", response.data.message);
      }
    } catch (error) {
      console.error("친구가 아닌 사용자 게시물 조회 오류:", error.response || error);
    }
  };

  // 특정 친구의 게시물 조회 및 정보 저장
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
      } else {
        alert("로그인 다시 해주세요.");
      }
    } catch (error) {
      console.error("친구 게시물 조회 오류:", error.response || error);
    }
  };

  // 친구 검색 기능
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
        params: { name: searchTerm, page: 1, size: 5 },
      });

      if (response.data.isSuccess && response.data.result.length > 0) {
        setSearchResults(response.data.result);
        setNoResults(false);
      } else {
        setSearchResults([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error("친구 검색 오류:", error);
      setNoResults(true);
    }
  };

  // 페이지 로딩 시 초기 게시물 가져오기
  useEffect(() => {
    fetchFriends();
    fetchMyPosts();
  }, []);

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

  // 댓글 아이콘 클릭 시 댓글 창 열기
  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setCommentOpen(true);
    fetchComments(postId);
  };

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (!currentComment) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/comment`,
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
        setCurrentComment(""); // 댓글 입력란 초기화
      } else {
        alert("댓글 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error.response || error);
      alert("댓글 추가 중 오류가 발생했습니다.");
    }
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

  // 친구 추가
  const addFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/user/friend`, // 친구 추가 경로
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
        fetchFriends(); // 친구 목록 업데이트
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("친구 추가 오류:", error); // 전체 오류 객체를 로그에 출력
      alert("친구 추가 중 오류가 발생했습니다.");
    }
  };

  // 친구 끊기
  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/user/friend`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        data: { friendId }, // DELETE 요청의 body에 데이터 포함
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

  return (
    <div className="friendSrh-wrap">
      <div className="main-container">
        {/* 이미지 슬라이드 */}
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              {/* 사용자 자신의 정보 표시 */}
              <div className="moon-pro" onClick={() => fetchMyPosts()}>
                <img src={userInfo.profileImage || moon} alt="Profile" className="moon-img" />
                <p>{userInfo.petName || "내 이름"}</p>
              </div>
              {/* 친구 목록 표시 */}
              {friends.map((friend) => (
                <div className="friend-with-pro" key={friend.id} onClick={() => handleFriendClick(friend)}>
                  <img src={friend.profileImage || moon} alt={friend.petName} className="friends-img" />
                  <p>{friend.petName}</p>
                </div>
              ))}
            </div>
            {/* 다른 친구들 버튼 */}
            <div className="friends-search-cnt">
              <img src={friendsSearchBtn} onClick={() => fetchOtherPosts()} alt="Search Button" />
              <button onClick={() => fetchOtherPosts()}>다른 친구들</button>
            </div>
          </div>
        </div>

        {/* 검색 기능 */}
        <div className="sub-container">
          <div className="search-btn">
            <input type="text" placeholder="별나라의 친구들을 찾아보세요." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <img src={searchIcon} alt="Search Icon" onClick={() => setIsSearchActive(true) || searchFriends()} />
          </div>
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
                  <div className="friend-profile" key={friend.id}>
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

        {/* 선택한 친구 정보 및 게시물 표시 */}
        <div className="friend-profile-container">
          {selectedFriend ? (
            <>
              <div className="friend-profile-header">
                <img src={selectedFriend.profileImage || moon} alt={`${selectedFriend.petName} 프로필`} className="pro-img-cnt" />
                <div className="friend-info">
                  <p className="friend-name">{selectedFriend.petName}</p>
                  <p className="friend-details">
                    {selectedFriend.category} · 생일: {selectedFriend.birthday} · 별이 된 날: {selectedFriend.starDay}
                  </p>
                </div>
                {friends.some((friend) => friend.id === selectedFriend.id) ? (
                  <button onClick={() => removeFriend(selectedFriend.id)} className="friend-unfriend-btn">
                    별나라 친구 종료하기
                  </button>
                ) : (
                  <button onClick={() => addFriend(selectedFriend.id)} className="friend-unfriend-btn">
                    별나라 친구 시작하기
                  </button>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 게시물 표시 영역 */}
        <div className="friend-profile-container">
          {posts.map((post) => (
            <div className="friend-posts" key={post.articleId}>
              {/* 다른 친구들의 게시물일 때만 작성자 정보와 친구 추가 버튼 표시 */}
              {!selectedFriend && (
                <div className="friend-profile-header">
                  <img src={post.author.profileImage || moon} alt={`${post.author.petName} 프로필`} className="author-profile-img" />
                  <div className="friend-info">
                    <p className="friend-name">{post.author.petName}</p>
                    <p className="friend-details">
                      {post.author.category} · 생일: {post.author.birthDay} · 별이 된 날: {post.author.starDay}
                    </p>
                  </div>
                  {/* 친구 추가 버튼 - 자기 자신은 표시되지 않도록 조건 추가 */}
                  {!friends.some((friend) => friend.id === post.author.userId) && post.author.userId !== userInfo.userId && (
                    <button onClick={() => addFriend(post.author.userId)} className="friend-unfriend-btn">
                      별나라 친구 시작하기
                    </button>
                  )}
                </div>
              )}

              {/* 게시물 내용 */}
              <div className="post-cnt">
                <h4>{post.title}</h4>
                <p>{post.content}</p>

                {/* 게시물 이미지 */}
                <div className="post-img-cnt">{post.images && post.images.map((image) => <img key={image.imageId} src={image.url} alt="Post" />)}</div>

                {/* 게시물 날짜 및 댓글 아이콘 */}
                <div className="post-icons-cnt">
                  <div className="post-icons">
                    <img src={mention} alt="Comment" onClick={() => handleCommentClick(post.articleId)} />
                  </div>
                  <p>{new Date(post.updatedAt).toISOString().slice(0, 10).replace(/-/g, ".")}</p>
                </div>
              </div>

              {/* 댓글 섹션 */}
              {commentOpen && selectedPostId === post.articleId && (
                <div className="comment-section">
                  <div className="comment-header">
                    <h4>마음 나누기</h4>
                    <button
                      onClick={() => {
                        setSelectedPostId(null);
                        setCommentOpen(false);
                      }}
                    >
                      x
                    </button>
                  </div>
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment.commentId} className="comment-item">
                        <img
                          src={comment.profileImage || moon}
                          alt={comment.petName || "프로필 이미지"}
                          className="comment-profile"
                          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                        />
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
                    <button onClick={handleAddComment}>댓글 달기</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsSearch;
