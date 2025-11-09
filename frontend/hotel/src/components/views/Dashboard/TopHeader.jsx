import React, { useState } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';

const TopHeader = ({ pageTitle, toggleSidebar, sidebarOpen }) => {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
      <header className="top-header">
        <div className="header-container">
          <div className="header-left">
            <button
                className="menu-button"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="page-title">{pageTitle}</h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                  type="text"
                  placeholder="Buscar..."
                  className="search-input"
              />
            </div>
            <button
                className="notification-button"
                aria-label="Notificaciones"
            >
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div
                  className="user-avatar"
                  onClick={toggleLogoutMenu}
                  title="Opciones de usuario"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && toggleLogoutMenu()}
              >
                U
              </div>
              {showLogoutMenu && (
                  <div className="logout-dropdown">
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default TopHeader;