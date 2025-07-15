import { useNotifications } from '../../hooks/useNotification';
import styles from './NotificationBadge.module.css';

export function NotificationBadge() {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  return <span className={styles.notificationBadge}>{unreadCount > 99 ? '99+' : unreadCount}</span>;
}
