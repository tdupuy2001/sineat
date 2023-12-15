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


export function News() {

    const [posts, setPosts] = useState<Post[]>([]);
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);

   
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
    <div>
      <Navbar />
      {/*il faudra rajouter de mettre du plus récent ou plus vieux et nom user et date*/}
      <ResponsiveGridLayout className="layout" cols={{lg: 3, md: 3, sm: 3, xs: 1, xxs: 1}} rowHeight={90}>
        {posts.filter(post => post.type === "post" || post.type === "recette" || post.type === "commentaire_resto").map((post: Post, index: number) => (
          <div key={post.id_post} data-grid={{x: index % 3, y: Math.floor(index / 3), w: 0.9, h: 2, static : true}} onClick={()=> {setSelectedPost(post); setIsModalOpen(true);}} className='post'>
            <div className='post-border' >
                <h2 className='post-title'>Titre du Post</h2>
                <p>{post.type}</p>
                <p className='post-text'>{post.text}</p>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      <Modal show={isModalOpen} handleClose={()=> {
        setIsModalOpen(false);
        setSelectedPost(null);
      }}>
        {selectedPost && (
          <div>
            <div className='post-com'>
              <div className='post-com-margin'>
                <h2>Titre du Post</h2>
                {/* Mettre le nom de l'user et la date */}
                <p>{selectedPost.type}</p>
                <p>{selectedPost.text}</p>
              </div>
            </div>
           {comments.filter(comment => comment.id_post_comm === selectedPost.id_post).map(comment => (
            <div className='post-com-com'>
              <div key={comment.id_post}>
                {/* Mettre le nom de l'user et la date */}
                <p className='post-com-margin'>{comment.text}</p>
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
