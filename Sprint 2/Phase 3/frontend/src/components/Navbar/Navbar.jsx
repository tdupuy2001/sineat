import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "./logo_sineat.png";
// import img from '../../screens/Login/assets/user.png'
import { MyBlogContext } from "../../MyBlogContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const context = useContext(MyBlogContext);
  // const { user } = useContext(MyBlogContext);
  const [username, setUsername] = useState(sessionStorage?.getItem("username"));
  const [nom, setNom] = useState(sessionStorage?.getItem("nom"));

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const handleList = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    setUsername("null");
    setIsLoggedIn(false);
    setOpen(false);
    sessionStorage.removeItem("username");
  };
  let blob = null;

  useEffect(() => {
    if (context.user) {
      setUsername(context.user?.username);
      setIsLoggedIn(true);

      setProfilePicture("data:image/png;base64," + context.user.ppbin);
      console.log(profilePicture);
      // console.log(profilePicture)

      // Extract the profile image binary and format from user object
      // if (user.ppbin) {
      //   const base64Image = ;
      //   setProfileImage(base64Image);
      // }
    }
  }, [context.user]);

  if (profilePicture) {
    let byteCharacters = atob(profilePicture.split(",")[1]);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], { type: "image/png" });
  }

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

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
            {<img src={blob ? URL.createObjectURL(blob) : ""} alt="Profile" />}
            <NavLink to={`/profile/${username}`} className="profile-link">
              {username}
            </NavLink>
            <p className="profile">{nom}</p>
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
