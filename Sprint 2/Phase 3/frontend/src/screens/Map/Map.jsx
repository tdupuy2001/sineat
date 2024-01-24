import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Map.css';
import { MapContainer, TileLayer, useMapEvents,Popup,Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RestauCard from './restauCard';
import { EtablissementService } from '../../services/EtablissementService';
import { config } from '../../config';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import L from "leaflet";
import Autocomplete from './Autocomplete';
import { PostAddOutlined } from '@mui/icons-material';

function Map() {
  const [etablissements, setEtablissements] = useState([]);
  const [etablissementsNote, setEtablissementsNote] = useState([]);
  const [regimes, setRegimes] = useState([]);
  const [selectedRegime, setSelectedRegime] = useState('');
  const [mapCenter, setMapCenter] = useState([43.92517082408836, 2.147408244346074]);
  const mapRef = useRef();
  const PARIS_COORDINATES = [48.8566, 2.3522]


  const handleCardClick = (coordinates) => {
    if (mapRef.current) {
      mapRef.current.flyTo(coordinates, 15); // 15 is the zoom level
    }
  };

  useEffect(() => {
    const attemptGeolocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // User allowed location access
            if (mapRef.current) {
              mapRef.current.flyTo([position.coords.latitude, position.coords.longitude], 13); // 15 is the zoom level
            }
          },
          () => {
            // User denied location access or an error occurred
            if (mapRef.current) {
              mapRef.current.flyTo(PARIS_COORDINATES, 13); // 15 is the zoom level
            }
          }
        );
      } else {
        // Geolocation is not supported by this browser
        if (mapRef.current) {
          mapRef.current.flyTo(PARIS_COORDINATES, 13); // 15 is the zoom level
        }
      }
    };
  
    attemptGeolocation();
  
    // ... rest of your useEffect logic
  }, []);

  useEffect(() => {

    const service = new EtablissementService(config.API_URL);
    service.getEtablissements().then((response) => {
      if (response.data) {
        setEtablissements(response.data);
      }
    }).catch(error => {
      console.error("Failed to fetch etablissements:", error);
    });
    

    fetch(`${config.API_URL}/regimes`)
      .then(response => response.json())
      .then(data => setRegimes(data))
      .catch(error => console.error('Failed to fetch regimes:', error));
  }, []);

  useEffect(() => {
    const service = new EtablissementService(config.API_URL);
    if (etablissements.length > 0) {
      const fetchDetails = async () => {
        const updatedEtablissements = await Promise.all(etablissements.map(async (etab) => {
          try {
            // Construct the address string
            const address = `${etab.numero_rue} ${etab.rue}, ${etab.code_postal} ${etab.ville}`;
  
            // Fetch notes and coordinates
            const noteResponse = await service.getEtablissementNote(etab.nom);
            const coordResponse = await service.getEtablissementCoord(address);
  
            return { 
              ...etab, 
              notes: noteResponse.data, 
              coord: coordResponse.data.features[0]// Assuming this returns an object with latitude and longitude
            };
          } catch (error) {
            console.error("Failed to fetch details for establishment:", etab.nom, error);
            return { ...etab, error: true }; // Include error flag in case of failure
          }
        }));
        setEtablissementsNote(updatedEtablissements);
      };
      fetchDetails();
    }
  }, [etablissements]);
  

const handleAddressSelect = async (address) => {
  if (!address) return;

  // Fetching the coordinates for the selected address
  const coordResponse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`);
  const coordData = await coordResponse.json();

  if (coordData.features && coordData.features.length > 0) {
    const coords = coordData.features[0].geometry.coordinates;
    setMapCenter([coords[1], coords[0]]);
    if (mapRef.current) {
      mapRef.current.flyTo([coords[1], coords[0]], mapRef.current.getZoom());
    }


  }
};




const handleRegimeChange = async (event) => {
  const regimeId = event.target.value;
  setSelectedRegime(regimeId);

  if (!regimeId) {
    // If no regime is selected, fetch all etablissements
    fetchEtablissements();
    return;
  }

  const service = new EtablissementService(config.API_URL);
  try {
    const response = await service.getEtablissementsByRegime(regimeId);
    if (response.data) {
      setEtablissements(response.data); 
    }
  } catch (error) {
    console.error("Failed to fetch etablissements for regime:", regimeId, error);
  }
};

// Helper function to fetch all etablissements
const fetchEtablissements = () => {
  const service = new EtablissementService(config.API_URL);
  service.getEtablissements().then((response) => {
    if (response.data) {
      setEtablissements(response.data);
    }
  }).catch(error => {
    console.error("Failed to fetch etablissements:", error);
  });
};


  return (
    <div>
      <Navbar />
      <div className="cont_map">
      <div className="restaurant-section">
          <div className="btn-map">
            <button>
              <AddIcon />
              <span>Partager une adresse</span>
            </button>
          </div>
          <div className='list-cardrestau'>
            {etablissementsNote.map(etablissement => (
              <RestauCard key={etablissement.id} data={etablissement} onClick={handleCardClick} />
            ))}
          </div>
        </div>
        <div className="map-section">
          <div className='filter-bar'>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <Autocomplete onAddressSelect={handleAddressSelect} />
            </div>
            <FormControl style={{ flex: 1, minWidth: 120 }}>
              <InputLabel id="regime-select-label" size='small'>Regime</InputLabel>
              <Select
                labelId="regime-select-label"
                id="regime-select"
                value={selectedRegime}
                label="Regime"
                size='small'
                onChange={handleRegimeChange}
              >
                <MenuItem value="">All Regimes</MenuItem>
                {regimes.map((regime) => (
                  <MenuItem key={regime.id_regime} value={regime.id_regime}>
                    {regime.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='map-cadre'>
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={false}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {etablissementsNote.map(etab => (
                etab.coord && (
                  <Marker 
                    key={etab.id_etablissement} 
                    position={[etab.coord.geometry.coordinates[1], etab.coord.geometry.coordinates[0]]}
                  >
                    <Popup>{etab.nom}</Popup>
                  </Marker>
                )
              ))}
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
