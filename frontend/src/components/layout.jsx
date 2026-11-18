import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styles } from '../assets/dummyStyles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.layout.root}>
      <Navbar onToggleSidebar={() => setMobileOpen(true)} />
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className={styles.layout.mainContainer(collapsed)}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
