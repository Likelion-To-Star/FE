import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../assets/scss/components/friends-search.scss";
import Header from "../section/Header";
import Nav from "../section/Nav";
import moon from "../../../assets/img/moon.svg";
import friendsSearchBtn from "../../../assets/img/friends/friends-search-btn.svg";
import searchIcon from "../../../assets/img/friends/search.svg";
import noresult from "../../../assets/img/friends/no-results-icon.svg";
import mention from "../../../assets/img/friends/post-icon1.svg";

const FriendsSearch = () => {
  const location = useLocation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [otherPosts, setOtherPosts] = useState([]); // 친구가 아닌 사용자들의 게시물 목록
  const [friends, setFriends] = useState([]); // 친구 목록
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {}); // 회원 정보
  const [isCommenting, setIsCommenting] = useState(false); // 댓글 입력란 표시 여부
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
  const [temporaryComments, setTemporaryComments] = useState([]); // 댓글 입력 창 내부에서만 보이는 댓글 목록
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // 친구 목록 불러오기
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/user/friend`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isSuccess) {
          setFriends(data.result); // 친구 목록 저장
        } else {
          console.error("친구 목록 조회 실패:", data.message);
        }
      } else {
        console.error("응답 오류:", response.statusText);
      }
    } catch (error) {
      console.error("친구 목록 조회 오류:", error);
    }
  };

  // 친구가 아닌 사용자들의 게시물 조회
  const fetchOtherPosts = async (page = 1, size = 5) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/articles/others?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isSuccess) {
          setOtherPosts(data.result);
        } else {
          console.error("게시물 조회 실패:", data.message);
          setOtherPosts([]);
        }
      } else {
        console.error("응답 오류:", response.statusText);
      }
    } catch (error) {
      console.error("친구가 아닌 사용자 게시물 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchFriends(); // 친구 목록 불러오기
    fetchOtherPosts(); // 친구가 아닌 사용자들의 게시물 조회
  }, []);

  const handleSearchClick = () => {
    setIsSearchActive(true);
    searchFriends();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchFriends = async () => {
    const token = localStorage.getItem("token");

    if (!searchTerm) {
      console.log("검색어가 비어 있습니다.");
      setNoResults(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/search?name=${encodeURIComponent(searchTerm)}&page=1&size=5`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isSuccess && data.result.length > 0) {
          setSearchResults(data.result);
          setNoResults(false);
        } else {
          setSearchResults([]);
          setNoResults(true);
        }
      } else {
        console.error("응답 오류:", response.statusText);
        setNoResults(true);
      }
    } catch (error) {
      console.error("친구 검색 오류:", error);
      setNoResults(true);
    }
  };

  const handleCommentClick = () => {
    setIsCommenting(true); // 댓글 입력란 표시
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // 임시 댓글 목록에 추가
      setTemporaryComments((prevComments) => [...prevComments, { author: userInfo.petName, content: newComment, profileImage: userInfo.profileImage || moon }]);
      setNewComment("");
      setIsCommenting(false); // 댓글 입력란 숨기기
    }
  };

  return (
    <div className="main-wrap">
      <div className="main-container">
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              {/* 회원의 이미지와 이름 표시 */}
              <div className="moon-pro">
                <img src={userInfo.profileImage || moon} alt="Profile" className="moon-img" />
                <p>{userInfo.petName || "내 이름"}</p>
              </div>
              {/* 친구 목록 이미지 슬라이드 */}
              {friends.map((friend) => (
                <div className="friend-with-pro" key={friend.id}>
                  <img src={friend.profileImage || moon} alt={friend.petName} className="friends-img" />
                  <p>{friend.petName}</p>
                </div>
              ))}
            </div>
            <div className="friends-search-cnt">
              <img src={friendsSearchBtn} onClick={handleSearchClick} alt="Search Button" />
              <button onClick={handleSearchClick}>다른 친구들</button>
            </div>
          </div>
        </div>

        <div className="sub-container">
          <div className="search-btn">
            <input type="text" placeholder="별나라의 친구들을 찾아보세요." value={searchTerm} onChange={handleSearchChange} />
            <img src={searchIcon} alt="Search Icon" onClick={handleSearchClick} />
          </div>
          {isSearchActive ? (
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
          ) : (
            <div className="other-posts">
              {otherPosts.map((post) => (
                <div className="post-cnt" key={post.articleId}>
                  <div className="post-friend-pro">
                    <img src={post.author.profileImage || moon} alt={`${post.author.petName} 프로필`} />
                    <p>{post.author.petName}</p>
                  </div>
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                  <div className="post-img-cnt">{post.images && post.images.map((image) => <img key={image.imageId} src={image.url} alt="Post" />)}</div>

                  <div className="post-icons-cnt">
                    <div className="post-icons">
                      <img src={mention} alt="댓글 쓰기" onClick={handleCommentClick} />
                    </div>
                    <p>{new Date(post.updatedAt).toISOString().slice(0, 10).replace(/-/g, ".")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 댓글 입력란과 임시 댓글 표시 */}
        {isCommenting && (
          <div className="comment-input-section">
            <input type="text" value={newComment} onChange={handleCommentChange} placeholder="댓글을 입력하세요..." className="comment-input" />
            <button onClick={handleCommentSubmit} className="comment-submit-btn">
              전송
            </button>
          </div>
        )}

        {/* 임시 댓글 표시 영역 */}
        <div className="temporary-comments">
          {temporaryComments.map((comment, index) => (
            <div key={index} className="comment">
              <img src={comment.profileImage} alt={comment.author} className="comment-author-img" />
              <div className="comment-content">
                <p className="comment-author">{comment.author}</p>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsSearch;
