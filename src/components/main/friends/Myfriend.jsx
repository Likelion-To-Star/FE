import React, { useEffect } from 'react'

const Myfriend = () => {
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
    const [selectedProfile, setSelectedProfile] = useState('myProfile');
  // 내 게시물 조회
  const fetchOMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/articles/user`, {
        headers: { Authorization: token },
        params: {
          page: 0,
          size: 5,
        },
      });
      if (response.data.result) {
        setPosts(response.data.result);
        setMyId(response.data.result[0].author.userId);
      } else {
        setPosts([]);
      }

      if (response.data.isSuccess !== true) {
        alert("로그인 다시 해주세요");
      }
    } catch (error) {
      console.error("내 게시물 조회 오류:", error.response || error);
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

    useEffect(()=>{
        fetchOMyPosts();
    })
  return (
    <div>
      
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
                  <img src={postIcon3} alt="Delete" onClick={() => openModal(post.articleId)} />
                </div>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>게시물이 없습니다.</p>
        )}
    </div>
  )
}

export default Myfriend
