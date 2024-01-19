import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { MyBlogContext } from '../../MyBlogContext';
import "./News.css"
import { config } from "../../config";
import { PostService } from '../../services/PostService';
import { Post } from '../../dto/Post';
import { Responsive, WidthProvider } from 'react-grid-layout';
import logo from './assets/logo_sineat.png';
import Modal from '../../components/Modal/Modal';
import { User } from '../../dto/User';
import { TextField } from '@mui/material';
import nuage from './assets/nuage_rose.png';
import { LikeService } from '../../services/LikeService';
import { Like } from '../../dto/Like';
import { CreatePostButton } from '../../components/CreatePostButton/CreatePostButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';
import { UserInfo } from '../../dto/UserInfo';


export function News() {

    const [posts, setPosts] = useState<Post[]>([]);
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Post[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [likesCount, setLikesCount] = useState<Record<number, number>>({});
    const {user} = useContext(MyBlogContext)
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
    // const [newComment, setNewComment] = useState<Partial<Post>>({});
    const [commentTitle, setCommentTitle] = useState<string>();
    const [commentType, setCommentType] = useState<string>();
    const [commentText, setCommentText] = useState<string>();
    const navigate = useNavigate();
    const [userLikes, setUserLikes] = useState<Record<number, boolean>>({});
    const [postHistory, setPostHistory] = useState<number[]>([]);

    const sortOldestToNewest = () => {
      const sortedPosts = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setPosts(sortedPosts);
    };
  
    const sortNewestToOldest = () => {
      const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(sortedPosts);
    };
  
    const filterPosts = () => {
      setFilter("texte");
    };
  
    const filterRecipes = () => {
      setFilter("recette");
    };
  
    const filterRestaurant = () => {
      setFilter("restaurant");
    };

    const filterSante = () => {
      setFilter("santé")
    }

    const toggleLike = async (id_post: number) => {
      const likeService = new LikeService(config.API_URL)
      if (user) {
        const likesForPost = await likeService.getPostLikes(id_post);
        const existingLike = likesForPost.data.find(like => like.id_user === user.id_user);
        
        if (existingLike) {
          await likeService.deleteLike(id_post, user.id_user);
          setUserLikes(prevState => ({...prevState, [id_post]:false}));
          // setLikesCount(prevState => ({...prevState, [id_post]: prevState[id_post]-1}));
        } else {
          const newLike: Like = { id_post: id_post, id_user: user.id_user};
          await likeService.addLike(newLike);
          setUserLikes(prevState => ({...prevState, [id_post]: true}))
          // setLikesCount(prevState => ({...prevState, [id_post]: prevState[id_post] + 1}));
        }
        // const updatedLikesCount = { ...likesCount, [id_post]: likesCount[id_post] + (existingLike ? -1 : 1) };
        // setLikesCount(updatedLikesCount);
        // const updatedLikesForPost = await likeService.getPostLikes(id_post);
        // setLikesCount(prevState => ({...prevState, [id_post]: updatedLikesForPost.data.length}));
        const updatedLikesForPost = await likeService.getPostLikes(id_post);
        setLikesCount(prevState => ({...prevState, [id_post]: updatedLikesForPost.data.length}));

      }
      

    };
  
    const handleSubmitComment = async () => {
      if (!commentText || !commentTitle || !commentType) {
        // mettre les messages d'erreur avec alertes à rajouter
      } else {
        if (user) {
          const postService = new PostService(config.API_URL);
          const newComment : Post = {
            id_user: user.id_user,
            date: new Date(),
            type: commentType,
            afficher: true,
            text: commentText,
            id_post_comm: selectedPost?.id_post,
            titre_post: commentTitle,
          }
          postService.addPost(newComment)
          navigate('/profile/'+user.username)
        }
      }
    }

    const openPost = (post:Post) => {
      setPostHistory(prevHistory => [...prevHistory, post.id_post]);
      setSelectedPost(post);
      setIsModalOpen(true);
    }

    const handleBack = () => {
      setPostHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, -1); // Remove the last element
        const lastPostId = newHistory[newHistory.length - 1];
        const lastPost = posts.find(post => post.id_post === lastPostId);
        setSelectedPost(lastPost || null);
        return newHistory;
      });
    };
   
    useEffect(() => {
      if (user) {
        const postService = new PostService(config.API_URL)
        const likeService = new LikeService(config.API_URL)

        postService.getPosts()
        .then(response => response.data)
        .then(data => {
          setPosts(data);

          const commentsPromises = data.map(post => postService.getPostComments(post.id_post));
          Promise.all(commentsPromises)
          .then(commentsData => {
            const allComments = commentsData.map(comment => comment.data);
            setComments(allComments.flat());
          })
          .catch(error => console.error(error));

          const userPromises = data.map(post => postService.getUserFromPost(post.id_post));
          Promise.all(userPromises)
          .then(userData => {
            // console.log('usersData:', userData);
            const allUsers = userData.map(userC => userC.data);
            setUsers(allUsers);
            // console.log('Users:', allUsers);
          })
          .catch(error => console.error('Error fetching users:',error));

          const likesPromises = data.map(post => likeService.getPostLikes(post.id_post));
          Promise.all(likesPromises)
          .then(likesData => {
            const likesCount = likesData.reduce((count, likesArray) => {
              likesArray.data.forEach(like => {
                count[like.id_post] = likesArray.data.length;
              });
              return count;
            }, {} as Record<number, number>);
            setLikesCount(likesCount);
          })
          .catch(error => console.error(error));

          Promise.all(likesPromises)
          .then(likesData => {
            const userLikes = likesData.reduce((acc, likesArray) => {
              if (likesArray.data.length > 0) {
                const id_post = likesArray.data[0]?.id_post || -1;
                acc[id_post] = likesArray.data.some(like => like.id_user === user.id_user);
              }
              return acc;
            }, {} as Record<number, boolean>);
            setUserLikes(userLikes);
          })
          .catch(error => console.error(error));

        })
        .catch(error => console.error(error));
      }
    }, [user]);

    
    return (
    <div className='back-color'>
      <Navbar />
      <CreatePostButton/>
      <div className='fil-dactu'>
        <ul className='bandeau'>
          <li><img className='nuage_1' src={nuage} alt="Logo" /></li>
          <li><img className='nuage_2' src={nuage} alt="Logo" /></li>
          <li><img className='nuage_1' src={nuage} alt="Logo" /></li>

          <li><text className='fil_dal'>Fil d'actualité</text></li>
          
          <li><img className='nuage_1' src={nuage} alt="Logo" /></li>
          <li><img className='nuage_2' src={nuage} alt="Logo" /></li>
          <li><img className='nuage_1' src={nuage} alt="Logo" /></li>
        </ul>
      </div>
      <div className='button-container'>
        {/* <text className='filtres'>Filtres</text> */}
        <div className="button-wrapper">
          <div className='button-underline'></div>
          <button className={`button-filtres ${isModalOpen ? 'hidden' : ''}`} onClick={sortOldestToNewest}>Le plus ancien</button>        </div>
        <div className="button-wrapper">
          <div className='button-underline'></div>
          <button className={`button-filtres ${isModalOpen ? 'hidden' : ''}`} onClick={sortNewestToOldest}>Le plus récent</button>
          {/* <button className= 'button-filtres' onClick={sortNewestToOldest}>Le plus récent</button> */}
        </div>
        <div className="button-wrapper">
          <div className='button-underline'></div>
          <button className={`button-filtres ${isModalOpen ? 'hidden' : ''}`} onClick={filterPosts}>Post</button>
          {/* <button className= 'button-filtres' onClick={filterPosts}>Posts</button> */}
        </div>
        <div className="button-wrapper">
          <div className='button-underline'></div>
          <button className={`button-filtres ${isModalOpen ? 'hidden' : ''}`} onClick={filterRecipes}>Recette</button>
          {/* <button className= 'button-filtres' onClick={filterRecipes}>Recettes</button> */}
        </div>
        <div className="button-wrapper">
          <div className='button-underline'></div>
          <button className={`button-filtres ${isModalOpen ? 'hidden' : ''}`} onClick={filterRestaurant}>Restaurant</button>
          {/* <button className= 'button-filtres' onClick={filterRestaurant}>Restaurants</button> */}
        </div>
        <div className="button-wrapper">
          <div className='button-underline'></div>
          <button className={`button-filtres ${isModalOpen ? 'hidden' : ''}`} onClick={filterSante}>Santé</button>
          {/* <button className= 'button-filtres' onClick={filterRestaurant}>Restaurants</button> */}
        </div>
      </div>
      <ResponsiveGridLayout className="layout" cols={{lg: 3, md: 3, sm: 3, xs: 1, xxs: 1}} rowHeight={310}>
        {posts.filter(post => (!filter && ["post", "recette", "commentaire_resto"].includes(post.type)) || post.type === filter).map((post: Post, index: number) => (
          <div key={post.id_post} data-grid={{x: index % 3, y: Math.floor(index / 3), w: 0.9, h: 1, static : true}} className='post-news' onClick={() => openPost(post)}>
            <div className='post-border' >
                <h2 className='post-title'>{post.titre_post}</h2>
                <div className='post-info'>
                  <p className='post-type'>{post.type}</p>
                  <p className='post-user'>@{users.find(userC => userC.id_user === post.id_user)?.username}</p>
                </div>
                <div className='img-wrapper'>
                  <img onClick={()=> {setSelectedPost(post); setIsModalOpen(true);}} className='img-test' src={logo} alt="Logo" loading='lazy'/>
                  <div className="likes-count"onClick={()=> toggleLike(post.id_post)} >
                    {/* <p className='heart-icon' onClick={()=> toggleLike(post.id_post)}>❤️</p> */}
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      color={userLikes[post.id_post] ? 'red' : 'black'} 
                      
                    />
                          {likesCount[post.id_post] || 0}
                  </div>
                </div>
                <p className='post-text'>{post.text}</p>
                <p className='post-date'>{post.date.toString()} </p>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      <Modal 
      show={isModalOpen} 
      handleClose={()=> {
        setIsModalOpen(false);
        setSelectedPost(null);
        setIsCommentFormOpen(false);
        setPostHistory([]);
      }}
      canGoBack= {postHistory.length >1}
      handleBack={handleBack}
      >
        {selectedPost && (
          <div className='post-avec-com'>
            <div className='post-com'>
              <div className='post-com-margin'>
                <h2 className='post-title'>{selectedPost.titre_post}</h2>
                <div className='post-info'>
                  <p className='post-type'>{selectedPost.type}</p>
                  <p className='post-user'>@{users.find(userC => userC.id_user === selectedPost.id_user)?.username}</p>
                </div>

                {/* <img className='img-test' src={logo} alt="Logo" /> */}
                <div className='img-wrapper'>
                  <img className='img-test' src={logo} alt="Logo" loading="lazy"/>
                  <div className="likes-count"onClick={()=> toggleLike(selectedPost.id_post)} >
                    {/* <p className='heart-icon' onClick={()=> toggleLike(post.id_post)}>❤️</p> */}
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      color={userLikes[selectedPost.id_post] ? 'red' : 'black'} 
                      
                    />
                          {likesCount[selectedPost.id_post] || 0}
                  </div>
                </div>

                {/*changer le post-text car là on peut afficher toutes les lignes */}
                <p className='post-text'>{selectedPost.text}</p>
                <p className='post-date'>{selectedPost.date.toString()} </p>
              </div>
            </div>
            <div className='comments-container'>
              {comments.filter(comment => comment.id_post_comm === selectedPost.id_post).map(comment => (
                <div className='post-com-com' onClick={() => openPost(comment)}>
                  <div key={comment.id_post} >
                    {/* mettre un titre ici ? */}
                    <div className='post-info-com'>
                      <p className='post-user'>@{users.find(userC => userC.id_user === comment.id_user)?.username}</p>
                      <p className='post-com-date'>{comment.date.toString()} </p>
                    </div>
                    <p className='post-text-com'>{comment.text}</p>
                  </div>
                </div>
              ))}
              <div>
                <button className='ajout-com' onClick={()=> setIsCommentFormOpen(true)}> Ajouter un commentaire... </button>
                {isCommentFormOpen && (
                  <div>
                    {/* <div>
                    <TextField required className='txtfield-com-title' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Titre" variant="outlined" onChange={e => setCommentTitle(e.target.value)}/>
                    <TextField required className='txtfield-com-type' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Type" variant='outlined' onChange={e => setCommentType(e.target.value)}/>
                    <TextField required className='txtfield-com-text' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Texte" variant='outlined' onChange={e => setCommentText(e.target.value)}/>                 
                    </div> */}
                    <form className='addPlaceForm' onSubmit={handleSubmitComment}>
                      <div>
                      <label>
                        <div className={`form ${commentType === '' ? 'defaultValueStyle' : ''}`}>
                          Type:
                          <select
                          className="customSelect" 
                          name="type"
                          value={commentType}
                          onChange={e => setCommentType(e.target.value)} >
                          <option value="None">Choisir une valeur</option>
                          <option value="texte">Post</option>
                          <option value="recette">Recette</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="santé">Santé</option>
                          </select>
                        </div>
                      </label>
                      <label>
                        <div className={`form ${commentTitle === '' ? 'defaultValueStyle' : ''}`}>
                          Titre:
                          <input
                          className="inputField"
                          type="text"
                          name="title"
                          value={commentTitle}
                          onChange={e => setCommentTitle(e.target.value)}
                          placeholder="Titre"
                          />
                        </div>
                      </label>
                      <label>
                        <div className={`form ${commentText === '' ? 'defaultValueStyle' : ''}`}>
                          Description:
                          <input
                          className="inputField"
                          type="text"
                          name="description"
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          placeholder="Texte"
                          />
                        </div>
                      </label>
                      </div>
                      <div className='buttons-comment-container'>
                        <button type="submit" className="submit">Ajouter</button>
                        <button className="button-ajout-com-close" onClick={() => setIsCommentFormOpen(false)}>Fermer</button>
                      </div>

                    </form>
                  </div>

                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Footer />
    </div>
  );
};

export default News;
