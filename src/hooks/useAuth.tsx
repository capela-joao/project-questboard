import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import {
  login as loginRequest,
  register as registerRequest,
  getUserById,
} from '../services/AuthService';
import { type User } from '../types/types';

export const useAuth = () => {
  const { login: setToken, logout, isAuthenticated, token, updateUser } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (data: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginRequest(data);
      setToken(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    bio: string;
    password: string;
  }) => {
    setError(null);
    setLoading(true);
    try {
      await registerRequest(data);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      const user = await getUserById(id, token);
      return user;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = (newUser: User) => {
    updateUser(newUser);
  };

  return {
    login,
    register,
    logout,
    fetchUserById,
    updateUserInfo,
    isAuthenticated,
    token,
    error,
    loading,
  };
};
