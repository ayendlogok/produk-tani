import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Leaf, Sun, Moon, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container header-content">
        <NavLink to="/" className="logo">
          <Leaf className="logo-icon" size={28} />
          <span className="logo-text text-gradient">TaniCare</span>
        </NavLink>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>Beranda</NavLink>
          <NavLink to="/market" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>TaniMarket</NavLink>
          <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>Dashboard</NavLink>
          <NavLink to="/hub" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>TaniHub</NavLink>
          
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
