import styles from './Menu.module.css'

const Menu = () => {
  return (
    <div className={styles.menu_container}>
        <div className={styles.menu_content}>
            <div className={styles.list_content}>
                <div className={styles.menu_title}>
                    <h1>QuestBoard</h1>
                    <span>
                        <i className="fa-solid fa-plus"></i>
                    </span>
                </div>
                <ul>
                    <div className={styles.list_item}>
                        <span>
                            <i className="fa-solid fa-house"/>
                        </span>
                        <li>Home</li>
                    </div>
                    <div className={styles.list_item}>
                        <span>
                            <i className="fa-solid fa-user"/>
                        </span>
                        <li>Profile</li>
                    </div>
                    <div className={styles.list_item}>
                        <span>
                            <i className="fa-solid fa-bell"></i>
                        </span>
                        <li>Notificações</li>
                    </div>
                    <div className={styles.list_item}>
                        <span>
                            <i className="fa-solid fa-star"></i>    
                        </span>
                        <li>Favoritos</li>
                    </div>
                    <div className={styles.list_item}>
                        <span>
                            <i className="fa-solid fa-gear"></i>
                        </span>
                        <li>Configurações</li>
                    </div>
                </ul>
            </div>
            <div className={styles.menu_footer}>
                <div className={styles.list_item}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <p>Sair</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Menu