import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import {TextField } from '@mui/material';
import './CreatePost.css'
import { useNavigate } from 'react-router-dom';
import { PostService } from '../../services/PostService';
import { config } from '../../config';
import { MyBlogContext } from '../../MyBlogContext';
import { Post } from '../../dto/Post';
import { readAndCompressImage } from "browser-image-resizer";

import Img2 from './assets/contact1.jpg';
import Img3 from './assets/contact2.jpg';
import Img4 from './assets/contact3.jpg';
import Img5 from './assets/contact4.jpg';
import Img6 from './assets/contact5.jpg';


export function CreatePost() {

    const navigate = useNavigate();
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const {user} = useContext(MyBlogContext)
    const [ingredients, setIngredients] = useState('');
    const [preparationTime, setPreparationTime] = useState('');

    const [activeTab, setActiveTab] = useState('tab1');

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
      };
    

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



const handlePhoto = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  if (event.target.files && event.target.files.length > 0) {
    const files = Array.from(event.target.files);
    const config = {
      maxWidth: 800,
      maxHeight: 800,
      autoRotate: true,
      debug: true,
    };

    const filePromises = files.map(async (file) => {
      try {
        const compressedFile = await readAndCompressImage(file, config);
        const newFile = new File([compressedFile], file.name, {
          type: compressedFile.type,
        });
        return { file: newFile, url: URL.createObjectURL(newFile) };
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    // Attendez que toutes les promesses soient résolues
    const processedFiles = await Promise.all(filePromises);

    // Filtrez les résultats non nuls et mettez à jour les états
    const validFiles = processedFiles.filter((result) => result !== null) as { file: File; url: string }[];
    setSelectedFiles(validFiles.map((result) => result.file));
    setPreviewUrls(validFiles.map((result) => result.url));
  }
};

    return (
        // <div>
        //     <Navbar/>
        //     <div className='centered-content'>
        //         <div className='bordered-content'>
        //             <h1 className='title'>Créer une publication</h1>
        //             <div className='buttons-sous-titre'>
        //                 <div className="button-wrapper">
        //                     <div className='button-underline'></div>
        //                     <button className='button-filtres'>Informations</button>
        //                 </div>
        //                 <div className="button-wrapper">
        //                     <div className='button-underline'></div>
        //                     <button className='button-filtres'>Vos photos</button>
        //                 </div>
        //             </div>
        //             <div className='textfield-wrapper'>
        //                 <TextField required className='create-post-type' sx={{ m: 1, width: '100%' }} id='outlined-basic' label="Type de la publication" variant='outlined' select defaultValue="texte" onChange={e => setPostType(e.target.value)}>
        //                     <MenuItem value={"texte"}>Post</MenuItem>
        //                     <MenuItem value={"recette"}>Recette</MenuItem>
        //                     <MenuItem value={"restaurant"}>Restaurant</MenuItem>
        //                     <MenuItem value={"santé"}>Santé</MenuItem>
        //                 </TextField>


        //                 <TextField required className='create-post-titre' sx={{ m: 1, width: '100%' }} id="outlined-basic" label="Nom de la publication" variant='outlined' onChange={e => setPostTitle(e.target.value)}/>
        //                 <TextField required className='create-post-desc' sx={{ m: 1, width: '100%' }} id="outlined-multiline-static" label="Description " variant='outlined' multiline rows={4} onChange={e => setPostDesc(e.target.value)}/>
        //                 {/* selon le type, il faut mettre ingrédiants, temps de préparation etc... */}
        //                 {postType === "recette" && (
        //                     <div>
        //                         <TextField
        //                             required
        //                             className='create-post-ingredients'
        //                             sx={{ m: 1, width: '100%' }}
        //                             id="outlined-basic"
        //                             label="Ingrédients"
        //                             variant='outlined'
        //                             onChange={(event) => setIngredients(event.target.value)}
        //                         />
        //                         <TextField
        //                             required
        //                             className='create-post-time'
        //                             sx={{ m: 1, width: '100%' }}
        //                             id="outlined-basic"
        //                             label="Temps de préparation"
        //                             variant='outlined'
        //                             onChange={(event) => setPreparationTime(event.target.value)}
        //                         /> 
        //                     </div>
        //                 )}
        //             </div>
        //             <div className='buttons-create'>
        //                 <button className='button-ajouter' onClick={handleNewPost}> + Créer la publication</button>
        //                 <button className='button-retour' onClick={handleAnnuler}>
        //                     <FontAwesomeIcon icon={faTimes} size="sm"/>
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className='cont-main'>
        <Navbar />
        <div className='content-AddPlace'>
          <div className='image-row'>
            <div className='Img-Contact'>
              <img src={Img4} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img3} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img2} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img5} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img6} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
          </div>
          <div className='image-row'>
            <div className='Img-Contact'>
              <img src={Img3} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img5} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img4} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img6} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
            <div className='Img-Contact'>
              <img src={Img5} alt="Img-cont" />
              <div className='Img-Overlay'></div>
            </div>
          </div>
          <form className="addPlaceForm" onSubmit={handleNewPost}>
            <h2 className="addPlaceTitle">Créer une publication</h2>
            <div className='tabs'>
            <button
              className={activeTab === 'tab1' ? 'active' : ''}
              onClick={() => handleTabChange('tab1')}
            >
              Informations
            </button>
            <button
              className={activeTab === 'tab2' ? 'active' : ''}
              onClick={() => handleTabChange('tab2')}
            >
              Vos photos
            </button>
            <button
              className={activeTab === 'tab3' ? 'active' : ''}
              onClick={() => handleTabChange('tab3')}
            >
              Votre avis
            </button>
          </div>
  
          {activeTab === 'tab1' && (
            <div>
                <label>
                    <div className={`form ${postType === '' ? 'defaultValueStyle' : ''}`}>
                        Type de publication:
                        <select
                        className="customSelect" 
                        name="type"
                        value={postType}
                        onChange={e => setPostType(e.target.value)} >
                        <option value="None">Choisir une valeur</option>
                        <option value="texte">Post</option>
                        <option value="recette">Recette</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="santé">Santé</option>
                        </select>
                    </div>
                </label>
                <label>
                    <div className={`form ${postTitle === '' ? 'defaultValueStyle' : ''}`}>
                        Nom de la publication:
                        <input
                        className="inputField"
                        type="text"
                        name="title"
                        value={postTitle}
                        onChange={e => setPostTitle(e.target.value)}
                        placeholder="Nom de la publication"
                        />
                    </div>
                </label>
                <label>
                    <div className={`form ${postDesc === '' ? 'defaultValueStyle' : ''}`}>
                        Description:
                        <input
                        className="inputField"
                        type="text"
                        name="description"
                        value={postDesc}
                        onChange={e => setPostDesc(e.target.value)}
                        placeholder="Description"
                        />
                    </div>
                </label>
            </div>
          )}
  
          {activeTab === 'tab2' && (
              <div className='onglet'>
              <TextField
                type="file"
                inputProps={{ multiple: true }} // Ajoutez cette propriété pour permettre la sélection de plusieurs fichiers
                onChange={handlePhoto}
                className="file-selection"
              />
              </div>
          )}
  
          {activeTab === 'tab3' && (
              <label>
                  <div className="form">
                    Ton avis:
                    <input
                      className="inputField"
                      type="text"
                      name="address"
                      value={postTitle}
                      onChange={e => setPostTitle(e.target.value)}
                    />
                  </div>
                </label>
          )}
                <button type="submit" className="submitButton">
                <i className="fas fa-plus"></i>   +   Créer la publication
                </button>
          </form>
        </div>
      </div>    
  );
};

export default CreatePost;
