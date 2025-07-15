import { useEffect, useState } from 'react';
import { getTopGames } from '../../services/GameService';
import { useAuthContext } from '../../contexts/authContext';
import styles from './RankingGames.module.css';

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

const RankingGames = () => {
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthContext();

  useEffect(() => {
    const fetchTopGames = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) throw new Error('Token ausente.');
        const data = await getTopGames(token);
        setTopGames(data.results);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar jogos.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopGames();
  }, [token]);

  return (
    <div className={styles.container}>
      <h2>Top Games</h2>
      <div className={styles.loading}>{loading && <p>Carregando jogos...</p>}</div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul className={styles.rank_list}>
        {topGames.map(game => (
          <li key={game.id}>
            <img src={game.background_image} alt={game.name} width={150} />
            <h3>{game.name}</h3>
            <p>Nota: {game.rating.toFixed(1)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingGames;
