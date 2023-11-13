import React, {useCallback, useContext, useState} from "react";
import { Divider } from "../../components/Divider";
import { LinkText } from "../../components/LinkText";
import { Property1Hide } from "../../icons/Property1Hide";
import "../Register/style.css";
import { AlertColor, Button, MenuItem, TextField } from "@mui/material";
import { Property1See } from "../../icons/Property1See";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { User } from "../../dto/User";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../../dto/UserLogin";


export function Register() {
  const context = useContext(MyBlogContext);

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [prenom, setPrenom] = useState<string>();
  const [nom, setNom] = useState<string>();
  const [dateDeNaissance, setDateDeNaissance] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [langue, setLangue] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [adresse, setAdresse] = useState<string>("");
  // const [avatar, setAvatar] = useState<string>();

  const [loginMessageType, setLoginMessageType] = useState<AlertColor>(
    "info"
  );
  const [loginMessage, setLoginMessage] = useState("Se connecter");
  const navigate = useNavigate();
  //ici à changer pour le register
  const login = useCallback(
    (user: User) => {
      context.setUser(user);
      localStorage.setItem("username", user.username);
      setLoginMessage("");
      setLoginMessageType("info");
      navigate("/");
    },
    [context, navigate]
  );

  const genres = [
    {
      value: 'Femme',
      label: 'Femme',
    },
    {
      value: 'Homme',
      label: 'Homme',
    },
    {
      value: 'Non-binaire',
      label: 'Non-binaire',
    },
    {
      value: 'Autre',
      label: 'Autre',
    },
    {
      value: 'Non précisé',
      label: 'Non précisé'
    }
  ];

  const langues = [
    { value: 'aa', label: 'Afar' },
    { value: 'ab', label: 'Abkhaze' },
    { value: 'ae', label: 'Avestique' },
    { value: 'af', label: 'Afrikaans' },
    { value: 'ak', label: 'Akan' },
    { value: 'am', label: 'Amharique' },
    { value: 'an', label: 'Aragonais' },
    { value: 'ar', label: 'Arabe' },
    { value: 'as', label: 'Assamais' },
    { value: 'av', label: 'Avar' },
    { value: 'ay', label: 'Aymara' },
    { value: 'az', label: 'Azéri' },
    { value: 'ba', label: 'Bachkir' },
    { value: 'be', label: 'Biélorusse' },
    { value: 'bg', label: 'Bulgare' },
    { value: 'bh', label: 'Bihari' },
    { value: 'bi', label: 'Bichelamar' },
    { value: 'bm', label: 'Bambara' },
    { value: 'bn', label: 'Bengali' },
    { value: 'bo', label: 'Tibétain' },
    { value: 'br', label: 'Breton' },
    { value: 'bs', label: 'Bosnien' },
    { value: 'ca', label: 'Catalan' },
    { value: 'ce', label: 'Tchétchène' },
    { value: 'ch', label: 'Chamorro' },
    { value: 'co', label: 'Corse' },
    { value: 'cr', label: 'Cri' },
    { value: 'cs', label: 'Tchèque' },
    { value: 'cu', label: 'Vieux-slave' },
    { value: 'cv', label: 'Tchouvache' },
    { value: 'cy', label: 'Gallois' },
    { value: 'da', label: 'Danois' },
    { value: 'de', label: 'Allemand' },
    { value: 'dv', label: 'Maldivien' },
    { value: 'dz', label: 'Dzongkha' },
    { value: 'ee', label: 'Ewe' },
    { value: 'el', label: 'Grec moderne' },
    { value: 'en', label: 'Anglais' },
    { value: 'eo', label: 'Espéranto' },
    { value: 'es', label: 'Espagnol' },
    { value: 'et', label: 'Estonien' },
    { value: 'eu', label: 'Basque' },
    { value: 'fa', label: 'Persan' },
    { value: 'ff', label: 'Peul' },
    { value: 'fi', label: 'Finnois' },
    { value: 'fj', label: 'Fidjien' },
    { value: 'fo', label: 'Féroïen' },
    { value: 'fr', label: 'Français' },
    { value: 'fy', label: 'Frison occidental' },
    { value: 'ga', label: 'Irlandais' },
    { value: 'gd', label: 'Écossais' },
    { value: 'gl', label: 'Galicien' },
    { value: 'gn', label: 'Guarani' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'gv', label: 'Mannois' },
    { value: 'ha', label: 'Haoussa' },
    { value: 'he', label: 'Hébreu' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ho', label: 'Hiri motu' },
    { value: 'hr', label: 'Croate' },
    { value: 'ht', label: 'Créole haïtien' },
    { value: 'hu', label: 'Hongrois' },
    { value: 'hy', label: 'Arménien' },
    { value: 'hz', label: 'Héréro' },
    { value: 'ia', label: 'Interlingua' },
    { value: 'id', label: 'Indonésien' },
    { value: 'ie', label: 'Occidental' },
    { value: 'ig', label: 'Igbo' },
    { value: 'ii', label: 'Yi' },
    { value: 'ik', label: 'Inupiak' },
    { value: 'io', label: 'Ido' },
    { value: 'is', label: 'Islandais' },
    { value: 'it', label: 'Italien' },
    { value: 'iu', label: 'Inuktitut' },
    { value: 'ja', label: 'Japonais' },
    { value: 'jv', label: 'Javanais' },
    { value: 'ka', label: 'Géorgien' },
    { value: 'kg', label: 'Kikongo' },
    { value: 'ki', label: 'Kikuyu' },
    { value: 'kj', label: 'Kuanyama' },
    { value: 'kk', label: 'Kazakh' },
    { value: 'kl', label: 'Groenlandais' },
    { value: 'km', label: 'Khmer' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ko', label: 'Coréen' },
    { value: 'kr', label: 'Kanouri' },
    { value: 'ks', label: 'Cachemiri' },
    { value: 'ku', label: 'Kurde' },
    { value: 'kv', label: 'Komi' },
    { value: 'kw', label: 'Cornique' },
    { value: 'ky', label: 'Kirghiz' },
    { value: 'la', label: 'Latin' },
    { value: 'lb', label: 'Luxembourgeois' },
    { value: 'lg', label: 'Ganda' },
    { value: 'li', label: 'Limbourgeois' },
    { value: 'ln', label: 'Lingala' },
    { value: 'lo', label: 'Lao' },
    { value: 'lt', label: 'Lituanien' },
    { value: 'lu', label: 'Luba' },
    { value: 'lv', label: 'Letton' },
    { value: 'mg', label: 'Malgache' },
    { value: 'mh', label: 'Marshallais' },
    { value: 'mi', label: 'Maori de Nouvelle-Zélande' },
    { value: 'mk', label: 'Macédonien' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mn', label: 'Mongol' },
    { value: 'mo', label: 'Moldave' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ms', label: 'Malais' },
    { value: 'mt', label: 'Maltais' },
    { value: 'my', label: 'Birman' },
    { value: 'na', label: 'Nauruan' },
    { value: 'nb', label: 'Norvégien bokmål' },
    { value: 'nd', label: 'Sindebele' },
    { value: 'ne', label: 'Népalais' },
    { value: 'ng', label: 'Ndonga' },
    { value: 'nl', label: 'Néerlandais' },
    { value: 'nn', label: 'Norvégien nynorsk' },
    { value: 'no', label: 'Norvégien' },
    { value: 'nr', label: 'Nrebele' },
    { value: 'nv', label: 'Navajo' },
    { value: 'ny', label: 'Chichewa' },
    { value: 'oc', label: 'Occitan' },
    { value: 'oj', label: 'Ojibwé' },
    { value: 'om', label: 'Oromo' },
    { value: 'or', label: 'Oriya' },
    { value: 'os', label: 'Ossète' },
    { value: 'pa', label: 'Pendjabi' },
    { value: 'pi', label: 'Pali' },
    { value: 'pl', label: 'Polonais' },
    { value: 'ps', label: 'Pachto' },
    { value: 'pt', label: 'Portugais' },
    { value: 'qu', label: 'Quechua' },
    { value: 'rm', label: 'Romanche' },
    { value: 'rn', label: 'Kirundi' },
    { value: 'ro', label: 'Roumain' },
    { value: 'ru', label: 'Russe' },
    { value: 'rw', label: 'Kinyarwanda' },
    { value: 'sa', label: 'Sanskrit' },
    { value: 'sc', label: 'Sarde' },
    { value: 'sd', label: 'Sindhi' },
    { value: 'se', label: 'Same du Nord' },
    { value: 'sg', label: 'Sango' },
    { value: 'sh', label: 'Serbo-croate' },
    { value: 'si', label: 'Cingalais' },
    { value: 'sk', label: 'Slovaque' },
    { value: 'sl', label: 'Slovène' },
    { value: 'sm', label: 'Samoan' },
    { value: 'sn', label: 'Shona' },
    { value: 'so', label: 'Somali' },
    { value: 'sq', label: 'Albanais' },
    { value: 'sr', label: 'Serbe' },
    { value: 'ss', label: 'Swati' },
    { value: 'st', label: 'Sotho du Sud' },
    { value: 'su', label: 'Soundanais' },
    { value: 'sv', label: 'Suédois' },
    { value: 'sw', label: 'Swahili' },
    { value: 'ta', label: 'Tamoul' },
    { value: 'te', label: 'Télougou' },
    { value: 'tg', label: 'Tadjik' },
    { value: 'th', label: 'Thaï' },
    { value: 'ti', label: 'Tigrigna' },
    { value: 'tk', label: 'Turkmène' },
    { value: 'tl', label: 'Tagalog' },
    { value: 'tn', label: 'Tswana' },
    { value: 'to', label: 'Tongien' },
    { value: 'tr', label: 'Turc' },
    { value: 'ts', label: 'Tsonga' },
    { value: 'tt', label: 'Tatar' },
    { value: 'tw', label: 'Twi' },
    { value: 'ty', label: 'Tahitien'},
    { value: 'ug', label: 'Ouïghour'},
    { value: 'uk', label: 'Ukrainien'},
    { value: 'ur', label: 'Ourdou'},
    { value: 'uz', label: 'Ouzbek'},
    { value: 've', label: 'Venda'},
    { value: 'vi', label: 'Vietnamien'},
    { value: 'vo', label: 'Volapük'},
    { value: 'wa', label: 'Wallon'},
    { value: 'wo', label: 'Wolof'},
    { value: 'xh', label: 'Xhosa'},
    { value: 'yi', label: 'Yiddish'},
    { value: 'yo', label: 'Yoruba'},
    { value: 'za', label: 'Zhuang'},
    { value: 'zh', label: 'Chinois'},
    { value: 'zu', label: 'Zoulou'},
  ]

  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const validatePasswords = (): boolean => {
    if (password !== confirmPassword) {
      setLoginMessage("Les mots de passe ne correspondent pas !");
      setLoginMessageType("error");
      return false;
    }
    return true;
  };


  const _handleRegisterRequested = () => {
    if (username) {
      const userService = new UserService(config.API_URL);
      userService.getUser(username).then((u) => {
        if (u.data) {
          setLoginMessage("Nom d'utilisateur déjà utilisé !")
          setLoginMessageType("error");
        } else {
          if (validatePasswords()) {
            if (username && password && email && dateDeNaissance && langue) {
              const userService = new UserService(config.API_URL);
              const user: UserLogin = {
                username: username,
                password: password,
                role: "",
                email: email,
                prenom: prenom,
                nom: nom,
                langue: langue,
                description: description,
                adresse: adresse,

                date_de_naissance: dateDeNaissance,
                genre: genre ?? ""
              }
              userService.addUser(user).then((u) => {
                if (u.data) {
                  login(u.data);
                }
              });
            }
          } else {
            setLoginMessage("Les mots de passe ne correspondent pas !")
            setLoginMessageType("error");
          }
        }
      });
    } 
  };
 
  return (
    <div className="index" style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems:'center', height:'100vh', width: '100vw'}}>
      

        <div className="sign-in-wrapper">
          <div className="sign-in">
            <div className="frame-2">
              <img
                className="SIN-nobg"
                alt="Sin nobg"
                src="https://cdn.animaapp.com/projects/652956d4313e8aaa8f26adb6/releases/6548c973bfd479f2efe3643d/img/sin-2-nobg-1.png"
              />
              <div className="text-wrapper-5">Rejoins-nous !</div>
              <div className="frame-3">
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Nom d'utilisateur *</div>
                  </div>
                  <input className="text-field" onChange={e => setUsername(e.target.value)}/> 
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Email *</div>
                  </div>
                  <input className="text-field" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label"> Prénom </div>
                    </div>
                    <input className="text-field" defaultValue={prenom} onChange={e => setPrenom(e.target.value)}/>
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Nom de famille </div>
                  </div>
                  <input className="text-field" defaultValue={nom} onChange={e => setNom(e.target.value)}/>
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Date de naissance *</div>
                  </div>
                  <input className="text-field" type="date" onChange={e => setDateDeNaissance(e.target.value)} />
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Genre </div>
                  </div>
                  <TextField className="text-field" select defaultValue="Non précisé" onChange={e => setGenre(e.target.value)}>
                    {genres.map((option)=> (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label-2"> Langue *</div>
                    </div>
                    <TextField className="text-field" select defaultValue="Non précisé" onChange={e => setLangue(e.target.value)}>
                    {langues.map((option)=> (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label-2">Description</div>
                    </div>
                    <input className="text-field" defaultValue={description} onChange={e => setDescription(e.target.value)}/>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label-2"> Adresse </div>
                    </div>
                    <input className="text-field" defaultValue={adresse} onChange={e => setAdresse(e.target.value)}/>
                </div>
                
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label-2">Mot de passe *</div>
                    </div>
                    <input className="text-field" type="password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label"> Confirmer le mot de passe *</div>
                    </div>
                    <input className="text-field" type="password" onChange={e => setConfirmPassword(e.target.value)}/>
                </div>
                <div className="frame-5">
                  <Button className="frame-wrapper" onClick={_handleRegisterRequested}>
                    <div className="sign-up-wrapper">
                      <div className="sign-up-2">Log in</div>
                    </div>
                  </Button>
                  <LinkText className="link-text-instance" text="By continuing, you agree to the " />
                </div>
              </div>
              <div className="frame-6">
                <p className="p">Un problème ? On vous aide <a href=""> ici</a></p>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default Register;