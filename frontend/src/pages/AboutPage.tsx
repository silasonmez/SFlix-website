import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-box">
        <h1>Sflix’e Hoş Geldiniz!</h1>
        <p>
          Burada, sevdiğiniz türlere göre dizi ve film seçmenin keyfini çıkarabilirsiniz. İster kategorilere göre keşfedin, 
          ister en yüksek puanlı yapımları tercih edin, sizin için en iyi önerileri bir araya getiriyoruz.
        </p>
        <p>
          Beğendiğiniz içerikleri favorilerinize ekleyerek kendi özel listenizi oluşturabilirsiniz. Böylece, ne izleyeceğinizi düşünmek yerine, 
          keyfini çıkarmaya daha fazla zaman ayırabilirsiniz!
        </p>
        <p>
          Sflix, izleme deneyiminizi kolaylaştırmak ve keyifli hale getirmek için burada. Bizimle yeni dünyalar keşfetmeye hazır mısınız?
        </p>
        <p><strong>Keyifli seyirler dileriz!</strong></p>
      </div>

      {/* İletişim Kutucuğu */}
      <div className="contact-box">
        <h2>İletişim</h2>
        <p>📧 Email: sila@sflix.com</p>
        <p>📞 Telefon: +90 123 456 7890</p>
        <p>📍 Adres: İzmir, Türkiye</p>
      </div>
    </div>
  );
};

export default AboutPage;
