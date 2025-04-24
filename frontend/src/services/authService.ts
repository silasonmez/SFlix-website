import api from './api';

interface LoginResponse {
  token: string;
  isAdmin: boolean;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/users/login', { email, password });
  return response.data; // Backend'in döndüğü veriyi döndürüyoruz
}
