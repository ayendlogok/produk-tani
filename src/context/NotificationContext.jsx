import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Selamat Datang!', message: 'Mulai kelola lahan Anda dengan TaniCare.', time: '1j yang lalu', read: false, type: 'info' }
  ]);
  const [hasNew, setHasNew] = useState(true);

  // Fungsi untuk meminta izin Notifikasi HP
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Fungsi untuk mengirim notifikasi ke HP (Web Notification API)
  const sendPushNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/pwa-192x192.png'
      });
    }
  };

  const addNotification = (title, message, type = 'community') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: 'Baru saja',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    setHasNew(true);
    sendPushNotification(title, message);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasNew(false);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      hasNew, 
      addNotification, 
      markAllAsRead,
      requestPermission 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
