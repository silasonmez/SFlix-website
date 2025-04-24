import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // LocalStorage'dan token al
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Oturum açma bilgileri bulunamadı. Lütfen giriş yapın.');
          return;
        }

        // Backend API isteği
        const response = await axios.get('http://localhost:5114/api/Users/GetUserDetails', {
          headers: {
            Authorization: `Bearer ${token}`, // Token başlıkta gönderiliyor
          },
          withCredentials: true, // Eğer backend cookie kullanıyorsa
        });

        // Kullanıcı email bilgisi
        setUserEmail(response.data.email);
      } catch (err: any) {
        console.error(err);

        // 401 Unauthorized
        if (err.response?.status === 401) {
          setError('Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.');
          localStorage.removeItem('token'); // Geçersiz token'ı temizle
        } else {
          setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profil Bilgileri</h1>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <p><strong>Email:</strong> {userEmail || 'Yükleniyor...'}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
