const API_URL = 'https://questboard-account-api.azurewebsites.net';

export async function getUserProfile(userId: string) {
  const response = await fetch(`${API_URL}/user/publicProfile/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar dados do usuário');
  }

  return await response.json();
}
