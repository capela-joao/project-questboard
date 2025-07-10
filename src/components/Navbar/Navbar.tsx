import { useAuthContext } from '../../contexts/authContext';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user } = useAuthContext();

  return (
    <>
      <header className={styles.header_container}>
        <div className={styles.header_content}>
          <form className={styles.form_data}>
            <div className={styles.search_container}>
              <input type="text" placeholder="Buscar jogos o posts..." />
              <button type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
          <div className={styles.user_section}>
            <div className={styles.user_profile}>
              <Link to={'/profile'}>
                {user ? (
                  <img src={user.avatarUrl} alt="profile" />
                ) : (
                  <i className="fas fa-user"></i>
                )}
                {user && <span>{user.username}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
