import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Store, LayoutDashboard, Globe, 
  Leaf, Bell, Search, User, Menu, 
  Settings, LogOut, ArrowLeft, Inbox, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, hasNew, markAllAsRead, requestPermission } = useNotifications();
  const [showNotifList, setShowNotifList] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: <Home size={24} />, label: 'Beranda' },
    { path: '/market', icon: <Store size={24} />, label: 'Market' },
    { path: '/dashboard', icon: <LayoutDashboard size={24} />, label: 'Panel' },
    { path: '/hub', icon: <Globe size={24} />, label: 'Komunitas' },
  ];

  return (
    <div className="ultra-wrapper">
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>

      {/* Premium Sidebar (Floating Glass Case) */}
      <aside className="premium-sidebar glass-panel">
        <div className="sidebar-brand">
          <div className="logo-box">
            <Leaf className="logo-icon" size={32} />
          </div>
          <div className="brand-text">
            <h2>TaniCare</h2>
            <span>Enterprise v2.0</span>
          </div>
        </div>

        <nav className="nav-container">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <div className="icon-wrapper">
                    {item.icon}
                    {isActive && <motion.div layoutId="nav-bg" className="nav-active-bg" />}
                  </div>
                  <span className="label-text">{item.label}</span>
                  {isActive && <div className="active-dot"></div>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer-v2">
          <button className="util-btn" onClick={toggleTheme}>
            <div className={`mode-switch ${isDarkMode ? 'dark' : 'light'}`}>
               <motion.div layout className="switch-ball" />
            </div>
            <span>Tampilan</span>
          </button>
          <button className="util-btn logout">
            <LogOut size={20} /> <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="premium-content">
        <header className="content-header">
           <div className="header-left-area">
              {location.pathname !== '/' && (
                <button className="back-btn-ultra glass-panel" onClick={() => navigate(-1)}>
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="header-info">
                 <h1 className="page-title">
                    {menuItems.find(i => i.path === location.pathname)?.label || 'Aplikasi'}
                 </h1>
                 <p className="page-subtitle">Sistem Manajemen Pertanian Cerdas</p>
              </div>
           </div>

           <div className="header-actions-v2">
              <div className="search-pill glass-panel">
                 <Search size={20} />
                 <input type="text" placeholder="Cari laporan..." />
              </div>
              <div className="top-right-actions">
                 <button 
                   className="action-circle glass-panel" 
                   onClick={() => {
                     setShowNotifList(!showNotifList);
                     if (!showNotifList) {
                       markAllAsRead();
                       requestPermission(); 
                     }
                   }}
                 >
                    <Bell size={22} />
                    {hasNew && <span className="glowing-badge"></span>}
                 </button>

                 <AnimatePresence>
                   {showNotifList && (
                     <>
                       {/* Overlay untuk menutup saat klik di luar */}
                       <div 
                         className="notif-overlay" 
                         onClick={() => setShowNotifList(false)}
                       ></div>
                       
                       <motion.div 
                         className="notif-dropdown"
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       >
                         <div className="notif-header">
                            <h3>Pemberitahuan</h3>
                            <span>{notifications.filter(n => !n.read).length} Baru</span>
                         </div>
                         <div className="notif-scroll">
                            {notifications.length > 0 ? notifications.map(n => (
                              <div key={n.id} className={`notif-item ${n.read ? 'read' : ''}`}>
                                 <div className={`notif-icon-box ${n.type}`}>
                                    {n.type === 'info' ? <Inbox size={16} /> : <Globe size={16} />}
                                 </div>
                                 <div className="notif-body">
                                    <h6>{n.title}</h6>
                                    <p>{n.message}</p>
                                    <div className="notif-time"><Clock size={10} /> {n.time}</div>
                                 </div>
                              </div>
                            )) : (
                              <div className="notif-empty">Tidak ada pesan baru</div>
                            )}
                         </div>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>

                 <div className="profile-pill glass-panel">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="admin" />
                 </div>
              </div>
           </div>
        </header>

        <div className="page-mount">
           <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
             >
               {children}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* Mobile Ultra Dock */}
      <nav className="mobile-ultra-dock glass-panel">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
          >
            <div className="dock-icon">
               {item.icon}
               {location.pathname === item.path && <motion.div layoutId="dock-bg" className="dock-active-indicator" />}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
