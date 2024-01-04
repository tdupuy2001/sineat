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


export function Profile() {


  const navigate = useNavigate();
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
            <div className="buttons">
            {username == usernameLink && (
                <NavLink to="/">
                <button onClick={handleLogout}>Deconnexion</button>
              </NavLink>
              )}
              <img src={`${img}`} alt="User" style= {{width: '100px', height: '100px', objectFit: 'cover'}} /> {/* je dois changer parce que c'est bien sur pas le context de l'image mais d'un getUser avec le nom du machin*/}
              <h2>Profil de {usernameLink}</h2>
              {username == usernameLink && (
                    <NavLink to={`/updateprofile/${usernameLink}`}>
                    <button>Update Profile</button>
                    </NavLink>
                )}
            </div>
            <h2>{nb_abonne} Abonné</h2>
            <h2>{nb_abonnement} Abonnement</h2>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile
