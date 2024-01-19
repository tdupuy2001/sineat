import React, { useState, useEffect } from 'react';
import { MenuItem, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './AddPlace.css';
import Navbar from '../../components/Navbar/Navbar';
import {PlaceService} from '../../services/PlaceService';
import  { config } from "../../config"
import Img2 from './assets/contact1.jpg';
import Img3 from './assets/contact2.jpg';
import Img4 from './assets/contact3.jpg';
import Img5 from './assets/contact4.jpg';
import Img6 from './assets/contact5.jpg';
import { Place } from '../../dto/Place';

const AddPlace = () => {
  const [typesEtablissements, setTypesEtablissements] = useState([]);

  useEffect(() => {
  fetch('http://localhost:9456/types-etablissements')
    .then(response => response.json())
    .then(data => {
      console.log('Types d\'établissements récupérés :', data);
      setTypesEtablissements(data.types_etablissements);
    })
    .catch(error => console.error('Erreur lors de la récupération des types d\'établissements:', error));
}, []);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tab1');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const placeService = new PlaceService(config.API_URL)

  const [nomEtablissement, setNomEtablissement]=useState<string>();
  const [rueEtablissement, setRueEtablissement]=useState<string>();
  const [villeEtablissement, setVilleEtablissement]=useState<string>();
  const [codePostalEtablissement, setCodePostalEtablissement]=useState<number>();
  const [numeroRueEtablissement, setNumeroRueEtablissement]=useState<number>();
  const [typeEtablissement, setTypeEtablissement]=useState<string>();

  const handleSubmit = () => {
    if (nomEtablissement && rueEtablissement && villeEtablissement && codePostalEtablissement && numeroRueEtablissement && typeEtablissement) {
      const place: Place = {
        nom: nomEtablissement,
        ville: villeEtablissement,
        code_postal: codePostalEtablissement,
        rue: rueEtablissement,
        numero_rue: numeroRueEtablissement,
        type: typeEtablissement
      }
      placeService.addPlace(place)
      navigate('/add-place-ok')
    }
  }

  return (
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
        <form className="addPlaceForm" onSubmit={handleSubmit}>
          <h2 className="addPlaceTitle">Partage une adresse</h2>
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
          <div className="test_tab">
              <label>
                <div className="form">
                  Nom de l'établissement:
                  <TextField
                    className="inputField"
                    type="text"
                    name="nom"
                    onChange={(e) => setNomEtablissement(e.target.value)}
                    placeholder="Le Tournesol"
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Ville de l'établissement:
                  <TextField
                    className="inputField"
                    type="text"
                    name="ville"
                    onChange={(e) => setVilleEtablissement(e.target.value)}
                    placeholder="Albi"
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Code postal de l'établissement:
                  <TextField
                    className="inputField"
                    type="text"
                    name="rue"
                    onChange={(e) => setCodePostalEtablissement(parseInt(e.target.value))}
                    placeholder="81000"
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Rue de l'établissement:
                  <TextField
                    className="inputField"
                    type="texte"
                    name="rue"
                    onChange={(e) => setRueEtablissement(e.target.value)}
                    placeholder="Allée des Sciences"
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Numéro de rue de l'établissement:
                  <TextField
                    className="inputField"
                    type=""
                    name="numero_rue"
                    onChange={(e) => setNumeroRueEtablissement(parseInt(e.target.value))}
                    placeholder= "17"
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Type de l'établissement:
                  <TextField
                    className="inputField"
                    select
                    name="type"
                    value={typeEtablissement}
                    onChange={(e) => setTypeEtablissement(e.target.value)}
                  >
                    {typesEtablissements.map((type, index) => (
                      <MenuItem key={index} value={type}>{type}</MenuItem>
                    ))}
                  </TextField>
                </div>
              </label>
          </div>
        )}

        {activeTab === 'tab2' && (
          <div className='onglet'>
          </div>
        )}

        {activeTab === 'tab3' && (
          <div className='onglet'>
          </div>
        )}
              <button type="submit" className="submitButton">
              <i className="fas fa-plus"></i>   + Ajouter l'établissement 
              </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;
