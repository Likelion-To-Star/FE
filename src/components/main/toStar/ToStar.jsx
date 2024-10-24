import React from 'react';
import Header from '.././section/Header';
import LetterDesign from '../../../assets/img/letter.svg';

const ToStar = () => {
    return (
        <div className='tostar-wrap'>
          <Header />
          <div className='write'>
            <div className='text'>
            안녕, 나의 소중한 달이야. 그곳은 어떠니? 별나라에서 예쁘게 빛나고 있겠지? 네가 떠난 후 시간이 많이 흘렀지만, 네가 남긴 흔적들은 여전히 내 마음속에 선명하게 남아 있어. 함께했던 소중한 순간들 하나하나가 나에게는 너무 소중하고 잊을 수 없는 추억이 되었어. 네가 가끔 내 무릎에 올라와 부드럽게 몸을 말고 앉아 있던 그 느낌이 아직도 생생해. 네가 없는 집은 참 조용해졌어. 네가 발소리를 내며 다가와 나를 쳐다보던 눈빛도, 가끔 장난스럽게 꼬리를 흔들던 모습도 너무 그리워. 이제는 너의 자리가 비어있지만, 그 자리는 언제나 네 것이야. 별나라에서는 아프지 않고, 마음껏 뛰어다니고 있겠지? 너무 보고싶다.
            </div>
            <img src={LetterDesign} alt="테두리장식" className='bk-img' />
          </div>
        </div>
      );
    };
    

export default ToStar
