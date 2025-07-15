import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './FormLogin.module.css';
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import googleLogo from '../../assets/images/logo-google.png';

declare global {
  interface Window {
    google: any;
    handleGoogleCredentialResponse?: (response: any) => void;
  }
}

const FormLogin = () => {
  const { login, error, loading } = useAuth();
  const { validateLogin } = useFormValidation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [googleCredential, setGoogleCredential] = useState('');
  const [formError, setFormError] = useState<string | null>('');

  const GOOGLE_CLIENT_ID =
    '377874780445-6k5jtnjc89jvusg7um6ebe2931hph5kl.apps.googleusercontent.com';

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setFormError('');
      setProvider('google');

      console.log('Google credential response:', response);

      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));

      console.log('User data from Google:', payload);

      await login({
        email: payload.email,
        password: '',
        provider: 'google',
        googleCredential: credential,
      });

      console.log('Login com Google realizado com sucesso.');
      navigate('/');
    } catch (err: any) {
      console.error('Erro no login com Google:', err.message);
      setFormError('Erro ao fazer login com Google.');
    }
  };

  useEffect(() => {
    window.handleGoogleCredentialResponse = handleGoogleCredentialResponse;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });

        window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          locale: 'pt-BR',
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (window.handleGoogleCredentialResponse) {
        delete window.handleGoogleCredentialResponse;
      }
    };
  }, []);

  const handleGoogleButtonClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.log('Google prompt was not displayed');
        } else if (notification.isSkippedMoment()) {
          console.log('Google prompt was skipped');
        } else if (notification.isDismissedMoment()) {
          console.log('Google prompt was dismissed');
        }
      });
    }
  };

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
      setGoogleCredential('');
      await login({ email, password, provider: '', googleCredential: '' });
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
            <button
              type="button"
              className={styles.btn_submit_google}
              onClick={handleGoogleButtonClick}
            >
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
