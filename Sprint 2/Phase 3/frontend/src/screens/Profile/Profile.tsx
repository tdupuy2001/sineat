import React, {useCallback, useContext, useState} from "react";
import { Alert, AlertColor, TextField } from "@mui/material";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useParams } from 'react-router-dom';
import { useEffect } from "react";

import Divider from '../../components/Divider/Divider'

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { User } from "../../dto/User";

export function Profile() {



  const _ = "";

  const navigate = useNavigate();

  const context = useContext(MyBlogContext);


  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('username') || '';
  });

  // ...

  useEffect(() => {
    if (context.user) {
      setUsername(context.user.username);
      localStorage.setItem('username', context.user.username);
    } else {
        setUsername("")
    }
  }, [context.user]);





  const { usernameLink } = useParams(); // Permet de prendre la page profil du bon user 
  useEffect(() => {
    console.log(`username: '${username}'`);
    console.log(`usernameLink: '${usernameLink}'`);
  }, [username, usernameLink]);



  
  return (
    
    <div>
      <Navbar />
      <div className="accueil-container">
        <div className="two-columns">
          <div className="column">
            <div className="image-grid">
              {/* <img src={imageList[currentImageIndex1]} alt="Current Image" /> */}
              {/* <img src={imageList[currentImageIndex2]} alt="Current Image" /> */}
            </div>
            <p />
            <div className="image-grid">
              {/* <img src={imageList[currentImageIndex3]} alt="Current Image" /> */}
              {/* <img src={imageList[currentImageIndex4]} alt="Current Image" /> */}
            </div>
          </div>
          <div className="column">
            {/* <img src={Img} alt="Logo" /> */}
            <p className='text1'>Votre partenaire sans gluten au quotidien</p>
            <p className='text2'>Retrouvez des adresses sans gluten près de chez vous</p>
            <div className="buttons">
              <NavLink to="/map">
                <button>Découvrez notre carte intéractive</button>
              </NavLink>
              <h2>Profil de {usernameLink}</h2>
              {username == usernameLink && (
                    <NavLink to="/update-profile">
                    <button>Update Profile</button>
                    </NavLink>
                )}
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
}

export default Profile
