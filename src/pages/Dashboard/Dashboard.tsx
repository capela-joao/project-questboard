import styles from './Dashboard.module.css';

import NewPost from '../../components/NewPost/NewPost';
import PostCard from '../../components/PostCard/PostCard';
import PostList from '../../components/PostList/PostList';

const Dashboard = () => {
  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_feed_container}>
        <div className={styles.dashboard_feed_content}>
          <NewPost/>
          <PostCard/>
        </div>
        <PostList/>
      </div>
    </div>
  )
}

export default Dashboard