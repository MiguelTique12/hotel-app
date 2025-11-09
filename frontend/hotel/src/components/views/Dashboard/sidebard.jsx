import React from 'react';
import { Link } from 'react-router-dom';

// Componente para elementos de la sidebar
const SidebarItem = ({ icon, text, to, active = false }) => {
  return (
    <Link 
      to={to}
      className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
    >
      <span className="sidebar-icon">{icon}</span>
      {text}
    </Link>
  );
};

export default SidebarItem;