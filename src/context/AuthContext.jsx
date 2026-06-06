import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNotifications } from './NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const { addNotification } = useNotifications();

  // Splash screen timer — always shows exactly 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2500);
    // Explicitly set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.error("Persistence error:", err);
    });
    return () => clearTimeout(timer);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    // Safety timeout: if Firebase doesn't respond in 5s, force continue
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimer); // Firebase responded, cancel safety timer
      try {
        if (firebaseUser) {
          // Try to fetch extra data from Firestore
          try {
            const docRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || docSnap.data()?.name || 'Petani',
              plan: docSnap.data()?.plan || 'Free Tier',
              age: docSnap.data()?.age || '',
              gender: docSnap.data()?.gender || 'pria',
              address: docSnap.data()?.address || '',
              phoneNumber: docSnap.data()?.phoneNumber || '',
              createdAt: docSnap.data()?.createdAt || null,
            });
          } catch (firestoreErr) {
            console.error(firestoreErr);
            // Firestore error — still set user from Auth data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'Petani',
              plan: 'Free Tier',
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        addNotification("Error", "Terjadi kesalahan saat memuat data pengguna.", "error");
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, [addNotification]);

  // REGISTER: Create account + save to Firestore
  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      // Save to Firestore
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          name,
          email,
          plan: 'Free Tier',
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore write skipped:', e.message);
        addNotification("Peringatan", "Akun dibuat, namun profil gagal disimpan ke database.", "warning");
      }

      setUser({ uid: firebaseUser.uid, email, name, plan: 'Free Tier' });
      addNotification("Berhasil", "Akun berhasil dibuat!", "success");
    } catch (err) {
      addNotification("Gagal Daftar", err.message, "error");
      throw err;
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addNotification("Berhasil", "Berhasil masuk!", "success");
    } catch (err) {
      addNotification("Gagal Masuk", "Email atau password salah.", "error");
      throw err;
    }
  };

  // UPDATE USER DATA
  const updateUserData = async (data) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, data, { merge: true });
      setUser(prev => ({ ...prev, ...data }));
      addNotification("Berhasil", "Data profil berhasil diperbarui.", "success");
    } catch (err) {
      addNotification("Gagal Memperbarui", "Gagal menyimpan data ke database.", "error");
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      addNotification("Gagal Keluar", "Terjadi kesalahan saat keluar.", "error");
    }
  };

  // Show splash until BOTH: splash timer done AND firebase responded (or timed out)
  const isReady = splashDone && !loading;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserData, loading: !isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
