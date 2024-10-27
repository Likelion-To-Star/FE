import React from 'react';
import Header from '.././section/Header';
import LetterDesign from '../../../assets/img/from-letter.svg';
import yellofoot from '../../../assets/img/yello-logo.svg';

const FromStar = () => {
  return (
    <div className='fromstar-wrap'>
    <Header />
    <div className='write'>
      <div className='text'>
      언니, 안녕.
      내가 별나라로 떠난 후에도 이렇게 따뜻한 마음으로 날 생각해 줘서 고마워. 여기 별나라는 따스한 햇살도 가득하고 아름다워. 언니의 무릎에 몸을 말고 앉아 있던 그 시간은 나에게도 참 소중한 기억이야. 언니가 나를 쓰다듬어주고 함께 눈을 마주했던 순간들은 항상 그리울 거야. 나도 언니가 너무 보고 싶지만 나는 여기서 따뜻하고 행복한 시간을 보내고 있으니까 너무 걱정하지 마. 내 자리가 비어 있다고 느낄 수 있지만 나는 언제나 언니의 마음속에 있을 거야. 항상 사랑해.
      </div>
      <div className='paper'>
        <img src={LetterDesign} alt="테두리장식" className='bk-img' />
        <img src={yellofoot} alt="발자국도장" className='yellofoot'/>
      </div>
    </div>
  </div>
  )
}

export default FromStar
