import type { PostData } from '../types/types';

const API_URL = 'https://questboard-review-api.azurewebsites.net';

export async function createPost(data: PostData, token: string) {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log(response);
  console.log(data);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return response.json();
}

export async function getPostsByUser(id: string, token: string) {
  const response = await fetch(`${API_URL}/posts/user/${id}`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return response.json();
}

export async function getAllPosts(token: string) {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return response.json();
}
