import React from 'react';
import Navbar from '../../components/Navbar/Navbar'; // Ajoutez cette ligne pour importer le composant Navbar
import './Map.css';
import Img from './assets/SIN-2-NoBG.png';
import { Link,  useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/searchbar';
import { MapContainer, TileLayer,ZoomControl  } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import LeafletGeocoder from './LeafletGeocoder';
import { useState} from 'react';
import {useMapEvents } from 'react-leaflet';
import LeafletRouting from './LeafletRouting';
import FilterBar from './FilterBar';

function Map() {
  const navigate = useNavigate();

  const handleLogin = () => {
    
    navigate("/login")
  };

  /*TomTom   Free api adresse to cordinate*/

  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  return (
    <div className='cont-Main'>
      <Navbar />
   
      <div className='content-map'>
        <div className='restau-side'>
          <div className='filter-cont'>
            
          </div>
          <div className='restau-rect'>
          <div>
      <FilterBar/>
    </div>
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
                {/*<ZoomControl position="bottomright" />*/}

            {/*  <LocationMarker />
            <LeafletGeocoder/> */} 
            <LeafletRouting/>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

let DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  iconSize: [20, 36],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default Map;
