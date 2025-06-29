import styles from './NewPost.module.css'

const NewPost = () => {
  return (
    <div className={styles.newpost_container}>
        <div className={styles.newpost_content}>
            <div className={styles.newpost_data}>
                <div className={styles.profile}>
                    <span>
                        <i className="fa-solid fa-user" />
                    </span>
                </div>
                <form>
                    <input type="text" placeholder="Procure o filme desejado..."/>
                </form>
            </div>
            <div className={styles.newpost_buttons}>
                <button type="submit">Postar</button>
            </div>
        </div>
    </div>
  )
}

export default NewPost