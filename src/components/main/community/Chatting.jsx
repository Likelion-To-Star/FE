import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import Send from '../../../assets/img/send.svg';
import Profile from '../../../assets/img/profile.png';
import AlertWhen from "../../Util/AlertWhen";

const Chatting = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('연결되지 않음');
  const [chatMessages, setChatMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const stompClient = useRef(null);
  const isConnecting = useRef(false);
  const subscriptionId = useRef(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] =useState(false);
  const [sending,setSending] = useState(false);

  const userName = localStorage.getItem("userName");
  const userEmail =  localStorage.getItem("userEmail");
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const chatRoomId = localStorage.getItem("ComId");
  const jwtToken = localStorage.getItem("token");
  
  useEffect(() => {
    console.log("ChatRoom 컴포넌트 mounted");
    
    // 기존 메시지 가져오기
    fetchChatHistory();

    if (!stompClient.current && !isConnecting.current) {
      console.log("connectToChatRoom 호출 준비 완료 - 현재 stompClient는 초기화되지 않음");
      connectToChatRoom();
    } else {
      console.log("stompClient가 이미 초기화된 상태 또는 연결 중 상태 - 연결 생략");
    }

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      if (subscriptionId.current) {
        console.log("뒤로가기 - 구독만 해제");
        stompClient.current.unsubscribe(subscriptionId.current);
        subscriptionId.current = null;
      }
    };
  }, [chatRoomId]);

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
      setError(true);
    }
  };


  const connectToChatRoom = () => {
    if (isConnecting.current || (stompClient.current && stompClient.current.connected)) {
      console.log("이미 연결 중이거나 연결된 상태이므로 새로운 연결을 생성하지 않음");
      return;
    }

    console.log("소켓 연결 시도 중...");
    isConnecting.current = true; // 연결 시도 중 상태 설정
    const socketUrl = baseURL + `/ws/chat`;
    const client = Stomp.over(() => new SockJS(socketUrl));

    client.connect(
      { 'Authorization': `${jwtToken}` },
      () => {
        setConnectionStatus('연결 성공!');
        stompClient.current = client;
        isConnecting.current = false; // 연결 성공 후 상태 해제
        console.log("WebSocket 연결 성공 및 구독 시작");
        setLoading(false);
        

        // 구독 및 ID 저장
        subscriptionId.current = client.subscribe(`/topic/chatroom/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("새로운 메시지 수신:", receivedMessage);
          setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }).id;
      },
      (error) => {
        console.error("소켓 연결 실패:", error);
        setError(true); 

        setConnectionStatus('연결 실패');
        isConnecting.current = false; // 연결 실패 후 상태 해제
      }
    );
  };
  // 메시지 전송 함수
  const sendMessage = () => {
    setSending(true);
    console.log("chatMessages",chatMessages);
    if (stompClient.current && stompClient.current.connected && messageContent.trim() !== '') {
      const chatMessage = {
        chatRoomId: chatRoomId,
        content: messageContent,
      };
      stompClient.current.send(`/app/chat.sendMessage`, { 'Authorization': jwtToken }, JSON.stringify(chatMessage));
      setSending(false);
      setMessageContent('');
      console.log("메시지 전송:", chatMessage);
    } else {
      console.log("메시지 전송 실패 - stompClient가 연결되지 않았거나 메시지가 비어 있음");
      setError(true);
    }
  };

// 입장 & 퇴장 알림용
function EntryExitMessage({ message }) {
  return (
    <div className="entry-exit-message">
      <strong>{message.content}</strong>
    </div>
  );
}

// 전달받은 메시지
function IncomingMessage({ message }) {
  return (
    <div className='one-chat'>
      <div className='img-wrap'><img src={message.profileImage===null?Profile:message.profileImage} alt="" /></div>
      <div className="nameAND">
        <h1>{message.petName}</h1>
        <div className='other-container'>
          <div className='other'>
            <p >{message.content}</p>
          </div>
        </div>
      </div>
    </div>

  );
}

// 전송한 메시지 (나의 메시지)
function OutgoingMessage({ message }) {
  return (
    <div className='me-container'>
            <div className='me'><p><strong>나:</strong> {message.content}</p></div>
    </div>
  );
}


  return (
    <div className='chat-wrap'>
       {loading ? (
      <div className="alert-chat">
        소중한 기억을 나눌 수 있도록 반짝이는 기억들을 준비하고 있어요.
      </div>
    ) : (
      <div className={`alert-chat fade-out`}>
        연결되었습니다. 이제 소중한 기억들을 함께 나누어 봐요!
      </div>
    )}
      {error && <AlertWhen message="별나라에서 추억을 불러오는 중이에요. 다시 한번 시도해 주세요." />}
      <div className='chat-flat'>
      {chatMessages.map((msg, index) => {
          if (msg.messageType === "ANNOUNCE") {
            return <EntryExitMessage key={index} message={msg} />;
          } else if (msg.messageType === "TALK" && msg.email !== userEmail) {
            return <IncomingMessage key={index} message={msg} />;
          } else if (msg.messageType === "TALK" && msg.email === userEmail) {
            return <OutgoingMessage key={index} message={msg} />;
          }
          return null;
        })}
  </div>
      <div className='enter-chat'>
        <div className='input-wrap'>
          <textarea
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder={sending ? "달이의 소중한 기억을 전하고 있어요. 조금만 기다려주세요..." : "메시지를 입력하세요"} // sending에 따라 다른 placeholder
            disabled={sending}
          />
          <button onClick={sendMessage}>
            <img src={Send} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
