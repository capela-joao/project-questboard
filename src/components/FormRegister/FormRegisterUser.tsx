import styles from './FormRegisterUser.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, type FormEvent } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';

const FormRegisterUser = () => {
  const { register, error, loading } = useAuth();
  const { validateRegister } = useFormValidation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const errorMsg = validateRegister({ username, email, bio, password });
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }
    try {
      await register({ username, email, bio, password });
      console.log('Cadastro realizado com sucesso.');
      navigate('/login');
    } catch (err: any) {
      console.log(err.message || 'Erro inesperado ao tentar registrar.');
    }
  };
  return (
    <div className={styles.form_container}>
      <div className={styles.form_content}>
        <div className={styles.form_title}>
          <h2>Faça seu cadastro</h2>
        </div>
        {(formError || error) && (
          <div className={styles.form_error}>
            <p>{formError || error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.form_data}>
            <label>
              <span>Usuário:</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite o seu usuário"
                required
              />
            </label>
            <label>
              <span>E-mail:</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Digite o seu e-mail"
                required
              />
            </label>
            <label>
              <span>Bio:</span>
              <input
                type="textarea"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Escreva um pouco sobre você..."
                required
              />
            </label>
            <label>
              <span>Senha:</span>
              <input
                type="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite a sua senha"
                required
              />
            </label>
            {/* <label>
                            <span>Confirme sua senha:</span>
                            <input type="Password" placeholder="Confirme a sua senha"/>
                        </label> */}
          </div>
          <div className={styles.form_buttons}>
            <button className={styles.btn_submit} disabled={loading}>
              {loading ? 'Carregando...' : 'Cadastrar'}
            </button>
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
  );
};

export default FormRegisterUser;
