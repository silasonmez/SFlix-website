import React, { useState } from 'react';
import { loginUser } from '../services/api';
import background from '../assets/background.jpg'; // Arka plan görseli

interface LoginFormProps {
  onLoginSuccess: (isAdmin: boolean) => void; // Admin durumunu gönderiyoruz
  onRegisterClick: () => void; // Kayıt Ol butonu için tıklama işlevi
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      // Giriş işlemini gerçekleştir
      const data = await loginUser(email, password);
      console.log('Giriş Başarılı:', data);

      // Token'ı localStorage'a kaydediyoruz
      localStorage.setItem('token', data.Token);

      // Kullanıcı verisini API'den al
      const userResponse = await fetch(`http://localhost:5114/api/Users`);
      const users = await userResponse.json();

      // Email eşleşmesiyle kullanıcıyı bul
      const user = users.$values.find((u: any) => u.email === email);

      // Eğer kullanıcı bulunursa admin durumunu kontrol et
      if (user) {
        const isAdmin = user.isAdmin;
        onLoginSuccess(isAdmin); // Admin durumu gönderiliyor
      } else {
        setError('Kullanıcı bulunamadı.');
      }
    } catch (err: any) {
      setError('Giriş başarısız: ' + err.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0',
        padding: '0',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '320px',
          textAlign: 'center',
        }}
      >
        {/* Sflix Başlığı */}
        <h1 style={{ fontFamily: 'Arial, sans-serif', color: '#6b00b6', fontSize: '32px', marginBottom: '20px' }}>
          Sflix
        </h1>

        {/* Giriş Hata Mesajı */}
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#6b00b6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Giriş Yap
          </button>
        </form>

        {/* Kayıt Ol Butonu */}
        <button
          onClick={onRegisterClick}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px',
          }}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
