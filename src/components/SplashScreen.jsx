import React from 'react';
import { motion } from 'framer-motion';
import TaniCareLogo from './TaniCareLogo';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-ultra">
      <motion.div 
        className="splash-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="logo-glow-wrap">
           <div className="logo-ring"></div>
           <div className="logo-ring ring-2"></div>
           <TaniCareLogo size="splash" theme="dark" />
        </div>
        
        <div className="loading-bar-wrap">
           <motion.div 
             className="loading-bar-fill"
             initial={{ width: 0 }}
             animate={{ width: '100%' }}
             transition={{ duration: 2.2, ease: "easeInOut" }}
           />
        </div>

        <motion.p
          className="splash-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Solusi Agrikultur & Peternakan Terpadu
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
