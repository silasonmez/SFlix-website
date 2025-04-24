import React, { useEffect, useState } from 'react';
import styles from './CategoriesPage.module.css';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5114/api/Categories');
        if (!response.ok) {
          throw new Error('Kategoriler alınamadı.');
        }
        const data = await response.json();
        setCategories(data.$values || []); // $values içeriğini alıyoruz
      } catch (err: any) {
        console.error('Hata:', err.message);
        setError('Kategoriler alınırken bir hata oluştu.');
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kategoriler</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link
            to={`/kategoriler/${category.id}`}
            key={category.id}
            className={styles.card}
          >
            <h4 className={styles.cardTitle}>{category.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
