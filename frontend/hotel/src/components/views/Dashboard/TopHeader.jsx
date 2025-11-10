import React, { useState } from 'react';
import { Menu, X, Search, Bell, Play } from 'lucide-react';

const TopHeader = ({ pageTitle, toggleSidebar, sidebarOpen }) => {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const toggleVideoModal = () => {
    setShowVideoModal(!showVideoModal);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
      <>
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
              <button
                  className="notification-button"
                  aria-label="Ver video sobre Calidad de Software"
                  onClick={toggleVideoModal}
              >
                <Bell size={20} />
                <span className="notification-badge">1</span>
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

        {/* Modal del Video */}
        {showVideoModal && (
            <div className="video-modal-overlay" onClick={toggleVideoModal}>
              <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="video-modal-header">
                  <h2 className="video-modal-title">
                    <Play size={24} />
                    <span>Calidad de Software - Video Educativo</span>
                  </h2>
                  <button
                      className="video-modal-close"
                      onClick={toggleVideoModal}
                      aria-label="Cerrar"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="video-modal-body">
                  <div className="video-container">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/noIC94DJ7wM?autoplay=1"
                        title="Calidad de Software"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-description">
                    <p>
                      En este video explicamos qué es la calidad de software, su importancia en proyectos reales,
                      y evaluamos la plataforma educativa Platzi aplicando estándares ISO/IEC 25010.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default TopHeader;