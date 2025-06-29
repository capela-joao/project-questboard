import styles from './FormRegisterUser.module.css'

const FormRegisterUser = () => {
  return (
    <div className={styles.form_container}>
        <div className={styles.form_content}>
            <div className={styles.form_title}>
                <h2>Faça seu cadastro</h2>  
            </div>
            <form>
                <div className={styles.form_data}>
                    <label>
                        <span>Nome:</span>
                        <input type="text" placeholder="Digite o seu nome completo"/>
                    </label>
                    <label>
                        <span>E-mail:</span>
                        <input type="email" placeholder="Digite o seu e-mail"/>
                    </label>
                    <label>
                        <span>Bio:</span>
                        <input type="textarea" placeholder="Escreva um pouco sobre você..."/>
                    </label>
                    <label>
                        <span>Senha:</span>
                        <input type="Password" placeholder="Digite a sua senha"/>
                    </label>
                    <label>
                        <span>Confirme sua senha:</span>
                        <input type="Password" placeholder="Confirme a sua senha"/>
                    </label>
                </div>
                <div className={styles.form_buttons}>
                    <button className={styles.btn_submit}>Iniciar Sessão</button>
                </div>
            </form>
            {/* <div className={styles.form_footer}>
                <span>
                    <p>
                        <a href="#">Não consigo iniciar a sessão.</a>
                    </p>
                </span>
                <span>
                    <p>Não possui uma conta?</p>
                    <a href="#">Crie uma gratuitamente!</a>
                </span>
            </div> */}
        </div>
    </div>
  )
}

export default FormRegisterUser