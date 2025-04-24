import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SeriesPage from './pages/SeriesPage';
import MoviesPage from './pages/MoviesPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel'; // Admin paneli sayfası

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin durumu

  // Giriş başarılı olduğunda çağrılan fonksiyon
  const handleLoginSuccess = (adminStatus: boolean) => {
    setIsAuthenticated(true); // Kullanıcıyı giriş yapmış olarak işaretle
    setIsAdmin(adminStatus); // Admin durumunu kaydet
  };

  // Çıkış yapıldığında çağrılan fonksiyon
  const handleLogout = () => {
    setIsAuthenticated(false); // Kimlik doğrulama durumunu sıfırla
    setIsAdmin(false); // Admin durumunu sıfırla
  };

  return (
    <Router>
      <div>
        {/* Navbar yalnızca giriş yapıldığında gösterilir */}
        {isAuthenticated && <Navbar isAdmin={isAdmin} onLogout={handleLogout} />}

        <div style={{ margin: 0, padding: 0 }}>
          {/* Admin kullanıcıları için admin paneline yönlendirme */}
          {isAuthenticated && isAdmin && (
            <Link to="/admin-panel">
              <button style={{ padding: '10px 20px', fontSize: '16px' }}>
                Admin Paneline Git
              </button>
            </Link>
          )}
        </div>

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <HomePage />
              ) : (
                <LoginForm
                  onLoginSuccess={handleLoginSuccess} // Admin durumunu gönder
                  onRegisterClick={() => (window.location.href = '/register')}
                />
              )
            }
          />
          {isAuthenticated && (
            <>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/diziler" element={<SeriesPage />} />
              <Route path="/filmler" element={<MoviesPage />} />
              <Route path="/kategoriler" element={<CategoriesPage />} />
              <Route path="/profilim" element={<ProfilePage />} />
              {isAdmin && <Route path="/admin-panel" element={<AdminPanel />} />}
            </>
          )}
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
