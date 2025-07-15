import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/authContext';
import {
  getNotificationByUser,
  getLastNotificationByUser,
  markNotificationAsRead,
} from '../services/NotificationService';
import { type Notification } from '../types/types';

export function useNotifications() {
  const { user, token } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id || !token) return;

    setLoading(true);
    try {
      const data = await getNotificationByUser(String(user.id), token);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!token) return;

      try {
        await markNotificationAsRead(notificationId, token);
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n)),
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    },
    [token],
  );

  const checkForNewNotifications = useCallback(async () => {
    if (!user?.id || !token) return;

    try {
      const lastNotifications = await getLastNotificationByUser(String(user.id), token);

      if (lastNotifications.length > 0) {
        const newNotifications = lastNotifications.filter(lastNotification => {
          const exists = notifications.find(n => n.id === lastNotification.id);
          return !exists && lastNotification.receiverId !== lastNotification.senderId;
        });

        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev]);
          const newUnreadCount = newNotifications.filter(n => !n.read).length;
          if (newUnreadCount > 0) {
            setUnreadCount(prev => prev + newUnreadCount);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar novas notificações:', error);
    }
  }, [user?.id, token, notifications]);

  useEffect(() => {
    if (user?.id && token) {
      fetchNotifications();
    }
  }, [user?.id, token, fetchNotifications]);

  useEffect(() => {
    const handleFocus = () => {
      if (user?.id && token) {
        fetchNotifications();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id && token) {
        fetchNotifications();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, token, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    checkForNewNotifications,
  };
}
