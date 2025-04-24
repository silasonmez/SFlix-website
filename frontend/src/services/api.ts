import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5114/api', // Backend URL'i
  withCredentials: true, // Cookie ile çalışan işlemler için gerekli
});

export default api;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/Authentication/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Giriş başarısız.');
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/Authentication/Register', { name, email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Kayıt başarısız.');
  }
  
};

export const logoutUser = async () => {
  try {
    await api.post('/Authentication/Logout');
  } catch (error: any) {
    throw new Error('Çıkış yapılırken bir hata oluştu.');
  }
};

export const getSeries = async () => {
  const response = await fetch('http://localhost:5114/api/series');
  if (!response.ok) {
    throw new Error('Dizi verileri alınamadı.');
  }
  const data = await response.json();
  return data;
};

export const getCategories = async () => {
  const response = await fetch('http://localhost:5114/api/categories');
  if (!response.ok) {
    throw new Error('Kategori verileri alınamadı.');
  }
  const data = await response.json();
  return data;
}; 
export const getMovies = async () => {
  const response = await fetch('http://localhost:5114/api/movies');
  if (!response.ok) {
    throw new Error('Film verileri alınamadı.');
  }
  const data = await response.json();
  return data;
};

export const getFeaturedFavorites = async () => {
  try {
    const response = await api.get('/Favorites');
    return response.data; // Favorileri döndürüyoruz
  } catch (error: any) {
    throw new Error('Favoriler alınırken bir hata oluştu.');
  }
};