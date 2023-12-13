import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Navbar.css';
import logo from './logo_sineat.png';
import { MyBlogContext } from '../../MyBlogContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Description } from '@mui/icons-material';

export default function Navbar() {
  const { user } = useContext(MyBlogContext);
  const [username, setUsername] = useState(sessionStorage?.getItem("username"));
  const [nom, setNom] = useState(sessionStorage?.getItem("nom"));

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleList = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    setUsername("null");
    setIsLoggedIn(false);
    setOpen(false);
    sessionStorage.removeItem("username");
  };

  useEffect(() => {
    if (user) {
      setUsername(user?.username);
      setIsLoggedIn(true);
      // Extract the profile image binary and format from user object
      const { ppbin, ppform } = user;
      if (ppbin && ppform) {
        const base64Image = `data:${ppform};base64,${ppbin}`;
        setProfileImage(base64Image);
      }
    }
  }, [user]);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className='fixed-navbar'>
      <div className="logo">
        <NavLink to="/" exact>
          <img src={logo} alt="Logo" />
        </NavLink>
      </div>

      <ul className="nav-links">
        <li><NavLink className="item" activeClassName="current" to="/" exact>Accueil</NavLink></li>
        <li><NavLink className="item" activeClassName="current" to="/map">La carte collaborative</NavLink></li>
        <li><NavLink className="item" activeClassName="current" to="/news">Fil d'actualité</NavLink></li>
        <li><NavLink className="item" activeClassName="current" to="/about">Qui sommes-nous ?</NavLink></li>
        <li><NavLink className="item" activeClassName="current" to="/contact">Contact</NavLink></li>
      </ul>

      <div className="login-button">
        {isLoggedIn ? (
          <div className="user-info">
            {profileImage && <img src={profileImage} alt="Profile" />}
            <NavLink to={`/profile/${username}`} className="profile-link">{username}</NavLink>
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