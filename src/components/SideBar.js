import React from 'react';


const SideBar = ({ active, toggleActive }) => (
    <div id="side-bar">
      <button className={active === 'GENERAL' ? 'active' : 'inactive'}
              onClick={() => {toggleActive('GENERAL')}}>General</button>
      <button className={active === 'BLOG' ? 'active' : 'inactive'}
              onClick={() => {toggleActive('BLOG')}}>Blog</button>
      <button className={active === 'PASSWORD' ? 'active' : 'inactive'}
              onClick={() => {toggleActive('PASSWORD')}}>Password</button>
    </div>
);

export default SideBar;