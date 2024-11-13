import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../assets/scss/components/friends-search.scss";
import Header from "../section/Header";
import Nav from "../section/Nav";
import moon from "../../../assets/img/moon.svg";
import friends1 from "../../../assets/img/friends-1.svg";
import friends2 from "../../../assets/img/friends-2.svg";
import friends3 from "../../../assets/img/friends-3.svg";
import friends4 from "../../../assets/img/friends-4.svg";
import friendsSearchBtn from "../../../assets/img/friends/friends-search-btn.svg";
import sampleImg from "../../../assets/img/f-post-sample1.svg";
import postIcon1 from "../../../assets/img/friends/post-icon1.svg";
import searchIcon from "../../../assets/img/friends/search.svg";

const Friends = () => {
  const location = useLocation();
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 버튼 on/off
  const [selectedFriend, setSelectedFriend] = useState(null); // 선택된 친구
  const [showModal, setShowModal] = useState(false); // 모달 on/off
  const [removedFriends, setRemovedFriends] = useState([]); // 제거된 친구 목록

  // 친구 목록과 각 친구의 프로필 및 게시물 데이터
  const friendsData = {
    달이: { img: moon, name: "달이", birth: "2021.12.29", passed: "2024.02.15", posts: ["달이의 추억", "달이와의 마지막 날"] },
    미아: { img: friends1, name: "미아", birth: "2020.05.10", passed: "2023.09.05", posts: ["미아와 함께한 추억"] },
    밤이: { img: friends2, name: "밤이", birth: "2021.12.29", passed: "2024.06.30", posts: ["밤이를 처음 본 날", "밤이의 빈자리"] },
    로이: { img: friends3, name: "로이", birth: "2022.07.15", passed: "2023.11.20", posts: ["로이와의 마지막 산책"] },
    초코: { img: friends4, name: "초코", birth: "2021.03.21", passed: "2023.08.12", posts: ["초코와 함께한 소중한 시간"] },
  };

  // 검색 버튼 클릭 시 상태 변경
  const handleSearchClick = () => {
    setIsSearchActive((prev) => !prev);
    setSelectedFriend("allFriends"); // '다른 친구들' 버튼 클릭 시 전체 친구가 선택되도록 설정
  };

  // 친구 선택 시 상태 업데이트
  const handleFriendClick = (friendName) => {
    setSelectedFriend(friendName);
  };

  // 친구 종료 모달 열기
  const handleEndFriendshipClick = () => {
    setShowModal(true);
  };

  // 모달에서 "확인" 클릭 시 친구를 종료하고 슬라이드에서 제거
  const confirmEndFriendship = () => {
    setRemovedFriends((prev) => [...prev, selectedFriend]);
    setShowModal(false);
    setSelectedFriend(null);
  };

  // 모달에서 "취소" 클릭 시 모달 닫기
  const cancelEndFriendship = () => {
    setShowModal(false);
  };

  return (
    <div className="friendSrh-wrap">
      <Header />
      <Nav />
      <div className="main-container">
        <div className="main-moon-starFriends">
          <div className="slide-cnt">
            <div className="friends-with-slide">
              {/* 친구들 리스트 (첫 번째 친구는 자신, 나머지는 친구) */}
              {Object.keys(friendsData).map(
                (friend, index) =>
                  !removedFriends.includes(friend) && (
                    <div className={`friend-with-pro ${selectedFriend === friend ? "selected" : ""}`} key={friend} onClick={() => handleFriendClick(friend)}>
                      <img src={friendsData[friend].img} alt={friendsData[friend].name} className="friends-img" />
                      <p>{friendsData[friend].name}</p>
                    </div>
                  )
              )}
            </div>

            <div className="friends-search-cnt">
              <img
                src={friendsSearchBtn}
                onClick={handleSearchClick}
                alt="Search Button"
                className={`${selectedFriend === "allFriends" ? "selected" : ""}`} // '다른 친구들' 버튼 스타일 적용
              />
              <button
                onClick={handleSearchClick}
                className={`${selectedFriend === "allFriends" ? "selected" : ""}`} // '다른 친구들' 버튼 스타일 적용
              >
                다른 친구들
              </button>
            </div>
          </div>
        </div>

        <div className="sub-container">
          <div className="search-btn">
            <input type="text" placeholder="별나라의 친구들을 찾아보세요." />
            <img src={searchIcon} alt="Search Icon" onClick={handleSearchClick} />
          </div>

          {selectedFriend && selectedFriend !== "allFriends" ? (
            // 선택된 친구의 프로필과 게시물 표시
            <div className="friend-profile-container">
              <div className="friend-profile-header">
                <img src={friendsData[selectedFriend].img} alt={`${selectedFriend} 프로필`} />
                <div className="friend-info">
                  <p className="friend-name">{friendsData[selectedFriend].name}</p>
                  <p className="friend-details">
                    생일: {friendsData[selectedFriend].birth} · 별이 된 날: {friendsData[selectedFriend].passed}
                  </p>
                </div>
                {/* 첫 번째 친구가 아닌 경우에만 "별나라 친구 종료하기" 버튼 표시 */}
                {selectedFriend !== "달이" && (
                  <button onClick={handleEndFriendshipClick} className="end-friendship-btn">
                    별나라 친구 종료하기
                  </button>
                )}
              </div>
              <div className="friend-posts">
                {friendsData[selectedFriend].posts.map((post, index) => (
                  <div className="post-cnt" key={index}>
                    <h4>{post}</h4>
                    <p>게시물 내용 예시</p>
                    <div className="post-img-cnt">
                      <img src={sampleImg} alt="예시 이미지" />
                    </div>
                    <div className="post-icons-cnt">
                      <div className="post-icons">
                        <img src={postIcon1} alt="Comment" />
                      </div>
                      <p>2024.08.17</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isSearchActive ? (
            // 검색된 친구들 프로필 리스트
            <div className="friends-list">
              <div className="friend-profile">
                <img src={friends1} className="friends-img" alt="토토 프로필" />
                <div className="friend-info">
                  <p className="friend-name">토토</p>
                  <p className="friend-details">토끼 · 생일 2018.03.28 · 별이 된 날 2024.06.30</p>
                </div>
              </div>
              <div className="friend-profile">
                <img src={friends2} className="friends-img" alt="토토 프로필" />
                <div className="friend-info">
                  <p className="friend-name">토토</p>
                  <p className="friend-details">토끼</p>
                </div>
              </div>
            </div>
          ) : (
            // 기본 게시물 표시
            <div className="post-cnt">
              <div className="post-friend-pro">
                <img src={friends1} alt="예시 친구 프로필" />
                <p>동동이</p>
              </div>
              <h4>다른 친구들 게시물 제목</h4>
              <p>다른 친구들 게시물 내용</p>
              <div className="post-img-cnt">
                <img src={sampleImg} alt="예시 이미지" />
              </div>
              <div className="post-icons-cnt">
                <div className="post-icons">
                  <img src={postIcon1} alt="Comment" />
                </div>
                <p>날짜</p>
              </div>
            </div>
          )}
        </div>

        {/* 모달창 */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>정말로 별나라 친구를 그만하시겠습니까?</p>
              <div className="end-btn">
                <button onClick={confirmEndFriendship} className="end-yes">
                  확인
                </button>
                <button onClick={cancelEndFriendship} className="end-no">
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
