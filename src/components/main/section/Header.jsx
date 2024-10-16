import React from 'react'
import Logo from '../../../assets/img/upper-logo.svg'
import Mypage from '../../../assets/img/mypage.svg'

const Header = () => {
  return (
    <div className='header-wrap'>
        <div className='hd-title'>
            <img className="logo"src={Logo} alt="logo" />
            <button><img src={Mypage} alt="Tomypage" /></button>
        </div>
    </div>
  )
}

export default Header
