import type { CommentData, EditPostData, LikeData, PostData } from '../types/types';

const API_URL = 'https://questboard-review-api.azurewebsites.net';

const safeJsonParse = async (response: Response) => {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }
  return JSON.parse(text);
};

export async function createPost(data: PostData, token: string) {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return await safeJsonParse(response);
}

export async function deletePost(postId: string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return await safeJsonParse(response);
}

export async function editPost(data: EditPostData, postId: string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return await safeJsonParse(response);
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

  return await safeJsonParse(response);
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

  return await safeJsonParse(response);
}

export async function createComment(data: CommentData, token: string) {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return await safeJsonParse(response);
}

export async function getCommentByPost(postId: string, token: string) {
  const response = await fetch(`${API_URL}/comments/post/${postId}`, {
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar comentários');
  }

  const likesCount = await safeJsonParse(response);
  return likesCount;
}

export async function sendLike(data: LikeData, token: string) {
  const response = await fetch(`${API_URL}/likes`, {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return await safeJsonParse(response);
}

export async function getLikesByPost(postId: string, token: string): Promise<number> {
  const response = await fetch(`${API_URL}/likes/post/${postId}`, {
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar likes');
  }

  const likesCount = await safeJsonParse(response);
  return likesCount;
}

export async function deleteLike(data: LikeData, token: string) {
  const response = await fetch(`${API_URL}/likes`, {
    method: 'DELETE',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao deletar post.');
  }

  return await safeJsonParse(response);
}

export async function isLiked(userId: string, postId: string) {
  const response = await fetch(`${API_URL}/likes/isLiked/${userId}/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return await safeJsonParse(response);
}
