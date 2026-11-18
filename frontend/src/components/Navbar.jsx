import React, { useEffect, useRef, useState } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import img1 from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const userRef = useRef(null);
  const { user: authUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = authUser || {
    name: 'User',
    email: 'user@expensetracker.com',
  };

  // Toggle the profile dropdown
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close the dropdown when clicking outside the box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigate to profile page
  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  // Logout
  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        {/* Left: Mobile sidebar toggle + Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className={navbarStyles.logoContainer}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') navigate('/');
            }}
          >
            <div className={navbarStyles.logoImage}>
              <img
                src={img1}
                alt="Expense Tracker logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className={navbarStyles.logoText}>Expense Tracker</span>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className={navbarStyles.userContainer} ref={userRef}>
            <button
              type="button"
              onClick={toggleMenu}
              className={navbarStyles.userButton}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              {/* Avatar and status */}
              <div className="relative">
                <div className={navbarStyles.userAvatar}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={navbarStyles.statusIndicator} />
              </div>

              {/* Name and email */}
              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.userName}>{user?.name || 'User'}</p>
                <p className={navbarStyles.userEmail}>
                  {user?.email || 'user@expensetracker.com'}
                </p>
              </div>

              {/* Dropdown arrow */}
              <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className={navbarStyles.dropdownMenu}>
                {/* User information */}
                <div className={navbarStyles.dropdownHeader}>
                  <div className="flex items-center gap-3">
                    <div className={navbarStyles.dropdownAvatar}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className={navbarStyles.dropdownName}>
                        {user?.name || 'User'}
                      </p>
                      <p className={navbarStyles.dropdownEmail}>
                        {user?.email || 'user@expensetracker.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* My Profile */}
                <div className={navbarStyles.menuItemContainer}>
                  <button
                    type="button"
                    onClick={handleProfile}
                    className={navbarStyles.menuItem}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                </div>

                {/* Logout */}
                <div className={navbarStyles.menuItemBorder}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={navbarStyles.logoutButton}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
