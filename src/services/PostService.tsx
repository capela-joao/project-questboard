export interface PostGame {
  authorId: number;
  gameId: number;
  title: string;
  content: string;
  imageURL: string;
}

const API_URL = 'https://questboard-games-api-dfh4c8emeqgwgjbd.eastasia-01.azurewebsites.net';

export async function createPost(data: PostGame, token: any) {
  if (!token) {
    throw new Error('Usuário não autenticado. Token ausente.');
  }

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

  return response.json();
}
