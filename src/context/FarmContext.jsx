import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Real-time listener — load crops from Firestore when user logs in
  useEffect(() => {
    if (!user?.uid) {
      setCrops([]); // Clear crops when logged out
      return;
    }

    setSyncing(true);
    // Listen to user's crops collection in real-time
    const cropsRef = collection(db, 'users', user.uid, 'crops');
    const q = query(cropsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,       // Firestore doc ID
        ...doc.data(),
      }));
      setCrops(loaded);
      setSyncing(false);
    }, (err) => {
      console.warn('Firestore crops error:', err.message);
      // Fallback to localStorage if Firestore fails
      const saved = localStorage.getItem(`tanicare_crops_${user.uid}`);
      if (saved) setCrops(JSON.parse(saved));
      setSyncing(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Cache to localStorage as offline backup
  useEffect(() => {
    if (user?.uid && crops.length >= 0) {
      localStorage.setItem(`tanicare_crops_${user.uid}`, JSON.stringify(crops));
    }
  }, [crops, user?.uid]);

  // ADD CROP → save to Firestore
  const addCrop = async (newCrop) => {
    if (!user?.uid) return;
    try {
      const cropsRef = collection(db, 'users', user.uid, 'crops');
      await addDoc(cropsRef, {
        name: newCrop.name || 'Plot Baru',
        variety: newCrop.variety || 'Umum',
        division: newCrop.division || 'Pertanian',
        health: null,
        lastScan: null,
        status: 'Online',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore addCrop error, using local:', e.message);
      // Fallback: add locally
      const crop = { id: Date.now(), ...newCrop, health: null, lastScan: null };
      setCrops(prev => [...prev, crop]);
    }
  };

  // UPDATE HEALTH → update Firestore doc
  const updateCropHealth = async (id, healthScore) => {
    if (!user?.uid) return;
    try {
      const cropRef = doc(db, 'users', user.uid, 'crops', id);
      await updateDoc(cropRef, {
        health: healthScore,
        lastScan: new Date().toLocaleTimeString('id-ID'),
      });
    } catch (e) {
      // Fallback: update locally
      setCrops(prev => prev.map(c =>
        c.id === id ? { ...c, health: healthScore, lastScan: new Date().toLocaleTimeString() } : c
      ));
    }
  };

  // DELETE CROP → remove from Firestore
  const deleteCrop = async (id) => {
    if (!user?.uid) return;
    try {
      const cropRef = doc(db, 'users', user.uid, 'crops', id);
      await deleteDoc(cropRef);
    } catch (e) {
      setCrops(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <FarmContext.Provider value={{ crops, addCrop, updateCropHealth, deleteCrop, syncing }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
