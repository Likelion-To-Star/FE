import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../assets/scss/components/friends.scss";
import Header from "../section/Header";
import Nav from "../section/Nav";
import moon from "../../../assets/img/moon.svg";
import memory from "../../../assets/img/friends/memory.svg";
import friends1 from "../../../assets/img/friends-1.svg";
import friends2 from "../../../assets/img/friends-2.svg";
import friends3 from "../../../assets/img/friends-3.svg";
import friends4 from "../../../assets/img/friends-4.svg";
import newFriends from "../../../assets/img/new-friends.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import postIcon2 from "../../../assets/img/friends/post-icon2.svg";
import postIcon3 from "../../../assets/img/friends/post-icon3.svg";

const Friends = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const newPost = location.state?.newPost;

  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});
  const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] = useState(false);
  const [commentToDeleteIndex, setCommentToDeleteIndex] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);

  useEffect(() => {
    if (newPost) {
      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    }
  }, [newPost]);

  const handleMemory = () => {
    navigate("/friends/newpost");
  };

  const handelFriendsSearch = () => {
    navigate("/friends/frinedsSearch");
  };

  const openModal = (index) => {
    setPostToDelete(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  const confirmDelete = () => {
    if (postToDelete !== null) {
      const updatedPosts = posts.filter((_, idx) => idx !== postToDelete);
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      closeModal();
    }
  };

  const openCommentSection = (index) => {
    setSelectedPostIndex(index);
    setIsCommentSectionOpen(true);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const updatedComments = { ...comments };
      updatedComments[selectedPostIndex] = [...(updatedComments[selectedPostIndex] || []), comment];
      setComments(updatedComments);
      setComment("");
    }
  };

  const openCommentDeleteModal = (commentIndex) => {
    setCommentToDeleteIndex(commentIndex);
    setIsCommentDeleteModalOpen(true);
  };

  const closeCommentDeleteModal = () => {
    setIsCommentDeleteModalOpen(false);
    setCommentToDeleteIndex(null);
  };

  const confirmCommentDelete = () => {
    if (commentToDeleteIndex !== null) {
      const updatedComments = { ...comments };
      updatedComments[selectedPostIndex] = updatedComments[selectedPostIndex].filter((_, idx) => idx !== commentToDeleteIndex);
      setComments(updatedComments);
      closeCommentDeleteModal();
    }
  };

  return (
    <div className="main-wrap">
      <div className="main-container">
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              {/* 친구들 리스트 */}
              <div className="moon-pro">
                <img src={moon} className="moon-img" alt="달이" />
                <p>달이</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends1} className="friends-img" alt="미아" />
                <p>미아</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends2} className="friends-img" alt="밤이" />
                <p>밤이</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends3} className="friends-img" alt="로이" />
                <p>로이</p>
              </div>
              <div className="friend-with-pro">
                <img src={friends4} className="friends-img" alt="초코" />
                <p>초코</p>
              </div>
            </div>
            <div className="new-friends-cnt" onClick={handelFriendsSearch}>
              <img src={newFriends}></img>
              <button>다른 친구들</button>
            </div>
          </div>
        </div>
        <div className="pro-cnt">
          <div className="pro-img-cnt">
            <img src={moon} alt="Profile" />
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

        {/* 게시물 표시 */}
        {posts.map((post, index) => (
          <div key={index} className="post-cnt">
            <h4>{post.title}</h4>
            <p>{post.description}</p>
            <div className="post-img-cnt">
              {post.images.map((image, idx) =>
                typeof image === "object" && image instanceof File ? (
                  <img key={idx} src={URL.createObjectURL(image)} alt="Post" />
                ) : (
                  <img key={idx} src={image} alt="Post" />
                )
              )}
            </div>
            <div className="post-icons-cnt">
              <div className="post-icons">
                <img src={postIcon1} alt="Comment" onClick={() => openCommentSection(index)} />
                <img src={postIcon2} alt="Icon2" />
                <img src={postIcon3} alt="Delete" onClick={() => openModal(index)} />
              </div>
              <p>날짜</p>
            </div>
          </div>
        ))}

        {/* 댓글 입력을 위한 마음 나누기 컨테이너 */}
        {isCommentSectionOpen && (
          <div className="comment-section">
            <div className="comment-header">
              <h4>마음 나누기</h4>
              <button onClick={() => setIsCommentSectionOpen(false)}>X</button>
            </div>
            <div className="comments-list">
              {comments[selectedPostIndex]?.map((comment, idx) => (
                <div key={idx} className="comment-item">
                  <p>{comment}</p>
                  <div className="comments-icons-cnt">
                    <img src={postIcon2} alt="Icon2" />
                    <img src={postIcon3} alt="Delete Comment" onClick={() => openCommentDeleteModal(idx)} />
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="댓글을 입력하세요" />
              <button onClick={handleCommentSubmit}>등록</button>
            </div>
          </div>
        )}

        {/* 게시물 삭제 확인 모달 */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <p>정말로 게시물을 삭제하시겠습니까?</p>
              <button className="modal-yes" onClick={confirmDelete}>
                확인
              </button>
              <button className="modal-no" onClick={closeModal}>
                취소
              </button>
            </div>
          </div>
        )}

        {/* 댓글 삭제 확인 모달 */}
        {isCommentDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <p>정말로 댓글을 삭제하시겠습니까?</p>
              <button className="modal-yes" onClick={confirmCommentDelete}>
                확인
              </button>
              <button className="modal-no" onClick={closeCommentDeleteModal}>
                취소
              </button>
            </div>
          </div>
        )}

        {/* 메모리 아이콘 클릭 시 NewPost 페이지로 이동 */}
        <img src={memory} className="memory-fixed" onClick={handleMemory} alt="Memory" />
      </div>
    </div>
  );
};

export default Friends;
