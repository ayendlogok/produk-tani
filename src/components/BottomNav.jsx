import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, LayoutDashboard, Globe, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Beranda</span>
      </NavLink>
      <NavLink to="/market" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Store size={24} />
        <span>Market</span>
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={24} />
        <span>Panel</span>
      </NavLink>
      <NavLink to="/hub" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Globe size={24} />
        <span>Hub</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
