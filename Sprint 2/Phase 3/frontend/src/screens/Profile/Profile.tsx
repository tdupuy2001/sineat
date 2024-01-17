import React, { useContext, useState } from "react";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
// import img from "./assets/profile.png";
import "./Profile.css";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCog, faSignOut } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const userService = new UserService(config.API_URL);
  const context = useContext(MyBlogContext);
  const [profilePicture, setProfilePicture] = useState<string>();
  const { usernameLink } = useParams(); // Permet de prendre la page profil du bon user

  useEffect(() => {
    if (context.user) {
      setUsername(context.user?.username);
      setIsLoggedIn(true);
    }
    if (usernameLink) {
      userService
        .getUser(usernameLink)
        .then((profileUser) => {
          setProfilePicture("data:image/png;base64," + profileUser.data.ppbin);
          setDescription(profileUser.data.description)
          // console.log(profilePicture);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, [usernameLink, context.user]);

  let blob = null;
  if (profilePicture) {
    let byteCharacters = atob(profilePicture.split(",")[1]);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], { type: "image/png" });
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [profileImage, setPP] = useState<File | null>(null);

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
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
      setUsername("");
    }
  }, [context.user]);

  // const urlToFile = async (url: string, filename: string, mimeType: any) => {
  //   const res = await fetch(url);
  //   const blob = await res.blob();
  //   return new File([blob], filename, { type: mimeType });
  // };

  
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
  const [nb_abonnement, setNbAbonnement] = useState<number>();
  const [nb_abonne, setNbAbonne] = useState<number>();
  const [abonnement, setAbonnement] = useState<string[]>();
  const [abonne, setAbonne] = useState<string[]>();
  const [description, setDescription] = useState<string | undefined>();

  useEffect(() => {
    if (usernameLink) {
      userService.communityUser(usernameLink).then((response) => {
        setNbAbonnement(response.data.nb_abonnement);
        setNbAbonne(response.data.nb_abonne);
        setAbonnement(response.data.liste_abonnement);
        setAbonne(response.data.liste_abonne);
      });
    }
  }, [usernameLink]);

  useEffect(() => {
    if (context.user) {
      setUsername(context.user?.username);
      setIsLoggedIn(true);
    }
  }, [usernameLink, context.user]);


  const [isSub, setSub] = useState(false);
  useEffect(() => {
    if (usernameLink) {
      userService.findFollow(username, usernameLink).then((response) => {
        setSub(response.data);
      });
    }
  }, [usernameLink,context.user]);

  const handleFollow = () => {
    if (usernameLink) {
      userService.handleFollow(username, usernameLink).then(() => {
        userService.communityUser(usernameLink).then((response) => {
          setNbAbonnement(response.data.nb_abonnement);
          setNbAbonne(response.data.nb_abonne);
          setAbonnement(response.data.liste_abonnement);
          setAbonne(response.data.liste_abonne);
        });
        userService.findFollow(username, usernameLink).then((response) => {
          setSub(response.data);
        });
      });
    }
  };

  const [abonneIsOpen, setAbonneIsOpen] = useState(false);
  const [abonnementIsOpen, setAbonnementIsOpen] = useState(false);

  const openAbonne = () => {
    setAbonneIsOpen(true);
  };

  const closeAbonne = () => {
    setAbonneIsOpen(false);
  };

  const openAbonnement = () => {
    setAbonnementIsOpen(true);
  };

  const closeAbonnement = () => {
    setAbonnementIsOpen(false);
  };


const [list_blob_abonne, setListBlobAbonne] = useState<{blob: Blob; username: string }[]>([]);
const [list_blob_abonnement, setListBlobAbonnement] = useState<{blob: Blob; username: string }[]>([]);
useEffect(()=>{
  if (abonne) {
    setListBlobAbonne([])
    for (const abonneUsername of abonne) {
      userService
      .getUser(abonneUsername)
      .then((profileUser) => {
        let profilePicture = "data:image/png;base64," + profileUser.data.ppbin
        let byteCharacters = atob(profilePicture.split(",")[1]);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        const newBlobWithUsername = {
          blob: new Blob([byteArray], { type: "image/png" }),
          username: abonneUsername,
        };
        setListBlobAbonne(prevState => [...prevState, newBlobWithUsername]);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    }
   }
},[abonne,usernameLink]);
  
useEffect(()=>{
  if (abonnement) {
    setListBlobAbonnement([])
    for (const abonnementUsername of abonnement) {
      userService
      .getUser(abonnementUsername)
      .then((profileUser) => {
        let profilePicture = "data:image/png;base64," + profileUser.data.ppbin
        let byteCharacters = atob(profilePicture.split(",")[1]);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        const newBlobWithUsername = {
          blob: new Blob([byteArray], { type: "image/png" }),
          username: abonnementUsername,
        };
        setListBlobAbonnement(prevState => [...prevState, newBlobWithUsername]);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    }
   }
},[abonnement,usernameLink]);

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <img
            className="profile-picture"
            src={blob ? URL.createObjectURL(blob) : ""}
            alt="Profile"
          />
          <div className="profile-info">
            <h2>{usernameLink}</h2>
            <div className="subscribers">
              <button onClick={openAbonne} id="button_sub">
                {" "}
                {nb_abonne} Abonné(s)
              </button>
              <button onClick={openAbonnement} id="button_sub">
                {" "}
                {nb_abonnement} Abonnement(s)
              </button>
            </div>
            <div className="profile-description">
              <p>{description}</p>
            </div>
            <div className="buttons">
              {username == usernameLink && (
                <>
                  <NavLink to={`/updateprofile/${usernameLink}`}>
                    <button>
                      <FontAwesomeIcon icon={faCog} />
                    </button>
                  </NavLink>
                  <NavLink to="/">
                    <button onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOut} />
                    </button>
                  </NavLink>
                </>
              )}
              {username != usernameLink && (
                <NavLink to={`/profile/${usernameLink}`}>
                  <button onClick={handleFollow}>
                    {isSub ? "Unfollow" : "Follow"}
                  </button>
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
          )}
        </div>
        <div className="posts-section">
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
        </div>
      </div>
      <Modal
        isOpen={abonneIsOpen}
        onRequestClose={closeAbonne}
        contentLabel="Abonne Modal"
        style={{
          content: {
            background: "#FAF6F1",
            padding: '0px',
          },
        }}
      >
        <div className="title_sticky">
          <button className="close-button" onClick={closeAbonne}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2>Abonné(s)</h2>
        </div>
        <div>
          <ul>
            {list_blob_abonne && list_blob_abonne.map(({blob, username }) => (
              <li key={username} id="list_username">
                <NavLink
                  to={`/profile/${username}`}
                  onClick={closeAbonne}
                  className="username_link"
                >
                  <img src={blob ? URL.createObjectURL(blob) : ""} className="username_img" />
                  {username}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <Modal
        isOpen={abonnementIsOpen}
        onRequestClose={closeAbonnement}
        contentLabel="Abonnement Modal"
        style={{
          content: {
            background: "#FAF6F1",
            padding: '0px',
          },
        }}
      >
        <div className="title_sticky">
          <button className="close-button" onClick={closeAbonnement}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2>Abonnement(s)</h2>
        </div>
        <div>
          <ul>
            {list_blob_abonnement && list_blob_abonnement.map(({blob, username }) => (
              <li key={username} id="list_username">
                
                <NavLink
                  to={`/profile/${username}`}
                  onClick={closeAbonnement}
                  className="username_link"
                >
                  <img src={blob ? URL.createObjectURL(blob) : ""} className="username_img" />
                  {username}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}

export default Profile;
