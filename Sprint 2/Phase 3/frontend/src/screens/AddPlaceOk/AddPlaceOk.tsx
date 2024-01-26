import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./AddPlaceOk.css";
import Img2 from "./assets/contact1.jpg";
import Img3 from "./assets/contact2.jpg";
import Img4 from "./assets/contact3.jpg";
import Img5 from "./assets/contact4.jpg";
import Img6 from "./assets/contact5.jpg";

const AddPlaceOk = () => {
  return (
    <div className="cont-main">
      <Navbar />
      <div className="content-AddPlace">
        <div className="image-row">
          <div className="Img-Contact">
            <img src={Img4} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img3} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img2} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img5} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img6} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
        </div>
        <div className="image-row">
          <div className="Img-Contact">
            <img src={Img3} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img5} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img4} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img6} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
          <div className="Img-Contact">
            <img src={Img5} alt="Img-cont" />
            <div className="Img-Overlay"></div>
          </div>
        </div>
      </div>
      <div>
        <form className="addPlaceForm">
          <h2 className="thankYouTitle-ThankYouPage">
            Merci d'avoir ajouté l'établissement !
          </h2>
          <p className="thankYouMessage-ThankYouPage">
            Votre établissement a été ajouté avec succès.
          </p>
          <div>
            <Link to="/news">
              <button className="button-ThankYouPage">
                Aller voir le fil d'actualité
              </button>
            </Link>
            <Link to="/map">
              <button className="button-ThankYouPage">
                Retourner sur la carte
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddPlaceOk;
