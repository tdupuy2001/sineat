import React, { useContext, useState, useCallback } from "react";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./Profile.css";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCog, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { PostService } from "../../services/PostService";
import { Post } from "../../dto/Post";

export function Profile() {
  const userService = new UserService(config.API_URL);
  const context = useContext(MyBlogContext);
  const { usernameLink } = useParams(); // Permet de prendre la page profil du bon user
  const [list_blob_abonne, setListBlobAbonne] = useState<
    { blob: Blob; username: string }[]
  >([]);
  const [list_blob_abonnement, setListBlobAbonnement] = useState<
    { blob: Blob; username: string }[]
  >([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [mainPostIds, setMainPostIds] = useState<number[]>([]);

  // TODO: mettre les images et pour se faire j'ai pensé à quand je prends les posts 
  // faut que je prenne en même temps une image que je mets dans le post en tant qu'image data 
  // quoi comme je fais avec les user juste la il faudra faire une requete sql sur la bdd pour 
  // avoir la premiere (id le plus bas) et puis une fois que ca c'est fait il faudra refaire 
  // la même chose avec les blob etc pour charger un maximum de photo

  const username = localStorage.getItem("username") || "";

  const [nb_abonnement, setNbAbonnement] = useState<number>();
  const [nb_abonne, setNbAbonne] = useState<number>();
  const [abonnement, setAbonnement] = useState<string[]>();
  const [abonne, setAbonne] = useState<string[]>();
  const [description, setDescription] = useState<string | undefined>();

  const [isSub, setSub] = useState(false);

  const [abonneIsOpen, setAbonneIsOpen] = useState(false);
  const [abonnementIsOpen, setAbonnementIsOpen] = useState(false);

  const [blobPhotoProfil, setBlobPhotoProfil] = useState<Blob>();

  // Gestion de la photo de profil
  useEffect(() => {
    if (usernameLink) {
      userService
        .getUser(usernameLink)
        .then((response) => {
          const profileUser = response.data.user;
          setMainPostIds(response.data.main_post_ids);
          const pp = profileUser.ppbin;
          let propic = "data:image/png;base64," + pp;
          setDescription(profileUser.description);
          if (propic) {
            let byteCharacters = atob(propic.split(",")[1]);
            let byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            setBlobPhotoProfil(new Blob([byteArray], { type: "image/png" })); // Mettre à jour l'état ici
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      userService.communityUser(usernameLink).then((response) => {
        setNbAbonnement(response.data.nb_abonnement);
        setNbAbonne(response.data.nb_abonne);
        setAbonnement(response.data.liste_abonnement);
        setAbonne(response.data.liste_abonne);
      });
    }
  }, [usernameLink]);

  //
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
    if (usernameLink) {
      userService.findFollow(username, usernameLink).then((response) => {
        setSub(response.data);
      });
    }
  }, [nb_abonne]);

  useEffect(() => {
    if (abonne) {
      let abonne_temporaire: { blob: Blob; username: string }[] = [];
      for (const abonneUsername of abonne) {
        userService
          .getUser(abonneUsername)
          .then((response) => {
            const profileUser = response.data.user;
            let profilePicture = "data:image/png;base64," + profileUser.ppbin;
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
            abonne_temporaire.push(newBlobWithUsername);
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }
      setListBlobAbonne(abonne_temporaire);
    }
  }, [abonne]);

  useEffect(() => {
    if (abonnement) {
      let abonnement_temporaire: { blob: Blob; username: string }[] = [];
      for (const abonnementUsername of abonnement) {
        userService
          .getUser(abonnementUsername)
          .then((response) => {
            const profileUser = response.data.user;
            let profilePicture = "data:image/png;base64," + profileUser.ppbin;
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
            abonnement_temporaire.push(newBlobWithUsername);
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }
      setListBlobAbonnement(abonnement_temporaire);
    }
  }, [abonnement]);

  useEffect(() => {
    if (mainPostIds && mainPostIds.length > 0) {
      // Créez une instance de PostService pour récupérer les posts
      const postService = new PostService(config.API_URL);

      // Utilisez Promise.all pour récupérer tous les posts en parallèle
      Promise.all(mainPostIds.map((postId) => postService.getPost(postId)))
        .then((responses) => {
          // Toutes les réponses sont maintenant disponibles
          const postsData = responses.map((response) => response.data);
          setPosts(postsData); // Mettez à jour l'état avec les données des posts
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }
  }, [mainPostIds]);

  const handleLogout = () => {
    context.setUser(null);
    sessionStorage.removeItem("username");
    localStorage.removeItem("username");
  };

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

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <img
            className="profile-picture"
            src={blobPhotoProfil ? URL.createObjectURL(blobPhotoProfil) : ""}
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
          {posts.map((post, index) => (
            <div key={index} className="post">
              <h2>{post.titre_post}</h2>
              <p>{post.text}</p>
              {/* Autres détails du post */}
            </div>
          ))}
          {/* <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div> */}
        </div>
      </div>
      <Modal
        isOpen={abonneIsOpen}
        onRequestClose={closeAbonne}
        contentLabel="Abonne Modal"
        style={{
          content: {
            background: "#FAF6F1",
            padding: "0px",
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
            {list_blob_abonne &&
              list_blob_abonne
                .sort((a, b) => a.username.localeCompare(b.username))
                .map(({ blob, username }) => (
                  <li key={username} id="list_username">
                    <NavLink
                      to={`/profile/${username}`}
                      onClick={closeAbonne}
                      className="username_link"
                    >
                      <img
                        src={blob ? URL.createObjectURL(blob) : ""}
                        className="username_img"
                      />
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
            padding: "0px",
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
            {list_blob_abonnement &&
              list_blob_abonnement
                .sort((a, b) => a.username.localeCompare(b.username))
                .map(({ blob, username }) => (
                  <li key={username} id="list_username">
                    <NavLink
                      to={`/profile/${username}`}
                      onClick={closeAbonnement}
                      className="username_link"
                    >
                      <img
                        src={blob ? URL.createObjectURL(blob) : ""}
                        className="username_img"
                      />
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
