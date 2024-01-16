import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { MenuItem, Select, TextField } from '@mui/material';
import './CreatePost.css'
import { useNavigate } from 'react-router-dom';
import { PostService } from '../../services/PostService';
import { config } from '../../config';
import { MyBlogContext } from '../../MyBlogContext';
import { Post } from '../../dto/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


export function CreatePost() {

    const navigate = useNavigate();
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const {user} = useContext(MyBlogContext)
    const [ingredients, setIngredients] = useState('');
    const [preparationTime, setPreparationTime] = useState('');


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
                    <div className='buttons-sous-titre'>
                        <div className="button-wrapper">
                            <div className='button-underline'></div>
                            <button className='button-filtres'>Informations</button>
                        </div>
                        <div className="button-wrapper">
                            <div className='button-underline'></div>
                            <button className='button-filtres'>Vos photos</button>
                        </div>
                    </div>
                    <div className='textfield-wrapper'>
                        <TextField required className='create-post-type' sx={{ m: 1, width: '100%' }} id='outlined-basic' label="Type de la publication" variant='outlined' select defaultValue="texte" onChange={e => setPostType(e.target.value)}>
                            <MenuItem value={"texte"}>Post</MenuItem>
                            <MenuItem value={"recette"}>Recette</MenuItem>
                            <MenuItem value={"restaurant"}>Restaurant</MenuItem>
                            <MenuItem value={"santé"}>Santé</MenuItem>
                        </TextField>


                        <TextField required className='create-post-titre' sx={{ m: 1, width: '100%' }} id="outlined-basic" label="Nom de la publication" variant='outlined' onChange={e => setPostTitle(e.target.value)}/>
                        <TextField required className='create-post-desc' sx={{ m: 1, width: '100%' }} id="outlined-multiline-static" label="Description " variant='outlined' multiline rows={4} onChange={e => setPostDesc(e.target.value)}/>
                        {/* selon le type, il faut mettre ingrédiants, temps de préparation etc... */}
                        {postType === "recette" && (
                            <div>
                                <TextField
                                    required
                                    className='create-post-ingredients'
                                    sx={{ m: 1, width: '100%' }}
                                    id="outlined-basic"
                                    label="Ingrédients"
                                    variant='outlined'
                                    onChange={(event) => setIngredients(event.target.value)}
                                />
                                <TextField
                                    required
                                    className='create-post-time'
                                    sx={{ m: 1, width: '100%' }}
                                    id="outlined-basic"
                                    label="Temps de préparation"
                                    variant='outlined'
                                    onChange={(event) => setPreparationTime(event.target.value)}
                                /> 
                            </div>
                        )}
                    </div>
                    <div className='buttons-create'>
                        <button className='button-ajouter' onClick={handleNewPost}> + Créer la publication</button>
                        <button className='button-retour' onClick={handleAnnuler}>
                            <FontAwesomeIcon icon={faTimes} size="sm"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default CreatePost;
