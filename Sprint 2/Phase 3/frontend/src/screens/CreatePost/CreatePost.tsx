import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Alert, AlertColor,TextField,MenuItem } from '@mui/material';
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
import { PostAdd } from '../../dto/PostAdd';


export function CreatePost() {

    const navigate = useNavigate();
    const [postTitle, setPostTitle] = useState<string>();
    const [postType, setPostType] = useState<string>();
    const [postDesc, setPostDesc] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>();
    const {user} = useContext(MyBlogContext)
    const [ingredients, setIngredients] = useState('');
    const [preparationTime, setPreparationTime] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');

    const [activeTab, setActiveTab] = useState('tab1');

    const [selectedFile, setSelectedFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string>();

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
      };
    

    const handleAnnuler = () => {
        navigate("/news");
    };

    const handleNewPost = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!postType || !postTitle || !postDesc) {
        setAlertMessage('Veuillez remplir tous les champs obligatoires.');
        setAlertSeverity('error');
      } else {
        if (user) {
            const postService = new PostService(config.API_URL);
            if (selectedFile){
              let binaryData;
              let extension;
              const reader = new FileReader();
              reader.readAsDataURL(selectedFile);
              reader.onload = () => {
              binaryData = reader.result;
              if (binaryData && typeof binaryData === "string") {
                binaryData = binaryData.replace(
                  /^data:image\/[a-z]+;base64,/,
                  ""
                );
              }
              extension = selectedFile.name.split(".").pop();

              const newPost: PostAdd = {
                id_user: user.id_user,
                type: postType,
                text: postDesc,
                afficher:true,
                titre_post: postTitle,
                picbin: typeof binaryData === "string" ? binaryData : undefined,
                picform: extension,
              }
              postService.addPost(newPost);
              navigate('/profile/'+user.username)
            };

            reader.onerror = function (error) {
              console.log("Error: ", error);
            };
            } else {
              const newPost: PostAdd = {
                id_user: user.id_user,
                type: postType,
                text: postDesc,
                afficher:true,
                titre_post: postTitle,
              };
            try {
                await postService.addPost(newPost);
                navigate('/profile/'+user.username)
                setAlertMessage('');
                setAlertSeverity('info');
            } catch (error) {
              console.error('Failed to create post:', error);
            }
        }
      }     
        }
    }
  }



    const handlePhoto = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const config = {
          maxWidth: 800,
          maxHeight: 800,
          autoRotate: true,
          debug: true,
        };
        try {
          const compressedFile = await readAndCompressImage(file, config);
          const newFile = new File([compressedFile], file.name, {
            type: compressedFile.type,
          });
          setSelectedFile(newFile);
          setPreviewUrl(URL.createObjectURL(newFile));
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    return (
      <div className="add_post_main">
        <Navbar />
        <div>
          <h2 className="addPostTitle">Créer une publication</h2>
        </div>
        <div className='content-AddPost'>
          <div className='tabsPost'>
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
          </div>
          {activeTab === 'tab1' && (
          <div className="formPost">
            <TextField
              select
              label="Type de publication"
              value={postType}
              onChange={e => setPostType(e.target.value)}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem key="texte" value="texte">Texte</MenuItem>
              <MenuItem key="recette" value="recette">Recette</MenuItem>
              <MenuItem key="restaurant" value="restaurant">Restaurant</MenuItem>
              <MenuItem key="santé" value="santé">Santé</MenuItem>
            </TextField>

            <TextField
              label="Nom de la publication"
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              placeholder="Nom de la publication"
              variant="outlined"
              fullWidth
            />

            <TextField
              label="Description"
              value={postDesc}
              onChange={e => setPostDesc(e.target.value)}
              placeholder="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
            />
          </div>
          )}
  
          {activeTab === 'tab2' && (
          <div className='filePost'>
            <TextField
              type="file"
              inputProps={{
                accept: "image/jpeg, image/jpg, image/png"
              }}
              onChange={handlePhoto}
              className="file-selection"
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="img-preview-post" />
            ) : ''}
          </div>
          )}
        </div>
        <div className='fixed-container'>
              <div className='alert_post'>
                  {errorMessage && (<Alert severity="error">
                      {errorMessage}
                  </Alert>)}
              </div>
              <div className="SubmitButton">
                  <button onClick={handleNewPost} className='submitButton'>
                      +   Créer la publication
                  </button>
              </div>
        </div>
      </div>    
  );
};

export default CreatePost;
