import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarItemWithSubmenu = ({ icon, text, submenuItems }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = submenuItems.some(item => location.pathname === item.to);

    const toggleSubmenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="sidebar-item-with-submenu">
            <div
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                onClick={toggleSubmenu}
            >
                <span className="sidebar-icon">{icon}</span>
                <span className="sidebar-text">{text}</span>
                <span className="submenu-arrow">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
            </div>

            {isOpen && (
                <div className="submenu">
                    {submenuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className={`submenu-item ${location.pathname === item.to ? 'submenu-item-active' : ''}`}
                        >
                            <span className="submenu-icon">{item.icon}</span>
                            <span className="submenu-text">{item.text}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SidebarItemWithSubmenu;