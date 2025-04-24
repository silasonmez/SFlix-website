import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CategoryContentPage.module.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  duration: string;
  imdbRating: number;
}

interface Series {
  id: number;
  title: string;
  description: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
}

const CategoryContentPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // URL'den kategori ID'si alınır
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategoryContent = async () => {
      try {
        // Kategori adı getir
        const categoryResponse = await fetch(
          `http://localhost:5114/api/Categories/${categoryId}`
        );
        const categoryData = await categoryResponse.json();
        setCategoryName(categoryData.name);

        // Filmleri getir
        const moviesResponse = await fetch(
          `http://localhost:5114/api/MoviesCategories/category/${categoryId}`
        );
        const moviesData = await moviesResponse.json();
        setMovies(moviesData);

        // Dizileri getir
        const seriesResponse = await fetch(
          `http://localhost:5114/api/SeriesCategories/category/${categoryId}`
        );
        const seriesData = await seriesResponse.json();
        setSeries(seriesData);
      } catch (err: any) {
        setError('Veriler alınırken bir hata oluştu: ' + err.message);
      }
    };

    fetchCategoryContent();
  }, [categoryId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {categoryName} Kategorisi İçeriği
      </h1>
      {error && <p className={styles.error}>{error}</p>}

      {/* Filmler */}
      <h2 className={styles.sectionTitle}>Filmler</h2>
      <div className={styles.grid}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <h4 className={styles.cardTitle}>{movie.title}</h4>
              <div className={styles.cardHover}>
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
                <p><strong>Yıl:</strong> {movie.releaseYear}</p>
                <p><strong>Süre:</strong> {movie.duration}</p>
                <p><strong>Puan:</strong> {movie.imdbRating}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.error}>Bu kategoride film bulunmamaktadır.</p>
        )}
      </div>

      {/* Diziler */}
      <h2 className={styles.sectionTitle}>Diziler</h2>
      <div className={styles.grid}>
        {series.length > 0 ? (
          series.map((serie) => (
            <div key={serie.id} className={styles.card}>
              <h4 className={styles.cardTitle}>{serie.title}</h4>
              <div className={styles.cardHover}>
                <h3>{serie.title}</h3>
                <p>{serie.description}</p>
                <p><strong>Sezon Sayısı:</strong> {serie.numberOfSeasons}</p>
                <p><strong>Bölüm Sayısı:</strong> {serie.numberOfEpisodes}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.error}>Bu kategoride dizi bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryContentPage;
