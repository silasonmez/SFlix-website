import React, { useEffect, useState } from 'react';
import { getMovies } from '../services/api';
import styles from './MoviesPage.module.css';


interface Category {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  duration: string;
  imdbRating: number;
  description: string;
  categories: {
    $values: Category[];
  };
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data.$values); // Yeni JSON formatındaki $values alanını alıyoruz
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Filmler</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{movie.title}</h2>
            <div className={styles.cardHover}>
              <h2 className={styles.hoverTitle}>{movie.title}</h2>
              <p><strong>Yıl:</strong> {movie.releaseYear}</p>
              <p><strong>Süre:</strong> {movie.duration}</p>
              <p><strong>Puan:</strong> {movie.imdbRating}</p>
              <p className={styles.description}>{movie.description}</p>
              <p>
                <strong>Kategoriler:</strong>{' '}
                {movie.categories.$values.length > 0
                  ? movie.categories.$values.map((cat) => cat.name).join(', ')
                  : 'Kategori Yok'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
