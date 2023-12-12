import React from 'react';
import Navbar from '../../components/Navbar/Navbar'; // Ajoutez cette ligne pour importer le composant Navbar
import './Map.css';
import Img from './assets/SIN-2-NoBG.png';
import { Link,  useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/searchbar';
import { MapContainer, TileLayer } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function Map() {
  const navigate = useNavigate();

  const handleLogin = () => {
    
    navigate("/login")
  };

  /*TomTom   Free api adresse to cordinate*/

  return (
    <div className='cont-Main'>
      <Navbar />
      <div className='content-map'>
        <div className='restau-side'>
          <div className='filter-cont'>
          </div>
          <div className='restau-rect'>
          <Skeleton variant="rectangular" width="90%" height="30%" />
          <Skeleton variant="rectangular" width="90%" height="30%" />
          <Skeleton variant="rectangular" width="90%" height="30%" />
          </div>
        </div>
        <div className='map-side'>
          <div className='map-cont'>
            <MapContainer center={[43.92517082408836, 2.147408244346074]} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[43.92517082408836, 2.147408244346074]}>
                <Popup>
                  Restaurant <br /> Description.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
