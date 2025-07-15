import { useNotifications } from '../../hooks/useNotification';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { type Notification } from '../../types/types';
import styles from './Notification.module.css';

export default function NotificationPage() {
  const { notifications, loading, markAsRead } = useNotifications();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div className={styles.notificationPage}>
      <h1>Notificações</h1>

      {notifications.length === 0 ? (
        <p className={styles.noNotifications}>Nenhuma notificação encontrada.</p>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notificationIcon}>
                <i className="fa-solid fa-heart" style={{ color: '#e74c3c' }}></i>
              </div>
              <div className={styles.notificationContent}>
                <p className={styles.notificationText}>Você recebeu um like em seu post</p>
                <p className={styles.notificationDate}>
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
              {!notification.read && <span className={styles.unreadIndicator}>•</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
