import React from 'react';
import './About.css';
import Img from './assets/SIN-2-NoBG.png';
import Img1 from './assets/test.png';
import { Link,  useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/searchbar';

function About() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login")
  };

  return (
    <div className='cont-Main'>
      <div className='navbar'>
        <img src={Img} alt="Img-logo" className='logo-nav' />
        <div className='navbar-main'>
          <div className='search-login'>
            <SearchBar />
            <button className='btn-login' onClick={handleLogin}>Se connecter</button>
          </div>
          <div className='navItems'>
            <ul className='navlist'>
              <li><Link className='item' to="/">Acceuil</Link></li>
              <li><Link className='item' to="/map">Notre carte</Link></li>
              <li><Link className='item' to="/news">Fil d'actualité</Link></li>
              <li><Link className='item current' to="/about">Qui sommes nous ?</Link></li>
              <li><Link className='item' to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className='content-about'>
        <div className='block-about'>
          <div className='block-text'>
            <div>Le projet SINEAT</div>
            <div>Chez SINEAT, nous croyons que manger sans gluten ne devrait jamais signifier sacrifier le plaisir de la découverte culinaire.</div>
          </div>
          <img src={Img1} alt="Img-cont" className='Img-About' />
        </div>
        <div className='block-about'>
            <img src={Img1} alt="Img-cont" className='Img-About' />
            <div className='block-text'>
              <div>Notre application est bien plus qu'une simple liste d'adresses.</div>
              <div>C'est une communauté dynamique dédiée à rendre votre voyage sans gluten aussi savoureux et simple que possible.</div>
            </div>
        </div>
      </div>
      <div className='footer-main'></div>
    </div>
  );
}

export default About;
