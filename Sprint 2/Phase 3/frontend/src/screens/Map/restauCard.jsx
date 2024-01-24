import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IMGrestau from './assets/restau.jpg';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea'; 
import Rating from '@mui/material/Rating';


import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


import StarIcon from '@mui/icons-material/Star';

import { EtablissementService } from '../../services/EtablissementService';
import { config } from '../../config';


export default function RestauCard({data,onClick}) {

  const [showDetails, setShowDetails] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [sansGlutenRating, setSansGlutenRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
   console.log(data)
  }, [data])
  


  const handleRatingDialogOpen = () => {
    setRatingDialogOpen(true);
  };

  useEffect(() => {
    // Check if username exists in session storage
    const username = window.sessionStorage.getItem("username");

    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleRatingDialogClose = () => {
    setRatingDialogOpen(false);
  };

  const toggleDetails = () => {
    if (data.coord) {
      const coordinates = [data.coord.geometry.coordinates[1], data.coord.geometry.coordinates[0]-0.005];
      onClick(coordinates);
    }
    setShowDetails(!showDetails);
  };

  const submitRating = async () => {

    const etablissementService = new EtablissementService(config.API_URL);

    const id_user =  window.sessionStorage.getItem("userid");
    const id_etablissement = data.id_etablissement // Replace with the correct field from your data

    try {
        const response = await etablissementService.addRating({
            id_user: id_user,
            id_etablissement: id_etablissement,
            rating1: sansGlutenRating,
            rating2: ambianceRating
        });
        console.log("Rating submitted successfully", response.data);
        // Handle any post-submission logic here (e.g., showing a success message)
    } catch (error) {
        console.error("Error submitting rating", error);
        // Handle the error case (e.g., showing an error message)
    }

    handleRatingDialogClose();
}

useEffect(() => {

}, [ratingDialogOpen])



  return (
    <>
    <CardActionArea onClick={toggleDetails}> 
    <Card sx={{ display: 'flex' , margin : 1}}>
      <CardMedia
        component="img"
        sx={{ width: 151}}
        image={IMGrestau}
        alt="RestauIMG"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h5">
            {data.nom}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" style={{display:"flex", gap:"1px"}}>
          {data.notes[0].global_average.toFixed(2)} 
          <Rating 
              name="read-only" 
              value={data.notes[0].global_average} 
              precision={0.5} 
              readOnly
            />
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
        <Typography variant="subtitle1" color="text.primary" component="div">
            {data.description}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
        {`${data.numero_rue} ${data.rue}, ${data.code_postal} ${data.ville}`}
          </Typography>
        </Box>
      </Box>
      </Card>
      </CardActionArea> 
      {showDetails && (
        <Box sx={{ 
          position: 'absolute', 
          zIndex: 1000, 
          backgroundColor: 'white', 
          boxShadow: 3, 
          padding: 2, 
          borderRadius: '4px',
          // Adjust the positioning as needed
          top: '21%',
          left: '54%',
          width: '24%',
          maxHeight: '80%',
          overflowY: 'auto'
        }}>
          <IconButton
            aria-label="close"
            onClick={toggleDetails}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#ffffff'
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            image={IMGrestau} 
            alt="Cover Image"
            sx={{ width: '100%', height: 'auto', borderRadius: '4px 4px 0 0' }} // Adjust styles as needed
          />
          <Typography variant="h5" component="h2">
            {data.nom}
          </Typography>
          <Typography variant="h7">
          {`${data.numero_rue} ${data.rue}, ${data.code_postal} ${data.ville}`}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{}}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor sequi odio iure iusto quos voluptas dolore, 
            {data.description}
          </Typography>
          {data.notes[0].notes.map((note, index) => (
              <div key={index} style={{display:"flex",alignItems:"center" , textAlign :"center"}}>
                <span>{note.note_type} : </span>
                <Rating name={`note-type-${index}`} value={note.average_grade} precision={0.1} readOnly />
              </div>
            ))}
            {
              isLoggedIn && <IconButton aria-label="rate this restaurant" onClick={handleRatingDialogOpen}>
              <StarIcon /> <span style={{fontSize :"15px"}}> Notez ce restaurant</span>
            </IconButton>
            }
            
        </Box>
        
      )}
            {/* Rating Dialog */}
            <Dialog open={ratingDialogOpen} onClose={handleRatingDialogClose}>
        <DialogTitle>Notez {data.nom}</DialogTitle>
        <DialogContent>
          {/* Sans Gluten Rating */}
          <Typography component="legend">Note Sans Gluten</Typography>
          <Rating
            name="sans-gluten-rating"
            value={sansGlutenRating}
            onChange={(event, newValue) => {
              setSansGlutenRating(newValue);
            }}
          />
          {/* Ambiance Rating */}
          <Typography component="legend">Note Ambiance</Typography>
          <Rating
            name="ambiance-rating"
            value={ambianceRating}
            onChange={(event, newValue) => {
              setAmbianceRating(newValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRatingDialogClose}>Cancel</Button>
          <Button onClick={() => submitRating(/* Pass the rating value here */)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}