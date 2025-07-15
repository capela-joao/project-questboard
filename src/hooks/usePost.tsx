import { useState } from 'react';
import {
  createPost,
  getPostsByUser,
  sendLike,
  deleteLike,
  createComment,
  deletePost,
  editPost,
} from '../services/PostService';
import { useAuthContext } from '../contexts/authContext';
import { type CommentData, type LikeData, type PostData, type EditPostData } from '../types/types';

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

  const removePost = async (postId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      await deletePost(postId, token);
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao criar post:', err.message);
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePost = async (data: EditPostData, postId: string, token: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      await editPost(data, postId, token);
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

  const submitLike = async (data: LikeData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      await sendLike(data, token);
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao criar post:', err.message);
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeLike = async (data: LikeData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      await deleteLike(data, token);
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao criar post:', err.message);
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (data: CommentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Token de autenticação ausente.');
      await createComment(data, token);
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao criar post:', err.message);
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitPost,
    getPost,
    submitLike,
    removeLike,
    submitComment,
    removePost,
    changePost,
    loading,
    error,
    success,
  };
}
