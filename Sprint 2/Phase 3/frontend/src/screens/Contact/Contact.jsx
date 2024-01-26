import { useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar"; // Ajoutez cette ligne pour importer le composant Navbar
import "./Contact.css";

import Img2 from "./assets/contact1.jpg";
import Img3 from "./assets/contact2.jpg";
import Img4 from "./assets/contact3.jpg";
import Img5 from "./assets/contact4.jpg";
import Img6 from "./assets/contact5.jpg";

function Contact() {
  const emailRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    // Sélectionne le contenu de l'élément span
    const range = document.createRange();
    range.selectNode(emailRef.current);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Copie le texte
    document.execCommand("copy");

    // Désélectionne le champ de texte
    window.getSelection().removeAllRanges();

    // Ajoute la classe "copied" pour changer le style
    emailRef.current.classList.add("copied");

    // Affiche le message de copie pendant quelques secondes
    setCopied(true);
    setTimeout(() => {
      emailRef.current.classList.remove("copied");
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="cont-main">
      <Navbar />
      <div className="content-Contact">
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
        <div className="title-contact">CONTACT</div>
      </div>
      <div className="footer-Contact">
        <div className="mail-text">
          Une question, une bonne adresse à partager, envie de rejoindre
          l'aventure SINEAT ou pour toute autre chose, nous serons ravis de
          discuter avec vous.
        </div>{" "}
        <div>
          <span ref={emailRef} className="mail" onClick={handleCopyEmail}>
            contact@sineat.fr
          </span>
          {copied && (
            <div className="copied-message">Adresse e-mail copiée !</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
