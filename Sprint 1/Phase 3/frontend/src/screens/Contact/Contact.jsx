import React from 'react';
import './Contact.css';
import Img from './assets/SIN-2-NoBG.png';
import Img1 from './assets/test.png';
import { Link,  useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/searchbar'

function Contact() {
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
              <li><Link className='item' to="/about">Qui sommes nous ?</Link></li>
              <li><Link className='item current' to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className='content-Contact'>
        <div>
            <img src={Img1} alt="Img-cont" className='Img-Contact' />
            <img src={Img1} alt="Img-cont" className='Img-Contact' />
            <img src={Img1} alt="Img-cont" className='Img-Contact' />
            <img src={Img1} alt="Img-cont" className='Img-Contact' />
            <img src={Img1} alt="Img-cont" className='Img-Contact' />
            <div className='title-contact'>CONTACT</div>
        </div>
      </div>
      <div className='footer-Contact'>
        <div className='mail-text'>Une question, une bonne adresse à partager, envie de rejoindre l'aventure SINEAT ou pour toute autre chose, nous serons ravis de discuter avec vous.</div>
        <div className='mail'>contact@sineat.fr</div>
      </div>
    </div>
  );
}

export default Contact;