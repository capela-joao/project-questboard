import Menu from "../../components/Menu/Menu"
import Navbar from "../../components/Navbar/Navbar"

import { Outlet } from "react-router-dom"

import styles from './Navigation.module.css'

const Navigation = () => {
  return (
    <div className={styles.container}>
      <Menu />
        <div className={styles.content}>
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default Navigation