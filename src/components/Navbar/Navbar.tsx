import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <header className={styles.header_container}>
        <div className={styles.header_content}>
            <form className={styles.form_data}>
                <div className={styles.search_container}>
                    <input type="text" placeholder="Buscar jogos ou posts..."/>
                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </form>
            <div className={styles.user_section}>
                <div className={styles.user_profile}>
                    <i className="fas fa-user"></i>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar