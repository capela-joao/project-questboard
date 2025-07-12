import { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import { useAuth } from '../../hooks/useAuth';
import styles from './PostCard.module.css';
import { getAllPosts } from '../../services/PostService';

type PostCardProps = {
  posts: any[] | undefined;
  loading: boolean;
};

const PostCard = ({ posts = [], loading }: PostCardProps) => {
  // const { user, token } = useAuthContext();
  // const [posts, setPosts] = useState<any[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     if (!token) {
  //       setError('Token não encontrado');
  //       return;
  //     }

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const data = await getAllPosts(token);

  //       console.log(data);
  //       setPosts(data);
  //     } catch (err: any) {
  //       setError(err.message || 'Erro ao carregar posts.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPosts();
  // }, [token]);

  if (loading) {
    return <p>Carregando posts...</p>;
  }

  if (!posts.length) {
    return <p>Nenhum post encontrado.</p>;
  }

  return (
    <>
      <ul className={styles.post_container}>
        {posts.map(post => (
          <li key={post.id} className={styles.post_content}>
            <div className={styles.profile}>
              {post.avatarUrl ? (
                <img src={post.avatarUrl} alt="Avatar do autor" />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
            <div className={styles.post_data}>
              <p>{post?.authorId}</p>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Nota: {post.rate}</p>
              <div className={styles.post_image}>
                <img src={post.imageURL} alt="" />
              </div>
              <div className={styles.post_footer}>
                <button>
                  <i className="fa-solid fa-heart"></i>
                  <span>likes</span>
                </button>
                <button>
                  <i className="fa-solid fa-comment"></i>
                  <span>comentários</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostCard;
