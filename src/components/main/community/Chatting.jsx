import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Send from '../../../assets/img/send.svg';

const Chatting = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('연결되지 않음');
  const [entryMessage, setEntryMessage] = useState(''); // 입장 메시지를 상태로 저장

  const userEmail = sessionStorage.getItem("userEmail");
  const stompClient = useRef(null);
  const isConnecting = useRef(false);
  const subscriptionId = useRef(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const chatRoomId = localStorage.getItem("ComId");
  const token = localStorage.getItem("token");

  const jwtToken = token;

  // 기존 채팅 이력 가져오는 함수
  const fetchChatHistory = async () => {
    try {
      console.log("기존 메시지 가져오는 중...");
      const response = await axios.get(baseURL + `/api/chat/${chatRoomId}`, {
        headers: {
          Authorization: jwtToken,
        },
      });

      if (response.data.isSuccess) {
        console.log("기존 메시지 가져오기 성공:", response.data.result);
        setChatMessages(response.data.result);
      } else {
        console.error("기존 메시지 가져오기 실패:", response.data.message);
      }
    } catch (error) {
      console.error("기존 메시지 가져오는 중 오류 발생:", error);
    }
  };
  // 채팅방 연결 및 초기화
  useEffect(() => {
    if (!token) {
      alert("토큰이 존재하지 않습니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    const connectToChatRoom = () => {
      if (isConnecting.current || (stompClient.current && stompClient.current.connected)) return;

      isConnecting.current = true;
      const socketUrl = baseURL + `/ws/chat`;
      const client = Stomp.over(() => new SockJS(socketUrl));

      client.connect(
        { 'Authorization': jwtToken },
        () => {
          stompClient.current = client;
          setConnectionStatus('연결 성공!');
          isConnecting.current = false;

          // 입장 메시지 저장
          const entryMessage = `${userEmail}님이 입장했습니다.`;
          setEntryMessage(entryMessage); // 입장 메시지를 상태로 저장

          // 채팅방에 입장 메시지를 전송
          const entryMessageData = {
            chatRoomId: chatRoomId,
            content: entryMessage,
            messageType: "ANNOUNCE",
          };
          stompClient.current.send(`/app/chat.sendMessage`, { 'Authorization': jwtToken }, JSON.stringify(entryMessageData));

          // 메시지 구독
          subscriptionId.current = client.subscribe(`/topic/chatroom/${chatRoomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }).id;
        },
        (error) => {
          console.error("WebSocket 연결 실패:", error);
          setConnectionStatus('연결 실패');
          isConnecting.current = false;
        }
      );
    };

    if (!stompClient.current && !isConnecting.current) {
      fetchChatHistory();
      connectToChatRoom();
    }

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      if (subscriptionId.current) {
        stompClient.current.unsubscribe(subscriptionId.current);
        subscriptionId.current = null;
      }
    };
  }, [chatRoomId, token]);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected && messageContent.trim() !== '') {
      const chatMessage = {
        chatRoomId: chatRoomId,
        content: messageContent,
      };
      stompClient.current.send(`/app/chat.sendMessage`, { 'Authorization': jwtToken }, JSON.stringify(chatMessage));
      setMessageContent(''); // 입력 필드 초기화
    }
  };

  // 메시지 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    setMessageContent(e.target.value);
  };

  // 메시지 전송 버튼 클릭 핸들러
  const handleSendClick = () => {
    sendMessage();
  };

  return (
    <div className='chat-wrap'>
      <div className="connection-status">{connectionStatus}</div>
      <div className='chat-flat'>
      {chatMessages.map((msg, index) => (
    msg.messageType === "ANNOUNCE" ? (
      // ANNOUNCE 타입일 때는 입장 메시지를 h1로 표시
      <h1 key={index}>{msg.content}</h1>
    ) : (
      // TALK 타입일 때는 일반 메시지 렌더링
      <div key={index} className={msg.email === userEmail ? 'me-container' : 'other-container'}>
        <div className={msg.email === userEmail ? 'me' : 'other'}>
          <p>{msg.content}</p>
        </div>
      </div>
    )
  ))}
  </div>
      <div className='enter-chat'>
        <div className='input-wrap'>
          <input
            type="text"
            value={messageContent}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요"
          />
          <button onClick={handleSendClick}>
            <img src={Send} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
