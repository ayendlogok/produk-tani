import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Store, LayoutDashboard, Globe, 
  Leaf, Bell, Search, User, Menu, X,
  Settings, LogOut, ArrowLeft, Inbox, Clock, Mail, ShieldCheck,
  Phone, MapPin, Calendar, Edit2, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, hasNew, markAllAsRead, requestPermission } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifList, setShowNotifList] = React.useState(false);
  const { user, logout, updateUserData } = useAuth();
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: '',
    age: '',
    gender: 'pria',
    address: '',
    phoneNumber: ''
  });

  // Sync form with user data when modal opens
  React.useEffect(() => {
    if (showProfileModal && user) {
      setEditForm({
        name: user.name || '',
        age: user.age || '',
        gender: user.gender || 'pria',
        address: user.address || '',
        phoneNumber: user.phoneNumber || ''
      });
      setIsEditingProfile(false);
    }
  }, [showProfileModal, user]);

  const handleUpdateProfile = async () => {
    try {
      await updateUserData(editForm);
      setIsEditingProfile(false);
    } catch (error) {
      alert('Gagal memperbarui profil: ' + error.message);
    }
  };

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
          <div className="logo-box" style={{ background: 'none', boxShadow: 'none' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <h2>AgroPlus</h2>
            <span>v1.0</span>
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

          <button className="util-btn logout" onClick={async () => { await logout(); }}>
            <LogOut size={20} /> <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="premium-content">
        <header className="content-header">
           <div className="header-left-area">
              <button className="hamburger-btn glass-panel" onClick={() => setShowMobileSidebar(true)}>
                <Menu size={20} />
              </button>
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

                  <div className="profile-pill glass-panel" onClick={() => setShowProfileModal(true)} style={{ cursor: 'pointer' }}>
                     <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.gender === 'wanita' ? 'Victoria' : 'James'}`} alt="admin" />
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

      {/* Mobile Sidebar Overlay & Menu */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div 
              className="mobile-sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
            />
            <motion.div 
              className="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="sidebar-brand">
                <div className="logo-box" style={{ background: 'none', boxShadow: 'none' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                </div>
                <div className="brand-text">
                  <h2>AgroPlus</h2>
                  <span>v1.0</span>
                </div>
                <button 
                  className="close-sidebar-btn" 
                  onClick={() => setShowMobileSidebar(false)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--p-text-muted)' }}
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="nav-container">
                {menuItems.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path} 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <div className="icon-wrapper">
                      {item.icon}
                    </div>
                    <span className="label-text">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="sidebar-footer-v2">
                <button className="util-btn logout" onClick={async () => { await logout(); setShowMobileSidebar(false); }}>
                  <LogOut size={20} /> <span>Keluar</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            className="profile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="profile-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="profile-modal-header">
                <button className="close-modal-btn" onClick={() => setShowProfileModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="profile-modal-body">
                <div className="profile-modal-avatar">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.gender === 'wanita' ? 'Victoria' : 'James'}`} alt="Admin" />
                </div>
                
                {isEditingProfile ? (
                  <div className="profile-edit-form">
                    <div className="edit-input-group">
                      <label>Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                        placeholder="Nama Lengkap"
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>Jenis Kelamin</label>
                      <div className="gender-toggle">
                        <button 
                          className={`gender-btn ${editForm.gender === 'pria' ? 'active' : ''}`}
                          onClick={() => setEditForm({...editForm, gender: 'pria'})}
                        >
                          Pria
                        </button>
                        <button 
                          className={`gender-btn ${editForm.gender === 'wanita' ? 'active' : ''}`}
                          onClick={() => setEditForm({...editForm, gender: 'wanita'})}
                        >
                          Wanita
                        </button>
                      </div>
                    </div>
                    <div className="edit-input-group">
                      <label>Umur</label>
                      <input 
                        type="number" 
                        value={editForm.age} 
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})} 
                        placeholder="Umur"
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>Alamat</label>
                      <input 
                        type="text" 
                        value={editForm.address} 
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                        placeholder="Alamat Lengkap"
                      />
                    </div>
                    <div className="edit-input-group">
                      <label>No HP</label>
                      <input 
                        type="text" 
                        value={editForm.phoneNumber} 
                        onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} 
                        placeholder="No HP Aktif"
                      />
                    </div>
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleUpdateProfile}>
                        <Check size={18} /> Simpan Perubahan
                      </button>
                      <button className="cancel-btn" onClick={() => setIsEditingProfile(false)}>
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="profile-modal-info">
                      <h2>{user?.name || 'Admin AgroPlus'}</h2>
                      <p>{user?.email || 'admin@agroplus.id'}</p>
                      <button className="edit-profile-trigger" onClick={() => setIsEditingProfile(true)}>
                        <Edit2 size={14} /> Edit Profil
                      </button>
                    </div>

                    <div className="profile-details-list">
                      <div className="detail-item">
                        <div className="detail-icon"><Calendar size={20} /></div>
                        <div className="detail-text">
                          <label>Umur</label>
                          <span>{user?.age || '-'} Tahun</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon"><MapPin size={20} /></div>
                        <div className="detail-text">
                          <label>Alamat</label>
                          <span>{user?.address || '-'}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon"><Phone size={20} /></div>
                        <div className="detail-text">
                          <label>No HP</label>
                          <span>{user?.phoneNumber || '-'}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon"><ShieldCheck size={20} /></div>
                        <div className="detail-text">
                          <label>Status Akun</label>
                          <span>Terverifikasi</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="util-btn logout" 
                      style={{ width: '100%', justifyContent: 'center', background: 'var(--p-rose)', color: 'white' }}
                      onClick={async () => { await logout(); setShowProfileModal(false); }}
                    >
                      <LogOut size={20} /> <span>Keluar Sekarang</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import PropTypes from 'prop-types';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
