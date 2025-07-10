import styles from './NewPost.module.css';
import { useAuthContext } from '../../contexts/authContext';
import { searchGames } from '../../services/GameService';
import { useEffect, useState, type FormEvent } from 'react';
import { usePost } from '../../hooks/usePost';

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

const NewPost = () => {
  const { user, token } = useAuthContext();
  const [search, setSearch] = useState('');
  const { submitPost, loading, error, success } = usePost();
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length > 0) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500);

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

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleSubmitPost = async () => {
    if (!selectedGame || !userReview || userRating === 0) {
      alert('Preencha todos os campos!');
      return;
    }
    try {
      // await submitPost()
      console.log('Post realizado com sucesso!');
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

            <textarea
              placeholder="Compartilhe o que achou desse jogo..."
              value={userReview}
              onChange={e => setUserReview(e.target.value)}
            />

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

            <button onClick={handleSubmitPost}>Publicar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;
