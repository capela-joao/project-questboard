import { type Notification } from '../types/types';

const API_URL = 'https://questboard-notifications-api.azurewebsites.net';

export async function getNotificationByUser(id: string, token: string): Promise<Notification[]> {
  const response = await fetch(`${API_URL}/notification/${id}`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao receber notificação do usuário.');
  }

  return await response.json();
}

export async function getLastNotificationByUser(
  id: string,
  token: string,
): Promise<Notification[]> {
  const response = await fetch(`${API_URL}/notification/newest/${id}`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao receber as últimas notificações do usuário.');
  }

  return await response.json();
}

export async function markNotificationAsRead(notificationId: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/notification/read/${notificationId}`, {
    method: 'PATCH',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao marcar notificação como lida.');
  }
}
