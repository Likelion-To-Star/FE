import React from 'react';
import Header from './section/Header';
import Nav from './section/Nav';
import { Outlet } from 'react-router-dom';

const Main = () => {
  return (
    <div className='main-wrap'>
        <Header />
        <Nav />
        <Outlet />
    </div>
  );
}

export default Main;

