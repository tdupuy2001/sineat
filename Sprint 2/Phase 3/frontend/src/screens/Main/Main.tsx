import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Img from './assets/logo_accueil.jpg';
import * as allImages from './assets/list1';
import './Main.css';
import { MyBlogContext } from '../../MyBlogContext';

const Main: React.FC = () => {
  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [currentImageIndex2, setCurrentImageIndex2] = useState(0);
  const [currentImageIndex3, setCurrentImageIndex3] = useState(0);
  const [currentImageIndex4, setCurrentImageIndex4] = useState(0);

  const imageList = Object.values(allImages);
  const navigate = useNavigate();
  const { user } = useContext(MyBlogContext);

  useEffect(() => {
    // Initialisez les index d'images avec des valeurs aléatoires et différentes
    const initialIndex1 = Math.floor(Math.random() * imageList.length);
    let initialIndex2 = Math.floor(Math.random() * imageList.length);
    let initialIndex3 = Math.floor(Math.random() * imageList.length);
    let initialIndex4 = Math.floor(Math.random() * imageList.length);

    // Assurez-vous que les images initiales sont différentes
    while (initialIndex2 === initialIndex1) {
      initialIndex2 = Math.floor(Math.random() * imageList.length);
    }

    while (initialIndex3 === initialIndex1 || initialIndex3 === initialIndex2) {
      initialIndex3 = Math.floor(Math.random() * imageList.length);
    }

    while (initialIndex4 === initialIndex1 || initialIndex4 === initialIndex2 || initialIndex4 === initialIndex3) {
      initialIndex4 = Math.floor(Math.random() * imageList.length);
    }

    setCurrentImageIndex1(initialIndex1);
    setCurrentImageIndex2(initialIndex2);
    setCurrentImageIndex3(initialIndex3);
    setCurrentImageIndex4(initialIndex4);

    const intervalId1 = setInterval(() => {
      setCurrentImageIndex1((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    const intervalId2 = setInterval(() => {
      setCurrentImageIndex2((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    const intervalId3 = setInterval(() => {
      setCurrentImageIndex3((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    const intervalId4 = setInterval(() => {
      setCurrentImageIndex4((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    // Nettoyez les intervalles lors du démontage du composant
    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
    };
  }, [imageList.length]);

  return (
    <div>
      <Navbar />
      <div className="accueil-container">
        <div className="two-columns">
          <div className="column">
            <div className="image-grid">
              <img src={imageList[currentImageIndex1]} alt="Current Image" />
              <img src={imageList[currentImageIndex2]} alt="Current Image" />
            </div>
            <p />
            <div className="image-grid">
              <img src={imageList[currentImageIndex3]} alt="Current Image" />
              <img src={imageList[currentImageIndex4]} alt="Current Image" />
            </div>
          </div>
          <div className="column">
            <img src={Img} alt="Logo" />
            <p className='text1'>Votre partenaire sans gluten au quotidien</p>
            <p className='text2'>Retrouvez des adresses sans gluten près de chez vous</p>
            <div className="buttons">
              <NavLink to="/map">
                <button>Découvrez notre carte intéractive</button>
              </NavLink>
              <NavLink to="/address">
                <button>Partager une adresse</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="accueil-container2">
        <p className='titre'>Le projet SINEAT</p>
        <p className='text'>
        Bienvenue dans l'univers gourmand de SINEAT, où le gluten ne fait pas le poids face à la délicieuse aventure que nous vous proposons. Notre application transcende les simples listes d'adresses pour se métamorphoser en une communauté vibrante, dévouée à rendre votre expérience sans gluten aussi succulente que possible. </p>
        <p className='text'>
        Plongez dans un monde où chaque coin de rue devient une opportunité de déguster des mets exquis sans craindre le gluten. SINEAT n'est pas seulement une application, c'est un compagnon de voyage gastronomique, un guide qui transforme chaque repas sans gluten en une expérience inoubliable.</p>
        <p className='text'>
        Explorez nos fonctionnalités innovantes, où les adresses se transforment en rencontres, et où les établissements deviennent des joyaux découverts par une communauté passionnée. Notre plateforme est bien plus qu'un outil pratique ; elle est le reflet d'une passion commune pour le goût authentique, sans compromis sur la sécurité alimentaire.</p>
        <p className='text'>
        Rejoignez-nous dans cette aventure culinaire sans frontières, où chaque plat est une découverte, chaque échange est une célébration. Que vous soyez un explorateur curieux de nouvelles saveurs sans gluten ou un établissement désireux de se connecter avec une clientèle attentive, SINEAT est votre portail vers un monde où la gourmandise est sans limites et où le gluten est relégué au second plan.</p>
        <p className='text'>
        Bienvenue chez SINEAT, où chaque bouchée est une invitation à savourer la vie sans gluten avec passion et plaisir. Explorez, connectez-vous et délectez-vous de chaque moment culinaire, car chez SINEAT, nous croyons que la liberté gastronomique n'a pas de frontières.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
