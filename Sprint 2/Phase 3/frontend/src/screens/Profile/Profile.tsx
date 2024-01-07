import React, {useContext, useState} from "react";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useParams } from 'react-router-dom';
import { useEffect } from "react";
import img from "./assets/profile.png"
import './Profile.css';


export function Profile() {

  const userService = new UserService(config.API_URL);
  const context = useContext(MyBlogContext);

  useEffect(() => {
    if (context.user) {
      setUsername(context.user?.username)
      setIsLoggedIn(true)
    }
    if(usernameLink){
      userService.getUser(usernameLink)
    }
  }, [context.user])
  

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [profileImage, setPP] = useState<File | null>(null);


  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('username') || '';
  });


  const handleLogout = () => {

    context.setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("username");
    localStorage.removeItem("username");

  };

  useEffect(() => {
    if (context.user) {
      setUsername(context.user.username);
    } else {
        setUsername("")
    }
  }, [context.user]);


  // const urlToFile = async (url: string, filename: string, mimeType: any) => {
  //   const res = await fetch(url);
  //   const blob = await res.blob();
  //   return new File([blob], filename, { type: mimeType });
  // };


  const { usernameLink } = useParams(); // Permet de prendre la page profil du bon user 
  // useEffect(() => {
  //   if (context.user?.ppbin){
  //     urlToFile(context.user.ppbin, `image.${context.user.ppform}`, `image/${context.user.ppform}`)
  //       .then(image => {
  //         // Do something with the image File object here
  //         setPP(image)
  //       })
  //       .catch(error => {
  //         console.error('Error converting URL to file:', error);
  //       });
  //   }
  //   console.log(`username: '${username}'`);
  //   console.log(`usernameLink: '${usernameLink}'`);
  // }, [username, usernameLink]);

  // gérer les abonnements/abonnés
  const [nb_abonnement, setAbonnement] = useState<number>();
  const [nb_abonne, setAbonne] = useState<number>();
  useEffect(() => {
    if (usernameLink) {
      userService.communityUser(usernameLink).then((response) => {
      setAbonnement(response.data[0]);
      setAbonne(response.data[1]); 
      });
    }
   }, [usernameLink]);


  const [isSub, setSub] = useState(false);
  useEffect(() => {
    if (usernameLink) {
      userService.findFollow(username,usernameLink).then((response) => {
      setSub(response.data)
      });
    }
  }, [usernameLink]);

  
   const handleFollow = () => {
    if (usernameLink) {
      userService.handleFollow(username,usernameLink)
        .then(() => {
          userService.communityUser(usernameLink).then((response) => {
            setAbonnement(response.data[0]);
            setAbonne(response.data[1]);
          });
          userService.findFollow(username,usernameLink).then((response) => {
            setSub(response.data)
          });
        });
    }
   }

 

   // ...
return (
  <div>
    <Navbar />
    <div className="profile-container">
      <div className="profile-header">
        <img className="profile-picture" src={img} alt="Profile" />
        <div className="profile-info">
          <h2>Profil de {usernameLink}</h2>
          <div className="subscribers">
            <span>{nb_abonne} Abonné</span>
            <span>{nb_abonnement} Abonnement</span>
          </div>
          <div className="buttons">
            {username == usernameLink && (
              <>
                <NavLink to="/">
                  <button onClick={handleLogout}>Deconnexion</button>
                </NavLink>
                <NavLink to={`/updateprofile/${usernameLink}`}>
                  <button>Update Profile</button>
                </NavLink>
              </>
            )}
            {username!=usernameLink &&(
              <NavLink to={`/profile/${usernameLink}`}>
                <button onClick={handleFollow}>{isSub ? 'Unfollow' : 'Follow'}</button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
      <div className="collections-section">
        <div className="collection"></div>
        <div className="collection"></div>
        <div className="collection"></div>
        {username == usernameLink && (
          <div className="add-collection">
            <p>&#43;</p>
          </div>
        )};        
      </div>
      <div className="posts-section">
        <div className="post"></div>
        <div className="post"></div>
        <div className="post"></div>
        <div className="post"></div>
        <div className="post"></div>
        <div className="post"></div>
        <div className="post"></div>
      </div>
    </div>
    <Footer />
  </div>
 );
}

export default Profile
