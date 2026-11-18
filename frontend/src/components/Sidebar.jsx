import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { sidebarStyles, cn } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Income', path: '/income', icon: TrendingUp },
  { name: 'Expenses', path: '/expenses', icon: TrendingDown },
  { name: 'Profile', path: '/profile', icon: User },
];

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          sidebarStyles.sidebarContainer.base,
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={sidebarStyles.toggleButton.base}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* User Profile Summary */}
          <div
            className={cn(
              sidebarStyles.userProfileContainer.base,
              collapsed
                ? sidebarStyles.userProfileContainer.collapsed
                : sidebarStyles.userProfileContainer.expanded
            )}
          >
            <div className="flex items-center gap-3">
              <div className={sidebarStyles.userInitials.base}>
                {userInitial}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-800 truncate">
                    {user?.name || 'User'}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className={cn(sidebarStyles.menuList.base, 'flex-1 py-4')}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      sidebarStyles.menuItem.base,
                      isActive
                        ? sidebarStyles.menuItem.active
                        : sidebarStyles.menuItem.inactive,
                      collapsed
                        ? sidebarStyles.menuItem.collapsed
                        : sidebarStyles.menuItem.expanded
                    )
                  }
                  title={collapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0',
                          isActive
                            ? sidebarStyles.menuIcon.active
                            : sidebarStyles.menuIcon.inactive
                        )}
                      />
                      {!collapsed && <span>{item.name}</span>}
                      {isActive && !collapsed && (
                        <div className={sidebarStyles.activeIndicator} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer / Logout */}
          <div
            className={cn(
              sidebarStyles.footerContainer.base,
              collapsed
                ? sidebarStyles.footerContainer.collapsed
                : sidebarStyles.footerContainer.expanded
            )}
          >
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                sidebarStyles.logoutButton.base,
                collapsed ? sidebarStyles.logoutButton.collapsed : 'px-4'
              )}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={sidebarStyles.mobileMenuButton}
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className={sidebarStyles.mobileOverlay}>
          <div
            className={sidebarStyles.mobileBackdrop}
            onClick={() => setMobileOpen(false)}
          />
          <div className={sidebarStyles.mobileSidebar.base}>
            {/* Mobile Header */}
            <div className={sidebarStyles.mobileHeader}>
              <div className="flex items-center gap-3">
                <div className={sidebarStyles.userInitials.base}>
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">
                    {user?.name || 'User'}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className={sidebarStyles.mobileCloseButton}
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Mobile Menu List */}
            <nav className={cn(sidebarStyles.mobileMenuList, 'p-4')}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        sidebarStyles.mobileMenuItem.base,
                        'rounded-xl',
                        isActive
                          ? sidebarStyles.mobileMenuItem.active
                          : sidebarStyles.mobileMenuItem.inactive
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className={sidebarStyles.mobileFooter}>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className={sidebarStyles.mobileLogoutButton}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
