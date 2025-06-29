import styles from './NewPost.module.css'

const NewPost = () => {
  return (
    <div className={styles.newpost_container}>
        <div className={styles.profile}>
            <span>
                <i className="fa-solid fa-user" />
            </span>
        </div>
        <div className={styles.newpost_content}>
            <form>
                <input type="text" placeholder="Procure o filme desejado..."/>
            </form>
            <div className={styles.newpost_buttons}>
                <button type="submit">Criar nova postagem</button>
            </div>
        </div>
    </div>
  )
}

export default NewPost