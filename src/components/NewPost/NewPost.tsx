import styles from './NewPost.module.css';
import { useAuthContext } from '../../contexts/authContext';
import { searchGames } from '../../services/GameService';
import { useEffect, useState, type FormEvent } from 'react';
import { usePost } from '../../hooks/usePost';
import { useUpload } from '../../hooks/useUpload';
import type { PostData } from '../../types/types';

type Game = {
  id: number;
  name: string;
  released: string;
  rating: number;
  background_image: string;
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  stores: { id: number; name: string }[];
};

type NewPostProps = {
  onPostCreated: () => void;
};

const NewPost = ({ onPostCreated }: NewPostProps) => {
  const { user, token } = useAuthContext();
  const { uploadImage } = useUpload();
  const { submitPost, loading, error, success } = usePost();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const [titlePost, setTitlePost] = useState('');
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [imageUrl, setImageURL] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(
      () => {
        if (search.length > 0) {
          fetchSuggestions();
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }

        if (success) {
          setTimeout(() => {
            setShowCreatePost(false);
          }, 0);
        }
      },
      100,
      [success],
    );

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchSuggestions = async () => {
    if (!token) {
      console.log('Usuário não identificado');
      return;
    }

    const results = (await searchGames(search, token)) || [];
    setSuggestions(results);
    setShowDropdown(results.length > 0);
  };

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setShowDropdown(false);
    setSearch(game.name);
  };

  // const handleCloseModal = () => {
  //   setSelectedGame(null);
  // };

  const authorId = user?.id;

  if (!authorId) {
    console.error('Usuário não encontrado');
    return;
  }

  const handleSubmitPost = async () => {
    if (!token || !user) {
      alert('Usuário não autenticado.');
      return;
    }

    if (!selectedGame || !userReview || userRating === 0) {
      alert('Preencha todos os campos!');
      return;
    }

    const data: PostData = {
      authorId: String(user.id),
      gameId: selectedGame.id,
      title: titlePost,
      content: userReview,
      imageURL: imageUrl,
      rate: userRating,
    };

    try {
      await submitPost(data);
      console.log('Post realizado com sucesso!');
      onPostCreated();
      setShowCreatePost(false);
      setUserReview('');
      setUserRating(0);
      setSelectedGame(null);
      setSearch('');
    } catch (err: any) {
      console.log(err.message || 'Erro inesperado ao tentar criar post.');
    }
  };
  return (
    <>
      <div className={styles.newpost_container}>
        <div className={styles.newpost_content}>
          <div className={styles.newpost_data}>
            <div className={styles.profile}>
              {user ? <img src={user.avatarUrl} alt="profile" /> : <i className="fas fa-user"></i>}
            </div>
            <form onSubmit={e => e.preventDefault()}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search && setShowDropdown(true)}
                placeholder="Procure o jogo desejado..."
              />
              {showDropdown && (
                <ul className={styles.dropdown_list}>
                  {suggestions.map(game => (
                    <li key={game.id} onClick={() => handleSelectGame(game)}>
                      <img
                        src={game.background_image}
                        alt={game.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                        }}
                      />
                      <p>{game.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
          <div className={styles.newpost_buttons}>
            <button
              type="button"
              disabled={!selectedGame}
              onClick={() => selectedGame && setShowCreatePost(true)}
            >
              Postar
            </button>
          </div>
        </div>
      </div>
      {showCreatePost && selectedGame && (
        <div className={styles.modal_overlay} onClick={() => setShowCreatePost(false)}>
          <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
            <h2>{selectedGame.name}</h2>
            <div className={styles.modal_header}>
              <img src={selectedGame.background_image} alt={selectedGame.name} />
              <div className={styles.modal_infos}>
                <p>
                  <strong>Lançamento:</strong> {selectedGame.released}
                </p>
                <p>
                  <strong>Nota do game:</strong> {selectedGame.rating.toFixed(1)} / 5
                </p>
                <p>
                  <strong>Gêneros:</strong> {selectedGame.genres.map(g => g.name).join(', ')}
                </p>
                <p>
                  <strong>Plataformas:</strong> {selectedGame.platforms.map(p => p.name).join(', ')}
                </p>
                <p>
                  <strong>Lojas:</strong> {selectedGame.stores.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>
            <div className={styles.modal_data}>
              <label className={styles.title_post}>
                <span>Título do post:</span>
                <input
                  type="text"
                  value={titlePost}
                  onChange={e => setTitlePost(e.target.value)}
                  placeholder="Dê um título para o seu Post."
                />
              </label>

              <div className={styles.post_review}>
                <textarea
                  placeholder="Compartilhe o que achou desse jogo..."
                  value={userReview}
                  onChange={e => setUserReview(e.target.value)}
                />
                <label className={styles.assets_button}>
                  <span>
                    <i className="fa-regular fa-image"></i>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = await uploadImage(file);
                        if (imageUrl) {
                          setImageURL(imageUrl);
                        } else {
                          alert('Erro ao enviar imagem');
                        }
                      }
                    }}
                  />
                </label>
              </div>

              <div className={styles.stars}>
                <p>Dê a sua nota para este jogo:</p>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={userRating >= star ? styles.star_filled : styles.star_empty}
                    onClick={() => setUserRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className={styles.submit}>
                <button onClick={handleSubmitPost} disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;
