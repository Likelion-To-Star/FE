import React from 'react'
import ReactDOM from "react-dom";

function AlertMessage({ message }) {
  if (!message) return null;

  // 최상단에 메시지를 표시
  return ReactDOM.createPortal(
    <div className="alert-message">
      <strong>{message}</strong>
    </div>,
    document.body // 메시지를 최상단에 렌더링
  );
}

export default AlertMessage;

