import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, KeyRound, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaniCareLogo from '../components/TaniCareLogo';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './AuthPage.css';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('idle'); // idle | loading | success | error
  const [forgotError, setForgotError] = useState('');
  const { login, register: authRegister } = useAuth();
  const auth = getAuth();

  const schema = isLogin ? loginSchema : registerSchema;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset();
    setError('');
  }, [isLogin, reset]);

  const getErrorMessage = (code) => {
    const errorMessages = {
      'auth/user-not-found': 'Email tidak terdaftar. Silakan daftar terlebih dahulu.',
      'auth/wrong-password': 'Kata sandi salah. Coba lagi.',
      'auth/email-already-in-use': 'Email sudah digunakan. Silakan masuk.',
      'auth/weak-password': 'Kata sandi terlalu lemah. Minimal 6 karakter.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
      'auth/network-request-failed': 'Koneksi internet bermasalah.',
    };
    return errorMessages[code] || 'Terjadi kesalahan. Silakan coba lagi.';
  };

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await authRegister(data.name, data.email, data.password);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotError('Masukkan alamat email yang valid.');
      return;
    }
    setForgotStatus('loading');
    setForgotError('');
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotStatus('success');
      
      // Tampilkan notifikasi di perangkat
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("TaniCare - Keamanan Akun", {
          body: `Link reset kata sandi telah dikirim ke ${forgotEmail}. Silakan periksa kotak masuk atau spam email Anda.`,
          icon: "/vite.svg" 
        });
      }
    } catch (err) {
      setForgotStatus('error');
      setForgotError(getErrorMessage(err.code));
    }
  };

  const openForgot = () => {
    setShowForgot(true);
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setForgotStatus('idle');
    setForgotError('');
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

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                    {...register('name')}
                  />
                  {errors.name && <span className="auth-error-text">{errors.name.message}</span>}
               </motion.div>
             )}
           </AnimatePresence>

           <div className="form-group-ultra">
              <label><Mail size={14} /> Email Perusahaan</label>
              <input 
                type="email" 
                placeholder="rekan_tani@email.com" 
                {...register('email')}
              />
              {errors.email && <span className="auth-error-text">{errors.email.message}</span>}
           </div>

           <div className="form-group-ultra">
              <label><Lock size={14} /> Kata Sandi</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                {...register('password')}
              />
              {errors.password && <span className="auth-error-text">{errors.password.message}</span>}
           </div>

           {isLogin && (
             <div style={{ textAlign: 'right', marginTop: '-10px' }}>
               <button
                 type="button"
                 className="btn-text"
                 style={{ fontSize: '0.78rem', opacity: 0.7 }}
                 onClick={openForgot}
               >
                 Lupa Kata Sandi?
               </button>
             </div>
           )}

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

      {/* Modal Lupa Kata Sandi */}
      {showForgot && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeForgot(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#111815', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '28px', padding: '36px', width: '90%', maxWidth: '420px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)', position: 'relative'
            }}
          >
            <button
              onClick={closeForgot}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {forgotStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10 }}>Email Terkirim!</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
                  Link pergantian kata sandi telah dikirim ke <strong style={{ color: '#34d399' }}>{forgotEmail}</strong>.
                  Buka kotak masuk email Anda dan klik link yang dikirimkan Firebase/Google.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                  💡 Jika tidak ada di kotak masuk, periksa folder Spam/Junk.
                </p>
                <button className="btn-auth-submit" style={{ marginTop: 24, width: '100%' }} onClick={closeForgot}>
                  Mengerti, Tutup
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={22} color="#10b981" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Reset Kata Sandi</h3>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Email reset akan dikirim via Google</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: 20, lineHeight: 1.6 }}>
                  Masukkan alamat email akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru langsung ke kotak masuk email Anda.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                    <Mail size={13} /> Alamat Email
                  </label>
                  <input
                    type="email"
                    placeholder="contoh@gmail.com"
                    value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotError(''); setForgotStatus('idle'); }}
                    onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      padding: '14px 16px', borderRadius: 14, color: 'white', outline: 'none',
                      fontSize: '0.9rem', boxSizing: 'border-box',
                      borderColor: forgotError ? '#ef4444' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                  {forgotError && (
                    <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: 6, fontWeight: 700 }}>⚠️ {forgotError}</p>
                  )}
                </div>

                <button
                  className="btn-auth-submit"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={handleForgotPassword}
                  disabled={forgotStatus === 'loading'}
                >
                  {forgotStatus === 'loading' ? 'Mengirim...' : 'Kirim Link Reset'}
                  {forgotStatus !== 'loading' && <ArrowRight size={17} />}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
