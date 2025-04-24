import React from 'react';
import { logoutUser } from '../services/api';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('Çıkış yapıldı.');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  return <button onClick={handleLogout}>Çıkış Yap</button>;
};

export default LogoutButton;
