import React, { useState } from 'react';
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

  const handleSubmit = () => {
    if (nomEtablissement && rueEtablissement && villeEtablissement && codePostalEtablissement && numeroRueEtablissement) {
      const place: Place = {
        nom: nomEtablissement,
        ville: villeEtablissement,
        code_postal: codePostalEtablissement,
        rue: rueEtablissement,
        numero_rue: numeroRueEtablissement
      }
      placeService.addPlace(place)
      navigate('/map')
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
          <div>
              <label>
                <div className="form">
                  Nom de l'établissement:
                  <TextField
                    className="inputField"
                    type="text"
                    name="nom"
                    onChange={(e) => setNomEtablissement(e.target.value)}
                    placeholder="Nom de l'établissement"
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
                    placeholder="Ville de l'établissement"
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
                    placeholder="Code postal de l'établissement"
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
                    placeholder="Rue de l'établissement"
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
                    placeholder= "Numéro de rue de l'établissement"
                  />
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
              <i className="fas fa-plus"></i>   Ajouter l'établissement 
              </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;
