import { useState } from 'react';
import { createPost, getPostsByUser } from '../services/PostService';
import { useAuthContext } from '../contexts/authContext';
import { type PostData } from '../types/types';

export function usePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { token } = useAuthContext();

  const submitPost = async (data: PostData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      await createPost(data, token);
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao criar post:', err.message);
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPost = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      const user = await getPostsByUser(id, token);
      return user;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar post.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitPost, getPost, loading, error, success };
}
