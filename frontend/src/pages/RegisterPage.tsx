import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import background from '../assets/background.jpg'; // Arka plan görseli

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await registerUser(name.trim(), email.trim(), password); // API çağrısı
      setSuccess(true);

      // Başarılı kayıt sonrası yönlendirme
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Kayıt başarısız:', err.message);
      setError(err.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`, // Arka plan resmi
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0',
        padding: '0',
        // overflow: 'hidden', // Scroll çubuklarını gizle
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          width: '350px',
        }}
      >
        {/* Başlık */}
        <h1 style={{ fontFamily: 'Arial, sans-serif', color: '#6b00b6', fontSize: '32px', marginBottom: '20px' }}>
          Kayıt Ol
        </h1>

        {/* Başarı ve Hata Mesajları */}
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '15px' }}>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</p>}

        {/* Kayıt Formu */}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Adınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
