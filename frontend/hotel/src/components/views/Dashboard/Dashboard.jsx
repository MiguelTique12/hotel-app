import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Hotel,
  DollarSign,
  Star,
  X,
  Building2,
  Bed,
  Plus,
  List
} from 'lucide-react';
import '../../styles/main/main.css';

import SidebarItem from './sidebard';
import SidebarItemWithSubmenu from '../../utils/SidebarItemWithSubmenu';
import TopHeader from './TopHeader';

const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname;

    switch(path) {
      case '/usuarios':
        return 'Registro de Usuarios';
      case '/hotel':
        return 'Registrar Hotel';
      case '/hoteles':
        return 'Gestión de Hoteles';
      case '/habitacion':
        return 'Registro de Habitación';
      case '/alquiler':
        return 'Registro de Ventas';
      case '/dashboard':
        return 'Panel de Control';
      default:
        if (path.startsWith('/hoteles/')) {
          return 'Detalle del Hotel';
        }
        return 'Panel de Control';
    }
  };

  const hotelSubmenuItems = [
    {
      icon: <Plus size={18} />,
      text: 'Registrar Hotel',
      to: '/hotel'
    },
    {
      icon: <List size={18} />,
      text: 'Gestión de Hoteles',
      to: '/hoteles'
    },
    {
      icon: <Bed size={18} />,
      text: 'Habitaciones',
      to: '/habitacion'
    }
  ];

  return (
      <div className="dashboard-container">
        <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="sidebar-header">
            <div className="logo-container">
              <Star className="star-icon" size={24} />
              <h2 className="sidebar-title">Collection Royal</h2>
            </div>
            <button
                className="close-button"
                onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          <nav className="sidebar-nav">
            <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Inicio"
                to="/dashboard"
                active={location.pathname === '/dashboard'}
            />
            <SidebarItem
                icon={<Users size={20} />}
                text="Usuarios"
                to="/usuarios"
                active={location.pathname === '/usuarios'}
            />

            <SidebarItemWithSubmenu
                icon={<Hotel size={20} />}
                text="Hoteles"
                submenuItems={hotelSubmenuItems}
            />

            <SidebarItem
                icon={<DollarSign size={20} />}
                text="Ventas"
                to="/alquiler"
                active={location.pathname === '/alquiler'}
            />
          </nav>
        </div>

        <div className={`main-content ${sidebarOpen ? 'content-with-sidebar' : ''}`}>
          <TopHeader
              pageTitle={getPageTitle()}
              toggleSidebar={toggleSidebar}
              sidebarOpen={sidebarOpen}
          />
          <main className="dashboard-content">
            {children}
          </main>
        </div>
      </div>
  );
};

export default Dashboard;