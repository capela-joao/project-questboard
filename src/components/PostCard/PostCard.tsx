import { useAuthContext } from '../../contexts/authContext';
import { useAuth } from '../../hooks/useAuth';
import styles from './PostCard.module.css';

const PostCard = () => {
  const { fetchUserById } = useAuth();
  const { user } = useAuthContext();

  return (
    <div className={styles.post_container}>
      <div className={styles.post_content}>
        <div className={styles.profile}>
          {user ? <img src={user.avatarUrl} alt="profile" /> : <i className="fas fa-user"></i>}
        </div>
        <div className={styles.post}>
          <p>nome do usuário</p>
          <p>Conteúdo do Post</p>
          <ul className={styles.post_footer}>
            <li>
              <button>
                <i className="fa-solid fa-heart"></i>
                <span>likes</span>
              </button>
            </li>
            <li>
              <button>
                <i className="fa-solid fa-comment"></i>
                <span>comentários</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
