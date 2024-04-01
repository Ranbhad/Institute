// Layout.js

import React from 'react';
import PersistentDrawerLeft from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <PersistentDrawerLeft /> {/* Render the navbar */}
      {children} {/* Render the content of the current page */}
    </>
  );
};

export default Layout;
