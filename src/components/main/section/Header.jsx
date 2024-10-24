import React from 'react'
import Logo from '../../../assets/img/upper-logo.svg'
import Mypage from '../../../assets/img/mypage.svg'
import BackBtn from '../../../assets/img/back-btn.svg';
const Header = () => {
  return (
    <div className='header-wrap'>
      
        <div className='hd-title'>
        <button className='bk'><img src={BackBtn} alt="뒤로가기" className='back-btn'/></button>
            <img className="logo"src={Logo} alt="logo" />
            <button className='my'><img src={Mypage} alt="Tomypage" /></button>
        </div>
    </div>
  )
}

export default Header
