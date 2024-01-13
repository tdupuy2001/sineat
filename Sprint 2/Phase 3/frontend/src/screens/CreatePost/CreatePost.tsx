import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { TextField } from '@mui/material';
import './CreatePost.css'
import { useNavigate } from 'react-router-dom';
import { PostService } from '../../services/PostService';
import { config } from '../../config';
import { MyBlogContext } from '../../MyBlogContext';
import { Post } from '../../dto/Post';


export function CreatePost() {

    const navigate = useNavigate();
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const {user} = useContext(MyBlogContext)


    const handleAnnuler = () => {
        navigate("/news");
    };

    const handleNewPost = async () => {
        if (user) {
            const postService = new PostService(config.API_URL);
            const newPost: Post = {
                id_user: user.id_user,
                date: new Date(),
                type: postType,
                afficher: true,
                text: postDesc,
                titre_post: postTitle,
            }
            postService.addPost(newPost);
            navigate('/profile/'+user.username)
        }
    }

    return (
        <div>
            <Navbar/>
            <div className='centered-content'>
                <div className='bordered-content'>
                    <h1 className='title'>Créer une publication</h1>
            
                    <div>
                        <TextField required className='create-post-type' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Type de la publication" variant='outlined' onChange={e => setPostType(e.target.value)}/>
                        <TextField required className='create-post-titre' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Nom de la publication" variant='outlined' onChange={e => setPostTitle(e.target.value)}/>
                        <TextField required className='create-post-desc' sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Description " variant='outlined' onChange={e => setPostDesc(e.target.value)}/>
                        {/* selon le type, il faut mettre ingrédiants, temps de préparation etc... */}
                    </div>
                    <div>
                        <button onClick={handleAnnuler}>Annuler</button>
                        <button onClick={handleNewPost}>Ajouter</button>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default CreatePost;
