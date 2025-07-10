import { useEffect, useState, type FormEvent } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import styles from './Profile.module.css';
import { useUpload } from '../../hooks/useUpload';
import { updateUser } from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, token } = useAuthContext();
  const { uploadImage } = useUpload();
  const { updateUserInfo } = useAuth();

  const [profileUserName, setProfileUserName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileUserName(user.username);
      setProfileEmail(user.email);
      setProfileBio(user.bio);
      setProfileAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  if (!user || !token) {
    return <p>Sem dados de usuário para exibir.</p>;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await updateUser(
        user.id,
        {
          username: profileUserName,
          email: profileEmail,
          bio: profileBio,
          avatarUrl: profileAvatarUrl,
        },
        token,
      );
      updateUserInfo(newUser); // Atualiza contexto + sessionStorage
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      alert(`Erro ao atualizar perfil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_content}>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Usuário:</span>
            <input
              type="text"
              value={profileUserName}
              onChange={e => setProfileUserName(e.target.value)}
              placeholder="Digite o seu usuário"
              required
            />
          </label>

          <label>
            <span>E-mail:</span>
            <input
              type="email"
              value={profileEmail}
              onChange={e => setProfileEmail(e.target.value)}
              placeholder="Digite o seu e-mail"
              required
            />
          </label>

          <label>
            <span>Bio:</span>
            <textarea
              value={profileBio}
              onChange={e => setProfileBio(e.target.value)}
              placeholder="Escreva um pouco sobre você..."
              required
            />
          </label>

          <label>
            <span>Imagem de Perfil:</span>
            <input
              type="file"
              accept="image/*"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (file) {
                  const imageUrl = await uploadImage(file);
                  if (imageUrl) {
                    setProfileAvatarUrl(imageUrl);
                    console.log(imageUrl);
                  } else {
                    alert('Erro ao enviar imagem');
                  }
                }
              }}
            />
          </label>

          <div className={styles.form_buttons}>
            <button className={styles.btn_submit} disabled={loading}>
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
