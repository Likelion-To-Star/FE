import React from 'react'
import Send from '../../../assets/img/send.svg'
//innerText로 p태그 내용 바꿀 것이므로 상관없다

const Chatting = () => {
  return (
    <div className='chat-wrap'>
        <div className='chat-flat'>
        <div className='me-container'>
            <div className='me'><p>안녕하세요. 최근 달이가 별나라로 가고 펫로스를 경험하게 되었어요. 요즘 너무 우울하고 무기력하더라고요.. 그러다가 반짝이는 기억들을 발견하고 들어오게 되었습니다!</p>
            </div>
        </div>
        <div className='other-container'>
            <div className='other'>
            <p>안녕하세요. 
                최근 달이가 별나라에 갔다니 너무 힘드시겠어요. 달이는 별나라에 가서 친구들이랑 잘 지내고 있을 거예요.</p>
            </div>
      </div>
        </div>
      <div className='enter-chat'>
        <div className='input-wrap'>
            <input type="text" />
            <button> <img src={Send} alt="send" /></button>
        </div>
      </div>
    </div>
  )
}

export default Chatting
