import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './FormLogin.module.css';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import googleLogo from '../../assets/images/logo-google.png';

const FormLogin = () => {
  const { login, error, loading } = useAuth();
  const { validateLogin } = useFormValidation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [formError, setFormError] = useState<string | null>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const errorMsg = validateLogin({ email, password });
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }
    try {
      setProvider('');
      await login({ email, password, provider });
      console.log('Login realizado com sucesso.');
      navigate('/');
    } catch (err: any) {
      console.error('Erro capturado:', err.message);
      setFormError('Erro inesperado ao tentar logar.');
    }
  };
  return (
    <div className={styles.form_container}>
      <div className={styles.form_content}>
        <div className={styles.form_title}>
          <h2>Inicie a sua sessão</h2>
        </div>
        {(formError || error) && (
          <div className={styles.form_error}>
            <p>{formError || error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.form_data}>
            <label>
              <span>E-mail:</span>
              <input
                type="email"
                placeholder="Digite o seu e-mail"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Senha:</span>
              <input
                type="password"
                placeholder="Digite a sua senha"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className={styles.form_buttons}>
            <button type="submit" className={styles.btn_submit} disabled={loading}>
              {loading ? 'Carregando...' : 'Iniciar Sessão'}
            </button>
            <button className={styles.btn_submit_google}>
              <div className={styles.div_submit_google}>
                <img src={googleLogo} height={'20px'} width={'20px'} alt="logo-google" />
                <span>Continuar com o Google</span>
              </div>
            </button>
          </div>
        </form>
        <div className={styles.form_footer}>
          <span>
            <p>
              <a href="#">Não consigo iniciar a sessão.</a>
            </p>
          </span>
          <span>
            <p>Não possui uma conta?</p>
            <Link to="/register">Crie uma gratuitamente!</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
