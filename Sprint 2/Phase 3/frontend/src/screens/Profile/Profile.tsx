import {
  faCog,
  faHeart,
  faSignOut,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Modal from "react-modal";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { MyBlogContext } from "../../MyBlogContext";
import Footer from "../../components/Footer/Footer";
import CustomModal from "../../components/Modal/Modal";
import Navbar from "../../components/Navbar/Navbar";
import { config } from "../../config";
import { IdPost } from "../../dto/IdPost";
import { Like } from "../../dto/Like";
import { Post } from "../../dto/Post";
import { User } from "../../dto/User";
import { UserInfo } from "../../dto/UserInfo";
import { LikeService } from "../../services/LikeService";
import { PostService } from "../../services/PostService";
import { UserService } from "../../services/UserService";
import recette from "../News/assets/recette.png";
import restaurant from "../News/assets/restaurant.png";
import sante from "../News/assets/sante.png";
import texte from "../News/assets/texte.png";
import "./Profile.css";

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
  const [, setMainPostIds] = useState<number[]>([]);
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [postHistory, setPostHistory] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLikes, setUserLikes] = useState<Record<number, boolean>>({});
  const username = localStorage.getItem("username") || "";
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const [commentText, setCommentText] = useState<string>();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Post[]>([]);

  const [nb_abonnement, setNbAbonnement] = useState<number>();
  const [nb_abonne, setNbAbonne] = useState<number>();
  const [abonnement, setAbonnement] = useState<string[]>();
  const [abonne, setAbonne] = useState<string[]>();
  const [description, setDescription] = useState<string | undefined>();

  const [isSub, setSub] = useState(false);

  const [abonneIsOpen, setAbonneIsOpen] = useState(false);
  const [abonnementIsOpen, setAbonnementIsOpen] = useState(false);

  const [blobPhotoProfil, setBlobPhotoProfil] = useState<Blob>();
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [commentTitle, setCommentTitle] = useState<string>();
  const [commentType, setCommentType] = useState<string>();
  const [, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gestion de la photo de profil
  useEffect(() => {
    if (usernameLink) {
      userService
        .getUser(usernameLink)
        .then((response) => {
          const profileUser = response.data.user;
          setUser(profileUser);
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
          if (
            response.data.main_post_ids &&
            response.data.main_post_ids.length > 0 &&
            profileUser
          ) {
            const postService = new PostService(config.API_URL);
            const likeService = new LikeService(config.API_URL);
            const postIds: IdPost = { ids_posts: response.data.main_post_ids }; // Utilisez la clé correcte ici

            postService
              .postPostsByIds(postIds)
              .then((response) => response.data)
              .then((data) => {
                setPosts(data);

                data.forEach((post) => {
                  if (post.picbin) {
                    let postPicture = "data:image/png;base64," + post.picbin;
                    let byteCharacters = atob(postPicture.split(",")[1]);
                    let byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    let byteArray = new Uint8Array(byteNumbers);
                    let blob = new Blob([byteArray], { type: "image/png" });
                    post.blob = blob;
                  }
                });
                const commentsPromises = data.map((post) =>
                  postService.getPostComments(post.id_post)
                );
                Promise.all(commentsPromises)
                  .then((commentsData) => {
                    const allComments = commentsData.map(
                      (comment) => comment.data
                    );
                    setComments(allComments.flat());
                  })
                  .catch((error) => console.error(error));

                const userPromises = data.map((post) =>
                  postService.getUserFromPost(post.id_post)
                );
                Promise.all(userPromises)
                  .then((userData) => {
                    // console.log('usersData:', userData);
                    const allUsers = userData.map((userC) => userC.data);
                    setUsers(allUsers);
                    // console.log('Users:', allUsers);
                  })
                  .catch((error) =>
                    console.error("Error fetching users:", error)
                  );

                const likesPromises = data.map((post) =>
                  likeService.getPostLikes(post.id_post)
                );
                Promise.all(likesPromises)
                  .then((likesData) => {
                    const likesCount = likesData.reduce((count, likesArray) => {
                      likesArray.data.forEach((like) => {
                        count[like.id_post] = likesArray.data.length;
                      });
                      return count;
                    }, {} as Record<number, number>);
                    setLikesCount(likesCount);
                  })
                  .catch((error) => console.error(error));

                Promise.all(likesPromises)
                  .then((likesData) => {
                    const userLikes = likesData.reduce((acc, likesArray) => {
                      if (likesArray.data.length > 0) {
                        const id_post = likesArray.data[0]?.id_post || -1;
                        acc[id_post] = likesArray.data.some(
                          (like) => like.id_user === context.user?.id_user
                        );
                      }
                      return acc;
                    }, {} as Record<number, boolean>);
                    setUserLikes(userLikes);
                  })
                  .catch((error) => console.error(error));
              })
              .catch((error) => console.error(error));
          } else {
            setPosts([]);
          }
          // if (
          //   response.data.main_post_ids &&
          //   response.data.main_post_ids.length > 0 &&
          //   user
          // ) {
          //   const postService = new PostService(config.API_URL);
          //   const likeService = new LikeService(config.API_URL);
          //   let listPosts: Post[] = [];

          //   response.data.main_post_ids.forEach((postId) =>
          //     postService.getPost(postId).then((reponses) => {
          //       let post = reponses.data;
          //       if (post.picbin) {
          //         let postPicture = "data:image/png;base64," + post.picbin;
          //         let byteCharacters = atob(postPicture.split(",")[1]);
          //         let byteNumbers = new Array(byteCharacters.length);
          //         for (let i = 0; i < byteCharacters.length; i++) {
          //           byteNumbers[i] = byteCharacters.charCodeAt(i);
          //         }
          //         let byteArray = new Uint8Array(byteNumbers);
          //         let blob = new Blob([byteArray], { type: "image/png" });
          //         post.blob = blob;
          //       }
          //       listPosts.push(post);
          //     })
          //   );
          //   setPosts(listPosts);
          //   const commentsPromises = listPosts.map((post) =>
          //     postService.getPostComments(post.id_post)
          //   );
          //   Promise.all(commentsPromises)
          //     .then((commentsData) => {
          //       const allComments = commentsData.map((comment) => comment.data);
          //       setComments(allComments.flat());
          //     })
          //     .catch((error) => console.error(error));

          //   const likesPromises = listPosts.map((post) =>
          //     likeService.getPostLikes(post.id_post)
          //   );
          //   Promise.all(likesPromises)
          //     .then((likesData) => {
          //       const likesCount = likesData.reduce((count, likesArray) => {
          //         likesArray.data.forEach((like) => {
          //           count[like.id_post] = likesArray.data.length;
          //         });
          //         return count;
          //       }, {} as Record<number, number>);
          //       setLikesCount(likesCount);
          //     })
          //     .catch((error) => console.error(error));

          //   Promise.all(likesPromises)
          //     .then((likesData) => {
          //       const userLikes = likesData.reduce((acc, likesArray) => {
          //         if (likesArray.data.length > 0) {
          //           const id_post = likesArray.data[0]?.id_post || -1;
          //           acc[id_post] = likesArray.data.some(
          //             (like) => like.id_user === user.id_user
          //           );
          //         }
          //         return acc;
          //       }, {} as Record<number, boolean>);
          //       setUserLikes(userLikes);
          //     })
          //     .catch((error) => console.error(error));
          // }
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameLink, filter, sortOrder]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameLink]);

  useEffect(() => {
    if (usernameLink) {
      userService.findFollow(username, usernameLink).then((response) => {
        setSub(response.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abonnement]);

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

  const handleNoPhoto = (type: string) => {
    if (type === "recette") {
      return recette;
    } else if (type === "santé") {
      return sante;
    } else if (type === "restaurant") {
      return restaurant;
    } else {
      return texte;
    }
  };

  const handleBack = () => {
    setPostHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, -1); // Remove the last element
      const lastPostId = newHistory[newHistory.length - 1];
      const lastPost = posts.find((post) => post.id_post === lastPostId);
      setSelectedPost(lastPost || null);
      return newHistory;
    });
  };

  const handleSubmitComment = async () => {
    if (!commentText || !commentTitle || !commentType) {
      // mettre les messages d'erreur avec alertes à rajouter
    } else {
      if (user && user.id_user) {
        const postService = new PostService(config.API_URL);
        const newComment: Post = {
          id_user: user.id_user,
          type: commentType,
          afficher: true,
          text: commentText,
          id_post_comm: selectedPost?.id_post,
          titre_post: commentTitle,
        };
        postService.addPost(newComment);
        navigate("/profile/" + context.user?.username);
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  const toggleLike = async (id_post: number) => {
    const likeService = new LikeService(config.API_URL);
    if (user) {
      const likesForPost = await likeService.getPostLikes(id_post);
      const existingLike = likesForPost.data.find(
        (like) => like.id_user === context.user?.id_user
      );

      if (existingLike) {
        await likeService.deleteLike(id_post, context.user?.id_user);
        setUserLikes((prevState) => ({ ...prevState, [id_post]: false }));
        // setLikesCount(prevState => ({...prevState, [id_post]: prevState[id_post]-1}));
      } else {
        const newLike: Like = {
          id_post: id_post,
          id_user: context.user?.id_user,
        };
        await likeService.addLike(newLike);
        setUserLikes((prevState) => ({ ...prevState, [id_post]: true }));
        // setLikesCount(prevState => ({...prevState, [id_post]: prevState[id_post] + 1}));
      }
      // const updatedLikesCount = { ...likesCount, [id_post]: likesCount[id_post] + (existingLike ? -1 : 1) };
      // setLikesCount(updatedLikesCount);
      // const updatedLikesForPost = await likeService.getPostLikes(id_post);
      // setLikesCount(prevState => ({...prevState, [id_post]: updatedLikesForPost.data.length}));
      const updatedLikesForPost = await likeService.getPostLikes(id_post);
      setLikesCount((prevState) => ({
        ...prevState,
        [id_post]: updatedLikesForPost.data.length,
      }));
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

  const openPost = (post: Post) => {
    setPostHistory((prevHistory) => [...prevHistory, post.id_post]);
    setSelectedPost(post);
    setIsModalOpen(true);
    window.scrollTo(0,0);

  };

  const sortOldestToNewest = () => {
    setFilter(null);
    setSortOrder("asc");
    handlePageChange(1);
  };

  const sortNewestToOldest = () => {
    setFilter(null);
    setSortOrder("desc");
    handlePageChange(1);
  };

  const filterPosts = () => {
    setFilter("texte");
    setSortOrder("");
    handlePageChange(1);
  };

  const filterRecipes = () => {
    setFilter("recette");
    setSortOrder("");
    handlePageChange(1);
  };

  const filterRestaurant = () => {
    setFilter("restaurant");
    setSortOrder("");
    handlePageChange(1);
  };

  const filterSante = () => {
    setFilter("santé");
    setSortOrder("");
    handlePageChange(1);
  };

  const navigateToUserProfile = (
    username: string,
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    event.stopPropagation();
    navigate(`/profile/${username}`);
  };

  return (
    <div>
      <div className="navbar-div-color">
        <Navbar />
      </div>

      <div className="profile-container">
        <div className="profile-plus-collection">
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
                {username === usernameLink && (
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
                {username !== usernameLink && (
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
            {username === usernameLink && (
              <div className="add-collection">
                <p>&#43;</p>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="load-profile">
            <div>
              Loading
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="button-container">
              <div className="button-wrapper">
                <div className="button-underline"></div>
                <button
                  className={`button-filtres ${
                    isModalOpen
                      ? "hidden"
                      : "" || abonneIsOpen
                      ? "hidden"
                      : "" || abonnementIsOpen
                      ? "hidden"
                      : ""
                  }`}
                  onClick={sortNewestToOldest}
                >
                  Le plus récent
                </button>
              </div>
              <div className="button-wrapper">
                <div className="button-underline"></div>
                <button
                  className={`button-filtres ${
                    isModalOpen
                      ? "hidden"
                      : "" || abonneIsOpen
                      ? "hidden"
                      : "" || abonnementIsOpen
                      ? "hidden"
                      : ""
                  }`}
                  onClick={sortOldestToNewest}
                >
                  Le plus ancien
                </button>{" "}
              </div>

              <div className="button-wrapper">
                <div className="button-underline"></div>
                <button
                  className={`button-filtres ${
                    isModalOpen
                      ? "hidden"
                      : "" || abonneIsOpen
                      ? "hidden"
                      : "" || abonnementIsOpen
                      ? "hidden"
                      : ""
                  }`}
                  onClick={filterPosts}
                >
                  Texte
                </button>
              </div>
              <div className="button-wrapper">
                <div className="button-underline"></div>
                <button
                  className={`button-filtres ${
                    isModalOpen
                      ? "hidden"
                      : "" || abonneIsOpen
                      ? "hidden"
                      : "" || abonnementIsOpen
                      ? "hidden"
                      : ""
                  }`}
                  onClick={filterRecipes}
                >
                  Recette
                </button>
              </div>
              <div className="button-wrapper">
                <div className="button-underline"></div>
                <button
                  className={`button-filtres ${
                    isModalOpen
                      ? "hidden"
                      : "" || abonneIsOpen
                      ? "hidden"
                      : "" || abonnementIsOpen
                      ? "hidden"
                      : ""
                  }`}
                  onClick={filterRestaurant}
                >
                  Restaurant
                </button>
              </div>
              <div className="button-wrapper">
                <div className="button-underline"></div>
                <button
                  className={`button-filtres ${
                    isModalOpen
                      ? "hidden"
                      : "" || abonneIsOpen
                      ? "hidden"
                      : "" || abonnementIsOpen
                      ? "hidden"
                      : ""
                  }`}
                  onClick={filterSante}
                >
                  Santé
                </button>
              </div>
            </div>
            <ResponsiveGridLayout
              className="layout"
              cols={{ lg: 3, md: 3, sm: 3, xs: 1, xxs: 1 }}
              rowHeight={500}
            >
              {posts
                .filter(
                  (post) =>
                    (!filter &&
                      ["texte", "recette", "restaurant", "santé"].includes(
                        post.type
                      )) ||
                    post.type === filter
                )
                .map((post: Post, index: number) => (
                  <div
                    key={post.id_post}
                    data-grid={{
                      x: index % 3,
                      y: Math.floor(index / 3),
                      w: 0.9,
                      h: 1,
                      static: true,
                    }}
                    className="post-profile" // Reprendre le css de post news mais adapter la taille
                    onClick={() => openPost(post)}
                  >
                    <div className="post-border">
                      <h2 className="post-title">{post.titre_post}</h2>
                      <div className="post-info">
                        <p className="post-type">{post.type}</p>
                        <p
                          className="post-user"
                          onClick={(event) =>
                            navigateToUserProfile(
                              users.find(
                                (userC) => userC.id_user === post.id_user
                              )?.username || "",
                              event
                            )
                          }
                        >
                          @
                          {
                            users.find(
                              (userC) => userC.id_user === post.id_user
                            )?.username
                          }
                        </p>
                      </div>
                      <div className="img-wrapper">
                        <img
                          onClick={() => {
                            setSelectedPost(post);
                            setIsModalOpen(true);
                          }}
                          className="img-test"
                          src={
                            post.blob
                              ? URL.createObjectURL(post.blob)
                              : handleNoPhoto(post.type)
                          }
                          alt="Logo"
                        />
                        <div
                          className="likes-count"
                          onClick={() => toggleLike(post.id_post)}
                        >
                          {/* <p className='heart-icon' onClick={()=> toggleLike(post.id_post)}>❤️</p> */}
                          <FontAwesomeIcon
                            icon={faHeart}
                            color={userLikes[post.id_post] ? "red" : "black"}
                          />
                          {likesCount[post.id_post] || 0}
                        </div>
                      </div>
                      <p className="post-text">{post.text}</p>
                      <p className="post-date">{post.date?.toString()} </p>
                    </div>
                  </div>
                ))}
            </ResponsiveGridLayout>
          </div>
        )}
        
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
                        alt="PhotoAbonnés"
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
                        alt="PhotoAbonnements"
                      />
                      {username}
                    </NavLink>
                  </li>
                ))}
          </ul>
        </div>
      </Modal>
      <CustomModal
        show={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
          setIsCommentFormOpen(false);
          setPostHistory([]);
        }}
        canGoBack={postHistory.length > 1}
        handleBack={handleBack}
      >
        {selectedPost && (
          <div className="post-avec-com">
            <div className="post-com">
              <div className="post-com-margin">
                <h2 className="post-title">{selectedPost.titre_post}</h2>
                <div className="post-info">
                  <p className="post-type">{selectedPost.type}</p>
                  <p
                    className="post-user"
                    onClick={(event) =>
                      navigateToUserProfile(
                        users.find(
                          (userC) => userC.id_user === selectedPost.id_user
                        )?.username || "",
                        event
                      )
                    }
                  >
                    @
                    {
                      users.find(
                        (userC) => userC.id_user === selectedPost.id_user
                      )?.username
                    }
                  </p>
                </div>

                {/* <img className='img-test' src={logo} alt="Logo" /> */}
                <div className="img-wrapper">
                  <img
                    className="img-test"
                    src={
                      selectedPost.blob
                        ? URL.createObjectURL(selectedPost.blob)
                        : handleNoPhoto(selectedPost.type)
                    }
                    alt="Logo"
                    loading="lazy"
                  />
                  <div
                    className="likes-count"
                    onClick={() => toggleLike(selectedPost.id_post)}
                  >
                    {/* <p
                      className="heart-icon"
                      onClick={() => toggleLike(post.id_post)}
                    >
                      ❤️
                    </p> */}
                    <FontAwesomeIcon
                      icon={faHeart}
                      color={userLikes[selectedPost.id_post] ? "red" : "black"}
                    />
                    {likesCount[selectedPost.id_post] || 0}
                  </div>
                </div>

                {/*changer le post-text car là on peut afficher toutes les lignes */}
                <p className="post-text">{selectedPost.text}</p>
                <p className="post-date">{selectedPost.date?.toString()} </p>
              </div>
            </div>
            <div className="comments-container">
              {comments
                .filter(
                  (comment) => comment.id_post_comm === selectedPost.id_post
                )
                .map((comment) => (
                  <div
                    className="post-com-com"
                    onClick={() => openPost(comment)}
                  >
                    <div key={comment.id_post}>
                      {/* mettre un titre ici ? */}
                      <div className="post-info-com">
                        <p className="post-com-date">
                          {comment.date?.toString()}{" "}
                        </p>
                      </div>
                      <p className="post-text-com">{comment.text}</p>
                    </div>
                  </div>
                ))}
              <div>
                <button
                  className="ajout-com"
                  onClick={() => setIsCommentFormOpen(true)}
                >
                  {" "}
                  Ajouter un commentaire...{" "}
                </button>
                {isCommentFormOpen && (
                  <div>
                    {/* <div>
                    <TextField required className='txtfield-com-title' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Titre" variant="outlined" onChange={e => setCommentTitle(e.target.value)}/>
                    <TextField required className='txtfield-com-type' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Type" variant='outlined' onChange={e => setCommentType(e.target.value)}/>
                    <TextField required className='txtfield-com-text' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Texte" variant='outlined' onChange={e => setCommentText(e.target.value)}/>                 
                    </div> */}
                    <form
                      className="addPlaceForm"
                      onSubmit={handleSubmitComment}
                    >
                      <div>
                        <label>
                          <div
                            className={`form ${
                              commentType === "" ? "defaultValueStyle" : ""
                            }`}
                          >
                            Type:
                            <select
                              className="customSelect"
                              name="type"
                              value={commentType}
                              onChange={(e) => setCommentType(e.target.value)}
                            >
                              <option value="None">Choisir une valeur</option>
                              <option value="texte">Post</option>
                              <option value="recette">Recette</option>
                              <option value="restaurant">Restaurant</option>
                              <option value="santé">Santé</option>
                            </select>
                          </div>
                        </label>
                        <label>
                          <div
                            className={`form ${
                              commentTitle === "" ? "defaultValueStyle" : ""
                            }`}
                          >
                            Titre:
                            <input
                              className="inputField"
                              type="text"
                              name="title"
                              value={commentTitle}
                              onChange={(e) => setCommentTitle(e.target.value)}
                              placeholder="Titre"
                            />
                          </div>
                        </label>
                        <label>
                          <div
                            className={`form ${
                              commentText === "" ? "defaultValueStyle" : ""
                            }`}
                          >
                            Description:
                            <input
                              className="inputField"
                              type="text"
                              name="description"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Texte"
                            />
                          </div>
                        </label>
                      </div>
                      <div className="buttons-comment-container">
                        <button type="submit" className="submit">
                          Ajouter
                        </button>
                        <button
                          className="button-ajout-com-close"
                          onClick={() => setIsCommentFormOpen(false)}
                        >
                          Fermer
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CustomModal>
      <Footer />
    </div>
  );
}

export default Profile;
