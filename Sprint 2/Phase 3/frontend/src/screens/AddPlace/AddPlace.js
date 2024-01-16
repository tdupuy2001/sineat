import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPlace.css';
import Navbar from '../../components/Navbar/Navbar';

import Img2 from './assets/contact1.jpg';
import Img3 from './assets/contact2.jpg';
import Img4 from './assets/contact3.jpg';
import Img5 from './assets/contact4.jpg';
import Img6 from './assets/contact5.jpg';

const AddPlace = () => {
  const [placeInfo, setPlaceInfo] = useState({
    name: '',
    address: '',
    establishmentType: 'None',
    postalCode: '',
    city: '',
  });

  const [activeTab, setActiveTab] = useState('tab1');

  const handleChange = (e) => {
    setPlaceInfo({
      ...placeInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Informations à envoyer:', placeInfo);
    setPlaceInfo({
      name: '',
      address: '',
      establishmentType: 'Restaurant',
      postalCode: '',
      city: '',
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
                <div className={`form ${placeInfo.name === '' ? 'defaultValueStyle' : ''}`}>
                  Type de l'établissement:
                  <select
                    className="customSelect" 
                    name="establishmentType"
                    value={placeInfo.establishmentType}
                    onChange={handleChange}
                  >
                    <option value="None">Choisir une valeur</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Boulangerie">Boulangerie</option>
                  </select>
                </div>
              </label>
              <label>
                <div className={`form ${placeInfo.name === '' ? 'defaultValueStyle' : ''}`}>
                  Nom de l'établissement:
                  <input
                    className="inputField"
                    type="text"
                    name="name"
                    value={placeInfo.name}
                    onChange={handleChange}
                    placeholder="Nom de l'établissement"
                  />
                </div>
              </label>
              <label>
                <div className={`form ${placeInfo.postalCode === '' ? 'defaultValueStyle' : ''}`}>
                  Code postal:
                  <input
                    className="inputField"
                    type="text"
                    name="postalCode"
                    value={placeInfo.postalCode}
                    onChange={handleChange}
                    placeholder="Code postal"
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Ville:
                  <input
                    className="inputField"
                    type="text"
                    name="city"
                    value={placeInfo.city}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <label>
                <div className="form">
                  Adresse:
                  <input
                    className="inputField"
                    type="text"
                    name="address"
                    value={placeInfo.address}
                    onChange={handleChange}
                  />
                </div>
              </label>
          </div>
        )}

        {activeTab === 'tab2' && (
          <div className='onglet'>
            {/* Contenu de l'onglet 2 ici */}
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
                    value={placeInfo.address}
                    onChange={handleChange}
                  />
                </div>
              </label>
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

