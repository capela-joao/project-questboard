import Menu from '../../components/Menu/Menu';
import Navbar from '../../components/Navbar/Navbar';

import { Outlet } from 'react-router-dom';

import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <div className={styles.container}>
      <Menu />
      <Navbar />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
