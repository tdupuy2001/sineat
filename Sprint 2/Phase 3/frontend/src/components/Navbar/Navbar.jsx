import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo_sineat.png";
// import img from '../../screens/Login/assets/user.png'
import { MyBlogContext } from "../../MyBlogContext";

export default function Navbar() {
  const context = useContext(MyBlogContext);
  
  const [username, setUsername] = useState(sessionStorage?.getItem("username"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [blobPhotoProfil, setBlobPhotoProfil] =useState(); //bizarrement lui ne peut pas être typé alors que celui de profil si
  

  useEffect(() => {
    if (context.user) {
      setUsername(context.user.username);
      setIsLoggedIn(true);
      const pp = context.user.ppbin
      let propic = "data:image/png;base64," + pp
      if (propic) {
        let byteCharacters = atob(propic.split(",")[1]);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        setBlobPhotoProfil(new Blob([byteArray], { type: "image/png" })); // Mettre à jour l'état ici
      }
    };

    }, [context.user]);


  return (
    <nav className="fixed-navbar">
      <div className="logo">
        <NavLink to="/" exact>
          <img src={logo} alt="Logo" />
        </NavLink>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink className="item" activeClassName="current" to="/" exact>
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink className="item" activeClassName="current" to="/map">
            La carte collaborative
          </NavLink>
        </li>
        <li>
          <NavLink className="item" activeClassName="current" to="/news">
            Fil d'actualité
          </NavLink>
        </li>
        <li>
          <NavLink className="item" activeClassName="current" to="/about">
            Qui sommes-nous ?
          </NavLink>
        </li>
        <li>
          <NavLink className="item" activeClassName="current" to="/contact">
            Contact
          </NavLink>
        </li>
      </ul>

      <div className="login-button">
        {isLoggedIn ? (
          <div className="user-info">
            {<img src={blobPhotoProfil ? URL.createObjectURL(blobPhotoProfil) : ""} alt="Profile" />}
            <NavLink to={`/profile/${username}`} className="profile-link">
              {username}
            </NavLink>
          </div>
        ) : (
          <NavLink to="/login">
            <button>Se connecter</button>
          </NavLink>
        )}
      </div>
    </nav>
  );
}
