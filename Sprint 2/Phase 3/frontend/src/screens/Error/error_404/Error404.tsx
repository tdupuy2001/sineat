import React from "react";
import './Error404.css'
import Navbar from "../../../components/Navbar/Navbar";
import { NavLink } from "react-router-dom";


export function Error404() {

  
  return (
    <div className="container-error-page">
      <Navbar></Navbar>
      <div className="error-container">
        <h1 id="er404">404</h1>
        <p id="text-error">Désolé, la page que vous recherchez n'a pas pu être trouvée.</p>
        <NavLink to="/">
          <button id="error-button">Retourner à la page d'accueil</button>
        </NavLink>
      </div>
    </div>
    
  
    
  )
}

export default Error404