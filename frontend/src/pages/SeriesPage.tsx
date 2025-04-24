import React, { useEffect, useState } from 'react';
import { getSeries } from '../services/api';
import styles from './SeriesPage.module.css';

interface Category {
  id: number;
  name: string;
}

interface Series {
  id: number;
  title: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  rating: number;
  description: string;
  startYear: number;
  endYear: number | null;
  categories: {
    $values: Category[];
  };
}

const SeriesPage: React.FC = () => {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getSeries();
        setSeriesList(data.$values); // Yeni JSON formatına göre $values alanı işleniyor
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchSeries();
  }, []);

  return (
    <div className={styles['series-container']}>
      <h1 className={styles.title}>Diziler</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {seriesList.map((series) => (
          <div key={series.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{series.title}</h2>
            <div className={styles.cardHover}>
              <h2 className={styles.hoverTitle}>{series.title}</h2>
              <p><strong>Sezon:</strong> {series.numberOfSeasons}</p>
              <p><strong>Bölüm:</strong> {series.numberOfEpisodes}</p>
              <p><strong>Puan:</strong> {series.rating}</p>
              <p><strong>Yıllar:</strong> {series.startYear} - {series.endYear || 'Devam Ediyor'}</p>
              <p className={styles.description}>{series.description}</p>
              <p>
                <strong>Kategoriler:</strong>{' '}
                {series.categories.$values.length > 0
                  ? series.categories.$values.map((cat) => cat.name).join(', ')
                  : 'Kategori Yok'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesPage;
