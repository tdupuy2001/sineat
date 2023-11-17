import React,{useState,useContext, useEffect} from 'react';
import './Main.css';
import Img from './assets/SIN-2-NoBG.png';
import Img2 from './assets/test.png'
import { Link,  useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/searchbar';

import { MyBlogContext } from "../../MyBlogContext";

export function Main() {

  const context = useContext(MyBlogContext);


  useEffect(() => {
    console.log(MyBlogContext)
  }, [])
  

  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            {isLoggedIn ? (
              <div className='user-info'>
                <span>{userName}!</span>
              </div>
            ) : (
              <button className='btn-login' onClick={handleLogin}>Se connecter</button>
            )}
          </div>
          <div className='navItems'>
            <ul className='navlist'>
              <li><Link className='item current' to="/">Acceuil</Link></li>
              <li><Link className='item' to="/menu">Notre carte</Link></li>
              <li><Link className='item' to="/news">Fil d'actualité</Link></li>
              <li><Link className='item' to="/about">Qui sommes nous ?</Link></li>
              <li><Link className='item' to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className='content'>
        <div className='cont-img'>
          <div className='moza-cont'>
            <div>
            <img src={Img2} alt="Img-cont" className='Img-Cont' />
            <img src={Img2} alt="Img-cont" className='Img-Cont' />
            </div>
            <div>
            <img src={Img2} alt="Img-cont" className='Img-Cont' />
            <img src={Img2} alt="Img-cont" className='Img-Cont' />
            </div>
          </div>
        </div>
        <div className='cont'>
        <img src={Img} alt="Img-cont" className='logo-Cont' />
        <div className='title-logo'>Votre partenaire sans gluten du quotidien</div>
        <div className='text-logo'>Retrouvez des adresses sans gluten près de chez vous </div>
        <div className='btn-cont'>
        <button className='btn-main' >Découvrir la carte</button>
        <button className='btn-main' >Partager une adresse</button>
        </div>
        </div>
      </div>
      <div className='footer-main'>
        <div>Le Projet SINEAT</div>
        <div>Bienvenue sur SINEAT - Découvrez une vie sans gluten, une adresse à la fois.</div>
      </div>
    </div>
  );
}

export default Main;
