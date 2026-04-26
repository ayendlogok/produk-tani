import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaniCareLogo from '../components/TaniCareLogo';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const getErrorMessage = (code) => {
    const errors = {
      'auth/user-not-found': 'Email tidak terdaftar. Silakan daftar terlebih dahulu.',
      'auth/wrong-password': 'Kata sandi salah. Coba lagi.',
      'auth/email-already-in-use': 'Email sudah digunakan. Silakan masuk.',
      'auth/weak-password': 'Kata sandi terlalu lemah. Minimal 6 karakter.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
      'auth/network-request-failed': 'Koneksi internet bermasalah.',
    };
    return errors[code] || 'Terjadi kesalahan. Silakan coba lagi.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Nama tidak boleh kosong.'); setIsLoading(false); return; }
        await register(name, email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-ultra-container">
      <div className="auth-mesh-bg"></div>
      
      <motion.div 
        className="auth-card glass-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="auth-header">
           <div style={{ marginBottom: 20 }}>
             <TaniCareLogo size="md" theme="dark" />
           </div>
           <h2>{isLogin ? 'Selamat Datang Kembali' : 'Bergabung dengan TaniCare'}</h2>
           <p>{isLogin ? 'Masuk untuk memantau lahan Anda' : 'Mulai budidaya cerdas hari ini'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
           <AnimatePresence mode="wait">
             {!isLogin && (
               <motion.div 
                 key="name"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="form-group-ultra"
               >
                  <label><User size={14} /> Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama Anda" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
               </motion.div>
             )}
           </AnimatePresence>

           <div className="form-group-ultra">
              <label><Mail size={14} /> Email Perusahaan</label>
              <input 
                type="email" 
                placeholder="rekan_tani@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
           </div>

           <div className="form-group-ultra">
              <label><Lock size={14} /> Kata Sandi</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
           </div>

           {error && (
             <div className="auth-error-banner">
               ⚠️ {error}
             </div>
           )}

           <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Akun')}
              {!isLoading && <ArrowRight size={18} />}
           </button>
        </form>

        <div className="auth-footer">
           <button className="btn-text" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
           </button>
        </div>

        <div className="auth-trust-badge">
           <ShieldCheck size={14} />
           <span>Enterprise Data Encryption Active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
