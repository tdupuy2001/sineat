import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import { error } from 'console';
import { User } from '../../dto/User';
import { Button, TextField } from '@mui/material';
import nuage from './assets/nuage_rose.png';
import { LikeService } from '../../services/LikeService';
import { Like } from '../../dto/Like';


export function News() {

    const [posts, setPosts] = useState<Post[]>([]);
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [likesCount, setLikesCount] = useState<Record<number, number>>({});
    const {user} = useContext(MyBlogContext)
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
    const [newComment, setNewComment] = useState<Partial<Post>>({});
    const [commentTitle, setCommentTitle] = useState<string>();
    const [commentType, setCommentType] = useState<string>();
    const [commentText, setCommentText] = useState<string>();
    const navigate = useNavigate();

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
          setLikesCount(prevState => ({...prevState, [id_post]: prevState[id_post]-1}));
        } else {
          const newLike: Like = { id_post: id_post, id_user: user.id_user};
          await likeService.addLike(newLike);
          setLikesCount(prevState => ({...prevState, [id_post]: prevState[id_post] + 1}));
        }
      }
    };
  
    const handleSubmitComment = async () => {
      if (!commentText || !commentTitle || !commentType) {
        // mettre les messages d'erreur
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
   
    useEffect(() => {
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
            const allUsers = userData.map(user => user.data);
            setUsers(allUsers);
          })
          .catch(error => console.error(error));

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
        })
        .catch(error => console.error(error));
    }, []);


    return (
    <div className='back-color'>
      <Navbar />
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
          <div key={post.id_post} data-grid={{x: index % 3, y: Math.floor(index / 3), w: 0.9, h: 1, static : true}} onClick={()=> {setSelectedPost(post); setIsModalOpen(true);}} className='post-news'>
            <div className='post-border' >
                <h2 className='post-title'>{post.titre_post}</h2>
                <div className='post-info'>
                  <p className='post-type'>{post.type}</p>
                  <p className='post-user'>@{users.find(userC => userC.id_user === post.id_user)?.username}</p>
                </div>
                <div className='img-wrapper'>
                  <img className='img-test' src={logo} alt="Logo" />
                  <p className='likes-count' onClick={()=> toggleLike(post.id_post)}>&lt;3 {likesCount[post.id_post] || 0}</p>
                </div>
                <p className='post-text'>{post.text}</p>
                <p className='post-date'>{post.date.toString()} </p>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      {/*rajouter une + pour ajouter publication */}
      <Modal show={isModalOpen} handleClose={()=> {
        setIsModalOpen(false);
        setSelectedPost(null);
      }}>
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
                  <img className='img-test' src={logo} alt="Logo" />
                  <p className='likes-count'>&lt;3 {likesCount[selectedPost.id_post] || 0}</p>
                </div>

                {/*changer le post-text car là on peut afficher toutes les lignes */}
                <p className='post-text'>{selectedPost.text}</p>
                <p className='post-date'>{selectedPost.date.toString()} </p>
              </div>
            </div>
            <div className='comments-container'>
              {comments.filter(comment => comment.id_post_comm === selectedPost.id_post).map(comment => (
                <div className='post-com-com' onClick={() => {setSelectedPost(comment); setIsModalOpen(true);}}>
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
                    <div>
                    <TextField required className='txtfield-com-title' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Titre" variant="outlined" onChange={e => setCommentTitle(e.target.value)}/>
                    <TextField required className='txtfield-com-type' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Type" variant='outlined' onChange={e => setCommentType(e.target.value)}/>
                    <TextField required className='txtfield-com-text' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Texte" variant='outlined' onChange={e => setCommentText(e.target.value)}/>                 
                    </div>
                    <div>
                      <button className="submit" onClick={handleSubmitComment}>Ajouter</button>
                      <button className="button-ajout-com-close" onClick={() => setIsCommentFormOpen(false)}>Fermer</button>
                    </div>
                  </div>
                  // <form onSubmit={handleSubmitComment}>
                  //   <input type="text" placeholder="Title" value={newComment.titre_post} onChange={e => setNewComment({...newComment, titre_post: e.target.value})} required />
                  //   <textarea placeholder="Text" value={newComment.text} onChange={e => setNewComment({...newComment, text: e.target.value})} required />
                  //   <select value={newComment.type} onChange={e => setNewComment({...newComment, type: e.target.value})} required>
                  //     <option value="">Select type</option>
                  //     <option value="post">Post</option>
                  //     <option value="recette">Recette</option>
                  //     <option value="restaurant">Restaurant</option>
                  //     <option value="santé">Santé</option>
                  //   </select>
                  //   <button type="submit">Ajouter</button>
                  //   <button type="button" onClick={() => setIsCommentFormOpen(false)}>Fermer</button>
                  // </form>
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
