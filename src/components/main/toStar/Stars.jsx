import React from 'react';
import { useNavigate } from 'react-router-dom';
import MkImg from '../../../assets/img/mkCom.svg'
import Stamp from '../../../assets/img/stamp.svg'
import StampWhite from '../../../assets/img/stamp-white.svg'

const Stars = () => {
  const navigate = useNavigate();
  const handleButtonClick= ()=>{
    setTimeout(() => {
      navigate('/main/stars/letter');
    }, 100);
  }
  return (
    <div className='stars-wrap'>
      <div className='content from'>
        <img src={StampWhite} alt="stamp" className='stamp'/>
        <h1>FROM. 달이</h1>
        <h2>2024.11.16</h2>
        <p>언니, 안녕. 내가 별나라로 떠난 후에도 이렇게 따듯한 마음으로 날 생각해 줘서 고마워.여기 별나라는 따한 햇살도 가득하고 아름다워. 언니의 무릎에</p>
        <button>달이의 마음 확인하기</button>
      </div>
      <div className='content to'>
      <img src={Stamp} alt="stamp" className='stamp'/>
         <h1>TO. 달이에게</h1>
        <h2>2024.11.15</h2>
        <p>안녕 나의 소중한 달이야. 그곳은 어떠니? 별나라에서 예쁘게 빛나고 있겠지? 네가 떠난 후 시간이 많이 흘렀지만, 네가 남긴 흔적들은 여전히 내 마음속에</p>
        <button>보냈던 마음 확인하기</button>
      </div>
      <button className='mk-com' onClick={handleButtonClick}><img src={MkImg} alt="" /><p>마음보내기</p></button>
    </div>
  )
}

export default Stars
