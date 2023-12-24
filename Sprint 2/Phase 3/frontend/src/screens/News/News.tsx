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
import { Button } from '@mui/material';
import nuage from './assets/nuage_rose.png';


export function News() {

    const [posts, setPosts] = useState<Post[]>([]);
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string | null>(null);

    const sortOldestToNewest = () => {
      const sortedPosts = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setPosts(sortedPosts);
    };
  
    const sortNewestToOldest = () => {
      const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(sortedPosts);
    };
  
    const filterPosts = () => {
      setFilter("post");
    };
  
    const filterRecipes = () => {
      setFilter("recette");
    };
  
    const filterRestaurant = () => {
      setFilter("commentaire_resto");
    };
  

   
    useEffect(() => {
        const postService = new PostService(config.API_URL)
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
        })
        .catch(error => console.error(error));
    }, []);


    return (
    <div className='back-color'>
      <Navbar />
      <div className='fil-dactu'>
        <ul className='bandeau'>
          <li><img className='nuage' src={nuage} alt="Logo" /></li>
          <li><text className='filtres'>Fil d'actualité</text></li>
          <li><img className='nuage' src={nuage} alt="Logo" /></li>
        </ul>
      </div>
      <div>
        <text className='filtres'>Filtres</text>
        <button className= 'button-filtres' onClick={sortOldestToNewest}>Le plus ancien</button>
        <button className= 'button-filtres' onClick={sortNewestToOldest}>Le plus récent</button>
        <button className= 'button-filtres' onClick={filterPosts}>Posts</button>
        <button className= 'button-filtres' onClick={filterRecipes}>Recettes</button>
        <button className= 'button-filtres' onClick={filterRestaurant}>Restaurants</button>
      </div>
      <ResponsiveGridLayout className="layout" cols={{lg: 3, md: 3, sm: 3, xs: 1, xxs: 1}} rowHeight={230}>
        {posts.filter(post => (!filter && ["post", "recette", "commentaire_resto"].includes(post.type)) || post.type === filter).map((post: Post, index: number) => (
          <div key={post.id_post} data-grid={{x: index % 3, y: Math.floor(index / 3), w: 0.7, h: 1, static : true}} onClick={()=> {setSelectedPost(post); setIsModalOpen(true);}} className='post'>
            <div className='post-border' >
                <h2 className='post-title'>Titre du Post</h2>
                <p>{post.type}</p>
                <p className='post-text'>{post.text}</p>
                <p>{post.date.toString()} {users.find(user => user.id_user === post.id_user)?.username}</p>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      <Modal show={isModalOpen} handleClose={()=> {
        setIsModalOpen(false);
        setSelectedPost(null);
      }}>
        {selectedPost && (
          <div className='post-avec-com'>
            <div className='post-com'>
              <div className='post-com-margin'>
                <h2>Titre du Post</h2>
                <p>{selectedPost.type}</p>
                <p>{selectedPost.text}</p>
                <p>{selectedPost.date.toString()} {users.find(user => user.id_user === selectedPost.id_user)?.username}</p>
              </div>
            </div>
           {comments.filter(comment => comment.id_post_comm === selectedPost.id_post).map(comment => (
            <div className='post-com-com'>
              <div key={comment.id_post}>
                <p className='post-com-margin'>{comment.text}</p>
                <p className='post-com-margin'>{comment.date.toString()} {users.find(user => user.id_user === comment.id_user)?.username}</p>
              </div>
            </div>
            ))}

          </div>
        )}
      </Modal>
      <Footer />
    </div>
  );
};

export default News;
