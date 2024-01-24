import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IMGrestau from './assets/restau.jpg';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea'; 

import StarIcon from '@mui/icons-material/Star';
import { Description } from '@mui/icons-material';

export default function RestauCard({data}) {

  const handleClick = () => {
    // Define the action to take when the card is clicked
    console.log('Card clicked!');

  };

  

  return (
    
    <CardActionArea onClick={handleClick}> 
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
          <StarIcon /> {data.notes.average_grade} 
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
  );
}