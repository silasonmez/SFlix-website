import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './HomePage.css';
import axios from 'axios';
import background from '../assets/background.jpg';

// FontAwesome İkonları
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

interface Favorite {
  id: number;
  title: string;
  description: string;
  type: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5114/api/Favorites', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });

        // Gelen veriden $values kısmını çek
        const data = response.data?.$values || [];
        setFavorites(data);
      } catch (err: any) {
        console.error(err);
        setError('Favoriler alınırken bir hata oluştu.');
      }
    };

    fetchFavorites();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="homepage-container" style={{ backgroundImage: `url(${background})` }}>
      <h1 className="homepage-title">Hoşgeldiniz!</h1>
      <h2 className="homepage-subtitle">Ne İzlemek İstersiniz?</h2>
      <h3 className="featured-title">Editörün Seçimleri</h3>

      {/* Hata Mesajı */}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {/* Slider */}
      <div className="slider-section">
        {favorites.length > 0 ? (
          <Slider {...sliderSettings} className="slider-container">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="card">
                <h3>{favorite.title}</h3>
                <p>{favorite.description}</p>
                <button className="add-favorite-button">
                  <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                </button>
              </div>
            ))}
          </Slider>
        ) : (
          <p style={{ textAlign: 'center', color: 'gray' }}>
            Öne çıkan içerik bulunmamaktadır.
          </p>
        )}
      </div>

      {/* Kategoriler */}
      <div className="categories-section">
        <button className="category-button" onClick={() => navigate('/diziler')}>
          Diziler
        </button>
        <button className="category-button" onClick={() => navigate('/filmler')}>
          Filmler
        </button>
      </div>
    </div>
  );
};

export default HomePage;
