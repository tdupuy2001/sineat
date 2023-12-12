import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './About.css';
import Img1 from './assets/test.png';
import Img2 from './assets/about1.jpg';
import Img3 from './assets/about2.jpg';
import Img4 from './assets/about3.jpg';
import Img5 from './assets/about4.jpg';
import Img6 from './assets/about5.jpg';
import { Link, useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className='cont-main'>
      <Navbar />
      <div className='content-about'>
        <div className='block-about'>
          <div className='block-text'>
            <div className='sineat-heading'>Le projet SINEAT</div>
            <div>Chez SINEAT, nous croyons que manger sans gluten ne devrait jamais signifier sacrifier le plaisir de la découverte culinaire.</div>
          </div>
          <img src={Img3} alt="Img-cont" className='Img-About' />
          <div className='block-text'>
            <div className='sineat-heading'>Notre mission</div>
              <div>
                Au-delà d'être une simple liste d'adresses, notre application constitue une communauté dynamique engagée à rendre votre parcours sans gluten aussi délicieux et pratique que possible.
                <p/>
                Explorez un univers où les passionnés de la vie sans gluten partagent leurs expériences, découvrent des joyaux culinaires adaptés, et tissent des liens au sein d'une communauté qui comprend vos besoins alimentaires uniques.
              </div>
          </div>
          <img src={Img4} alt="Img-cont" className='Img-About' />
          <div className='block-text'>
            Bienvenue dans une plateforme qui célèbre la diversité des saveurs sans gluten tout en facilitant votre exploration gourmande.
          </div>
        </div>

        <div className='block-about'>
            <img src={Img2} alt="Img-cont" className='Img-About' />
            <div className='block-text'>
              <div>Notre application est bien plus qu'une simple liste d'adresses.
              <p/>
              C'est une communauté dynamique dédiée à rendre votre voyage sans gluten aussi savoureux et simple que possible. </div>
            </div>
            <img src={Img6} alt="Img-cont" className='Img-About' />
            <div className='block-text'>
              <div> Que vous recherchiez des recommandations, des conseils ou simplement l'inspiration pour vos repas sans gluten, notre application offre bien plus qu'une simple utilité pratique : elle crée une expérience enrichissante et connectée pour chaque étape de votre voyage culinaire.</div>
            </div>
            <img src={Img5} alt="Img-cont" className='Img-About' />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
