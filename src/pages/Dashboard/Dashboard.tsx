import styles from './Dashboard.module.css';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import { getAllPosts } from '../../services/PostService';
import NewPost from '../../components/NewPost/NewPost';
import PostCard from '../../components/PostCard/PostCard';
import RankingGames from '../../components/RankingGames/RankingGames';

const Dashboard = () => {
  const { token } = useAuthContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllPosts(token);
      console.log('📥 Dados retornados do backend:', data);
      setPosts(data);
    } catch (error) {
      console.error('❌ Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Carrega os posts ao montar o componente
  useEffect(() => {
    fetchPosts();
  }, [token]);

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_feed_container}>
        <div className={styles.dashboard_feed_content}>
          <NewPost onPostCreated={fetchPosts} />
          <PostCard posts={posts} loading={loading} />
        </div>
        <RankingGames />
      </div>
    </div>
  );
};

export default Dashboard;
