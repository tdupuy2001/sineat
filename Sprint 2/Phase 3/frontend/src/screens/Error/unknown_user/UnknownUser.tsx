import React from "react";
import './UnknownUser.css'
import Navbar from "../../../components/Navbar/Navbar";
import { NavLink } from "react-router-dom";
import Img from './unknown_user.png';


export function UnknownUser() {

  
  return (
    <div className="container-error-page">
      <Navbar></Navbar>
      <div className="error-container">
        <img src={Img}/>
        <p id="text-error">Désolé, l'utilisateur que vous recherchez n'a pas pu être trouvé.</p>
        <NavLink to="/">
          <button id="error-button">Retourner à la page d'accueil</button>
        </NavLink>
      </div>
    </div>
    
  
    
  )
}

export default UnknownUser