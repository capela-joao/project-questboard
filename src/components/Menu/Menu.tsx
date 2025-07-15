import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import { useNotifications } from '../../hooks/useNotification';
import styles from './Menu.module.css';

const Menu = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string): boolean => {
    return window.location.pathname === path;
  };

  const menuItems = [
    {
      path: '/',
      icon: 'fa-solid fa-house',
      label: 'Home',
      id: 'home',
    },
    {
      path: '/profile',
      icon: 'fa-solid fa-user',
      label: 'Profile',
      id: 'profile',
    },
    {
      path: '/notification',
      icon: 'fa-solid fa-bell',
      label: 'Notificações',
      id: 'notifications',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      path: '/favorites',
      icon: 'fa-solid fa-star',
      label: 'Favoritos',
      id: 'favorites',
      disabled: true,
    },
    {
      path: '/settings',
      icon: 'fa-solid fa-gear',
      label: 'Configurações',
      id: 'settings',
      disabled: true,
    },
  ];

  return (
    <div className={styles.menu_container}>
      <div className={styles.menu_content}>
        <div className={styles.menu_header}>
          <div className={styles.menu_title}>
            <h1 className={styles.menu_logo}>QuestBoard</h1>
            <button
              className={styles.menu_add_button}
              aria-label="Adicionar novo post"
              title="Adicionar novo post"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        <div className={styles.menu_main}>
          <ul className={styles.menu_list} role="list">
            {menuItems.map(item => (
              <li key={item.id} className={styles.menu_item_wrapper}>
                {item.disabled ? (
                  <div className={`${styles.menu_item} ${styles.disabled}`} aria-disabled="true">
                    <span className={styles.menu_icon}>
                      <i className={item.icon} aria-hidden="true" />
                    </span>
                    <span className={styles.menu_label}>{item.label}</span>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`${styles.menu_item} ${isActive(item.path) ? styles.active : ''}`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    <span className={styles.menu_icon}>
                      <i className={item.icon} aria-hidden="true" />
                      {item.badge && (
                        <span
                          className={styles.notification_badge}
                          aria-label={`${item.badge} notificações não lidas`}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </span>
                    <span className={styles.menu_label}>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.menu_footer}>
          <button
            className={styles.logout_button}
            onClick={handleLogout}
            aria-label="Sair da conta"
          >
            <span className={styles.menu_icon}>
              <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            </span>
            <span className={styles.menu_label}>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
