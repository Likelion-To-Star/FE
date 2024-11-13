import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function AlertMessage({ message }) {
  const [isVisible, setIsVisible] = useState(true); // 메시지 표시 여부 관리

  useEffect(() => {
    if (!message) return;

    // 3초 후에 메시지를 숨김
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트되면 타이머를 정리
  }, [message]);

  if (!isVisible || !message) return null;

  // 최상단에 메시지를 표시
  return ReactDOM.createPortal(
    <div className="alert-message">
      <strong>{message}</strong>
    </div>,
    document.body // 메시지를 최상단에 렌더링
  );
}

export default AlertMessage;

