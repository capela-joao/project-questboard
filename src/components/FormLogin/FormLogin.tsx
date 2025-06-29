import styles from './FormLogin.module.css'
import { useState, type ChangeEvent, type FormEvent } from 'react'

const FormLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleData = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        setPassword(e.target.value)
    }   

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(email, password);
    }
  return (
    <div className={styles.form_container}>
        <div className={styles.form_content}>
            <div className={styles.form_title}>
                <h2>Inicie a sua sessão</h2>  
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.form_data}>
                    <label>
                        <span>E-mail:</span>
                        <input type="email" placeholder="Digite o seu e-mail" onChange={handleData}/>
                    </label>
                    <label>
                        <span>Senha:</span>
                        <input type="password" placeholder="Digite a sua senha" onChange={handleData}/>
                    </label>
                </div>
            </form>
            <div className={styles.form_buttons}>
                <button className={styles.btn_submit}>Iniciar Sessão</button>
                <button className={styles.btn_submit_google}>
                    <div className={styles.div_submit_google}>
                        <img src="src\assets\images\logo-google.png" height={"20px"} width={"20px"} alt="logo-google" />
                        <span>Continuar com o Google</span>
                    </div>
                </button>
            </div>
            <div className={styles.form_footer}>
                <span>
                    <p>
                        <a href="#">Não consigo iniciar a sessão.</a>
                    </p>
                </span>
                <span>
                    <p>Não possui uma conta?</p>
                    <a href="#">Crie uma gratuitamente!</a>
                </span>
            </div>
        </div>
    </div>
  )
}

export default FormLogin