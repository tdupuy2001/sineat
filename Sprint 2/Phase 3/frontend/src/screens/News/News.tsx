import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertColor } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import { MyBlogContext } from "../../MyBlogContext";
import { CreatePostButton } from "../../components/CreatePostButton/CreatePostButton";
import Footer from "../../components/Footer/Footer";
import Modal from "../../components/Modal/Modal";
import Navbar from "../../components/Navbar/Navbar";
import { config } from "../../config";
import { Like } from "../../dto/Like";
import { Post } from "../../dto/Post";
import { PostAdd } from "../../dto/PostAdd";
import { UserInfo } from "../../dto/UserInfo";
import { LikeService } from "../../services/LikeService";
import { PostService } from "../../services/PostService";
import "./News.css";
import nuage from "./assets/nuage_rose.png";
import recette from "./assets/recette.png";
import restaurant from "./assets/restaurant.png";
import sante from "./assets/sante.png";
import texte from "./assets/texte.png";

export function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const { user } = useContext(MyBlogContext);
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [commentTitle, setCommentTitle] = useState<string>();
  const [commentType, setCommentType] = useState<string>();
  const [commentText, setCommentText] = useState<string>();
  const navigate = useNavigate();
  const [userLikes, setUserLikes] = useState<Record<number, boolean>>({});
  const [postHistory, setPostHistory] = useState<number[]>([]);
  const [commentAlertMessage, setCommentAlertMessage] = useState("");
  const [commentAlertSeverity, setCommentAlertSeverity] =
    useState<AlertColor>("info");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

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

  const toggleLike = async (id_post: number) => {
    const likeService = new LikeService(config.API_URL);
    if (user && user.id_user) {
      const likesForPost = await likeService.getPostLikes(id_post);
      const existingLike = likesForPost.data.find(
        (like) => like.id_user === user.id_user
      );

      if (existingLike) {
        await likeService.deleteLike(id_post, user.id_user);
        setUserLikes((prevState) => ({ ...prevState, [id_post]: false }));
      } else {
        const newLike: Like = { id_post: id_post, id_user: user.id_user };
        await likeService.addLike(newLike);
        setUserLikes((prevState) => ({ ...prevState, [id_post]: true }));
      }
      const updatedLikesForPost = await likeService.getPostLikes(id_post);
      setLikesCount((prevState) => ({
        ...prevState,
        [id_post]: updatedLikesForPost.data.length,
      }));
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText || !commentTitle) {
      setCommentAlertMessage(
        "Veuillez remplir tous les champs pour ajouter un commentaire."
      );
      setCommentAlertSeverity("error");
    } else {
      if (user && user.id_user && selectedPost) {
        const postService = new PostService(config.API_URL);
        const newComment: PostAdd = {
          id_user: user.id_user,
          type: "texte",
          date: new Date(),
          afficher: true,
          text: commentText,
          id_post_comm: selectedPost?.id_post,
          titre_post: commentTitle,
        };
        try {
          await postService.addComment(selectedPost, newComment);
          setCommentTitle("");
          setCommentType("");
          setCommentText("");
          setIsCommentFormOpen(false);
          const updatedComments = await postService.getPostComments(
            selectedPost.id_post
          );
          setComments(updatedComments.data);
          setCommentAlertMessage("");
        } catch (error) {
          console.error("failed to submit comment:", error);
        }
      }
    }
  };

  const openPost = (post: Post) => {
    setPostHistory((prevHistory) => [...prevHistory, post.id_post]);
    setSelectedPost(post);
    setIsModalOpen(true);
    window.scrollTo(0, 0);
  };

  const openCommentForm = () => {
    setIsCommentFormOpen(false);
    setCommentAlertMessage("");
    setCommentTitle("");
    setCommentText("");
    setCommentType("");
  };

  const handleBack = () => {
    setPostHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, -1);
      const lastPostId = newHistory[newHistory.length - 1];
      const lastPost = posts.find((post) => post.id_post === lastPostId);
      setSelectedPost(lastPost || null);
      return newHistory;
    });
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

  const navigateToUserProfile = (
    username: string,
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    event.stopPropagation();
    navigate(`/profile/${username}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  useEffect(() => {
    if (user) {
      const postService = new PostService(config.API_URL);
      const likeService = new LikeService(config.API_URL);

      postService
        .getPostsPerPage(currentPage, itemsPerPage, sortOrder, filter)
        .then((response) => {
          const data = response.data.posts;
          const sortedPosts = data.sort(
            (a: Post, b: Post) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTotalItemsCount(response.data.total_posts);
          sortedPosts.forEach((post: Post) => {
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
          const commentsPromises = data.map((post: Post) =>
            postService.getPostComments(post.id_post)
          );
          Promise.all(commentsPromises)
            .then((commentsData) => {
              const allComments = commentsData.map((comment) => comment.data);
              setComments(allComments.flat());
            })
            .catch((error) => console.error(error));

          const userPromises = data.map((post: Post) =>
            postService.getUserFromPost(post.id_post)
          );
          Promise.all(userPromises)
            .then((userData) => {
              const allUsers = userData.map((userC) => userC.data);
              setUsers(allUsers);
            })
            .catch((error) => console.error("Error fetching users:", error));

          const likesPromises = data.map((post: Post) =>
            likeService.getPostLikes(post.id_post)
          );
          Promise.all(likesPromises)
            .then((likesData) => {
              const likesCount = likesData.reduce((count, likesArray) => {
                likesArray.data.forEach((like: Like) => {
                  count[like.id_post] = likesArray.data.length;
                });
                return count;
              }, {} as Record<number, number>);
              setLikesCount(likesCount);
            })
            .catch((error) => console.error(error));

          Promise.all(likesPromises).then((likesData) => {
            const userLikes = likesData.reduce((acc, likesArray) => {
              if (likesArray.data.length > 0) {
                const id_post = likesArray.data[0]?.id_post || -1;
                acc[id_post] = likesArray.data.some(
                  (like: Like) => like.id_user === user.id_user
                );
              }
              return acc;
            }, {} as Record<number, boolean>);
            setUserLikes(userLikes);
          });

          setPosts(sortedPosts);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [user, currentPage, itemsPerPage, sortOrder, filter]);

  return (
    <div className="back-color">
      <Navbar />
      {loading ? (
        <div className="load">
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
          <CreatePostButton />
          <div className="fil-dactu">
            <ul className="bandeau">
              <li>
                <img className="nuage_1" src={nuage} alt="Logo" />
              </li>
              <li>
                <img className="nuage_2" src={nuage} alt="Logo" />
              </li>
              <li>
                <img className="nuage_1" src={nuage} alt="Logo" />
              </li>

              <li>
                <text className="fil_dal">Fil d'actualité</text>
              </li>

              <li>
                <img className="nuage_1" src={nuage} alt="Logo" />
              </li>
              <li>
                <img className="nuage_2" src={nuage} alt="Logo" />
              </li>
              <li>
                <img className="nuage_1" src={nuage} alt="Logo" />
              </li>
            </ul>
          </div>
          <div className="button-container">
            <div className="button-wrapper">
              <div className="button-underline"></div>
              <button
                className={`button-filtres ${isModalOpen ? "hidden" : ""}`}
                onClick={sortNewestToOldest}
              >
                Le plus récent
              </button>
            </div>
            <div className="button-wrapper">
              <div className="button-underline"></div>
              <button
                className={`button-filtres ${isModalOpen ? "hidden" : ""}`}
                onClick={sortOldestToNewest}
              >
                Le plus ancien
              </button>{" "}
            </div>

            <div className="button-wrapper">
              <div className="button-underline"></div>
              <button
                className={`button-filtres ${isModalOpen ? "hidden" : ""}`}
                onClick={filterPosts}
              >
                Texte
              </button>
            </div>
            <div className="button-wrapper">
              <div className="button-underline"></div>
              <button
                className={`button-filtres ${isModalOpen ? "hidden" : ""}`}
                onClick={filterRecipes}
              >
                Recette
              </button>
            </div>
            <div className="button-wrapper">
              <div className="button-underline"></div>
              <button
                className={`button-filtres ${isModalOpen ? "hidden" : ""}`}
                onClick={filterRestaurant}
              >
                Restaurant
              </button>
            </div>
            <div className="button-wrapper">
              <div className="button-underline"></div>
              <button
                className={`button-filtres ${isModalOpen ? "hidden" : ""}`}
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
                  className="post-news"
                >
                  <div className="post-border">
                    <h2 className="post-title-news">{post.titre_post}</h2>
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
                          users.find((userC) => userC.id_user === post.id_user)
                            ?.username
                        }
                      </p>
                    </div>
                    <div className="img-wrapper">
                      <img
                        onClick={() => openPost(post)}
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
                        <FontAwesomeIcon
                          icon={faHeart}
                          color={userLikes[post.id_post] ? "red" : "black"}
                        />
                        {likesCount[post.id_post] || 0}
                      </div>
                    </div>
                    <p className="post-text">{post.text}</p>
                    <p className="post-date">{post.date.toString()} </p>
                  </div>
                </div>
              ))}
          </ResponsiveGridLayout>
          <Modal
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

                    <div className="img-wrapper">
                      <img
                        className="img-selected"
                        src={
                          selectedPost.blob
                            ? URL.createObjectURL(selectedPost.blob)
                            : handleNoPhoto(selectedPost.type)
                        }
                        alt="Logo"
                      />
                      <div
                        className="likes-count"
                        onClick={() => toggleLike(selectedPost.id_post)}
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          color={
                            userLikes[selectedPost.id_post] ? "red" : "black"
                          }
                        />
                        {likesCount[selectedPost.id_post] || 0}
                      </div>
                    </div>

                    <p className="post-text-selected">{selectedPost.text}</p>
                    <p className="post-date">{selectedPost.date.toString()} </p>
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
                          <div className="post-info-com">
                            <p
                              className="post-user"
                              onClick={(event) =>
                                navigateToUserProfile(
                                  users.find(
                                    (userC) => userC.id_user === comment.id_user
                                  )?.username || "",
                                  event
                                )
                              }
                            >
                              @
                              {
                                users.find(
                                  (userC) => userC.id_user === comment.id_user
                                )?.username
                              }
                            </p>
                            <p className="post-com-date">
                              {comment.date.toString()}{" "}
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
                        <form
                          className="addPlaceForm"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            await handleSubmitComment();
                          }}
                        >
                          <div>
                            {commentAlertMessage && (
                              <Alert severity={commentAlertSeverity}>
                                {commentAlertMessage}
                              </Alert>
                            )}

                            <label>
                              <div
                                className={`form ${
                                  commentTitle === "" ? "defaultValueStyle" : ""
                                }`}
                              >
                                Titre:
                                <input
                                  className="inputField-comment"
                                  type="text"
                                  name="title"
                                  value={commentTitle}
                                  onChange={(e) =>
                                    setCommentTitle(e.target.value)
                                  }
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
                                  className="inputField-comment"
                                  type="text"
                                  name="description"
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
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
                              onClick={() => openCommentForm()}
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
          </Modal>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            activeClass="active-page"
            disabledClass="disabled-page"
          />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default News;
