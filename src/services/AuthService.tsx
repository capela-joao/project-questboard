import { type User } from '../types/types';

export interface RegisterData {
  username: string;
  email: string;
  bio: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  provider: string;
  googleCredential: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    bio: string;
    createdAt: number;
    updatedAt: number;
  };
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

const API_URL = 'https://questboard-account-api.azurewebsites.net';

export async function register(data: RegisterData): Promise<User> {
  const response = await fetch(`${API_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao registrar');
  }

  return response.json();
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao fazer login');
  }

  const json = await response.json();

  return json;
}

export async function updateUser(id: number, data: UpdateUserData, token: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Erro ao buscar usuário com ID ${id}`);
  }

  return response.json();
}

export async function getUserById(id: number, token: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Erro ao buscar usuário com ID ${id}`);
  }

  return response.json();
}
