import { useContext, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { User } from "../../dto/User";
// import img from "../Profile/assets/profile.png"
import { readAndCompressImage } from 'browser-image-resizer';


export function UpdateProfile() {

  const [prenom, setPrenom] = useState<string | undefined>();
  const [nom, setNom] = useState<string | undefined>();
  const [dateDeNaissance, setDateDeNaissance] = useState<string | undefined>();
  const [genre, setGenre] = useState<string | undefined>();
  const [langue, setLangue] = useState<string>();
  const [description, setDescription] = useState<string | undefined>();
  const [adresse, setAdresse] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState("");

  const navigate = useNavigate();

  const context = useContext(MyBlogContext);
  const userService = new UserService(config.API_URL);

  useEffect(() => {
    if (context.user) {
      setUsername(context.user?.username);
      setIsLoggedIn(true);
      setProfilePicture("data:image/png;base64,"+context.user.ppbin);
    }
  }, [context.user]);

  let blob = null;
  if (profilePicture) {
   let byteCharacters = atob(profilePicture.split(',')[1]);
   let byteNumbers = new Array(byteCharacters.length);
   for (let i = 0; i < byteCharacters.length; i++) {
     byteNumbers[i] = byteCharacters.charCodeAt(i);
   }
   let byteArray = new Uint8Array(byteNumbers);
   blob = new Blob([byteArray], {type: 'image/jpeg'});
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const config = {
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        autoRotate: true,
        debug: true,
      };
      const configPreview = {
        quality: 0.8,
        maxWidth: 100,
        maxHeight: 100,
        autoRotate: true,
        debug: true,
      };
      try {
        const compressedFile = await readAndCompressImage(file, config);
        const previewFile = await readAndCompressImage(file, configPreview);
        const newFile = new File([compressedFile], file.name, { type: compressedFile.type });
        const newPreviewFile = new File([previewFile], file.name, { type: previewFile.type });
        setSelectedFile(newFile);
        setPreviewUrl(URL.createObjectURL(newPreviewFile));
      } catch (error) {
        console.error(error);
      }
    }
  };



  useEffect(() => {
    if (context.user) {
      setUsername(context.user.username);
      setLangue(context.user.langue);
      setPrenom(context.user.prenom);
      setNom(context.user.nom);
      setGenre(context.user.genre);
      setDateDeNaissance(context.user.date_de_naissance);
      localStorage.setItem("username", context.user.username);
    } else {
      setUsername("");
    }
  }, [context.user]);

  

  const handleUpdate = () => {
    userService.getUser(username).then((e) => {
      if (!e.data || e.data.username === username) {
        let binaryData;
        let extension;

        if (selectedFile) {
          // userService.getUser(username);
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => {
            binaryData = reader.result;
            console.log('selected file : ', selectedFile, 'Binary : ', binaryData)
            extension = selectedFile.name.split('.').pop();
            const updatedUser: User = {
              ...context.user, // spread operator to include all properties of the current user
              // id_user: context.user.id_user, Ici c'est special car il y a forcement un id
              username,
              langue,
              nom,
              prenom,
              date_de_naissance: dateDeNaissance,
              genre,
              adresse,
              description,
              old_username: usernameLink,
              ppbin: typeof binaryData === 'string' ? binaryData : undefined,
              ppform: extension,
            };
            userService
          .updateUser(updatedUser)
          .then((response) => {
            // handle success
            console.log(response.data);
            context.setUser(updatedUser); // Update the context with the updated user
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
          };
          
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
          
        } else {
        const updatedUser: User = {
          ...context.user, // spread operator to include all properties of the current user
          username,
          langue,
          nom,
          prenom,
          date_de_naissance: dateDeNaissance,
          genre,
          adresse,
          description,
          old_username: usernameLink,
          ppbin: profilePicture,
          ppform: "png",
        };
        userService
        .updateUser(updatedUser)
        .then((response) => {
          // handle success
          console.log(response.data);
          context.setUser(updatedUser); // Update the context with the updated user
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
      };
        
      } else {
        console.log("c'est pas good mais j'ai pas encore géré l'erreur");
      }
    });
  };

  

  const { usernameLink } = useParams(); // Permet de prendre la page profil du bon user

  const genres = [
    {
      value: "Femme",
      label: "Femme",
    },
    {
      value: "Homme",
      label: "Homme",
    },
    {
      value: "Non-binaire",
      label: "Non-binaire",
    },
    {
      value: "Autre",
      label: "Autre",
    },
    {
      value: "Non précisé",
      label: "Non précisé",
    },
  ];

  const langues = [
    { value: "aa", label: "Afar" },
    { value: "ab", label: "Abkhaze" },
    { value: "ae", label: "Avestique" },
    { value: "af", label: "Afrikaans" },
    { value: "ak", label: "Akan" },
    { value: "am", label: "Amharique" },
    { value: "an", label: "Aragonais" },
    { value: "ar", label: "Arabe" },
    { value: "as", label: "Assamais" },
    { value: "av", label: "Avar" },
    { value: "ay", label: "Aymara" },
    { value: "az", label: "Azéri" },
    { value: "ba", label: "Bachkir" },
    { value: "be", label: "Biélorusse" },
    { value: "bg", label: "Bulgare" },
    { value: "bh", label: "Bihari" },
    { value: "bi", label: "Bichelamar" },
    { value: "bm", label: "Bambara" },
    { value: "bn", label: "Bengali" },
    { value: "bo", label: "Tibétain" },
    { value: "br", label: "Breton" },
    { value: "bs", label: "Bosnien" },
    { value: "ca", label: "Catalan" },
    { value: "ce", label: "Tchétchène" },
    { value: "ch", label: "Chamorro" },
    { value: "co", label: "Corse" },
    { value: "cr", label: "Cri" },
    { value: "cs", label: "Tchèque" },
    { value: "cu", label: "Vieux-slave" },
    { value: "cv", label: "Tchouvache" },
    { value: "cy", label: "Gallois" },
    { value: "da", label: "Danois" },
    { value: "de", label: "Allemand" },
    { value: "dv", label: "Maldivien" },
    { value: "dz", label: "Dzongkha" },
    { value: "ee", label: "Ewe" },
    { value: "el", label: "Grec moderne" },
    { value: "en", label: "Anglais" },
    { value: "eo", label: "Espéranto" },
    { value: "es", label: "Espagnol" },
    { value: "et", label: "Estonien" },
    { value: "eu", label: "Basque" },
    { value: "fa", label: "Persan" },
    { value: "ff", label: "Peul" },
    { value: "fi", label: "Finnois" },
    { value: "fj", label: "Fidjien" },
    { value: "fo", label: "Féroïen" },
    { value: "fr", label: "Français" },
    { value: "fy", label: "Frison occidental" },
    { value: "ga", label: "Irlandais" },
    { value: "gd", label: "Écossais" },
    { value: "gl", label: "Galicien" },
    { value: "gn", label: "Guarani" },
    { value: "gu", label: "Gujarati" },
    { value: "gv", label: "Mannois" },
    { value: "ha", label: "Haoussa" },
    { value: "he", label: "Hébreu" },
    { value: "hi", label: "Hindi" },
    { value: "ho", label: "Hiri motu" },
    { value: "hr", label: "Croate" },
    { value: "ht", label: "Créole haïtien" },
    { value: "hu", label: "Hongrois" },
    { value: "hy", label: "Arménien" },
    { value: "hz", label: "Héréro" },
    { value: "ia", label: "Interlingua" },
    { value: "id", label: "Indonésien" },
    { value: "ie", label: "Occidental" },
    { value: "ig", label: "Igbo" },
    { value: "ii", label: "Yi" },
    { value: "ik", label: "Inupiak" },
    { value: "io", label: "Ido" },
    { value: "is", label: "Islandais" },
    { value: "it", label: "Italien" },
    { value: "iu", label: "Inuktitut" },
    { value: "ja", label: "Japonais" },
    { value: "jv", label: "Javanais" },
    { value: "ka", label: "Géorgien" },
    { value: "kg", label: "Kikongo" },
    { value: "ki", label: "Kikuyu" },
    { value: "kj", label: "Kuanyama" },
    { value: "kk", label: "Kazakh" },
    { value: "kl", label: "Groenlandais" },
    { value: "km", label: "Khmer" },
    { value: "kn", label: "Kannada" },
    { value: "ko", label: "Coréen" },
    { value: "kr", label: "Kanouri" },
    { value: "ks", label: "Cachemiri" },
    { value: "ku", label: "Kurde" },
    { value: "kv", label: "Komi" },
    { value: "kw", label: "Cornique" },
    { value: "ky", label: "Kirghiz" },
    { value: "la", label: "Latin" },
    { value: "lb", label: "Luxembourgeois" },
    { value: "lg", label: "Ganda" },
    { value: "li", label: "Limbourgeois" },
    { value: "ln", label: "Lingala" },
    { value: "lo", label: "Lao" },
    { value: "lt", label: "Lituanien" },
    { value: "lu", label: "Luba" },
    { value: "lv", label: "Letton" },
    { value: "mg", label: "Malgache" },
    { value: "mh", label: "Marshallais" },
    { value: "mi", label: "Maori de Nouvelle-Zélande" },
    { value: "mk", label: "Macédonien" },
    { value: "ml", label: "Malayalam" },
    { value: "mn", label: "Mongol" },
    { value: "mo", label: "Moldave" },
    { value: "mr", label: "Marathi" },
    { value: "ms", label: "Malais" },
    { value: "mt", label: "Maltais" },
    { value: "my", label: "Birman" },
    { value: "na", label: "Nauruan" },
    { value: "nb", label: "Norvégien bokmål" },
    { value: "nd", label: "Sindebele" },
    { value: "ne", label: "Népalais" },
    { value: "ng", label: "Ndonga" },
    { value: "nl", label: "Néerlandais" },
    { value: "nn", label: "Norvégien nynorsk" },
    { value: "no", label: "Norvégien" },
    { value: "nr", label: "Nrebele" },
    { value: "nv", label: "Navajo" },
    { value: "ny", label: "Chichewa" },
    { value: "oc", label: "Occitan" },
    { value: "oj", label: "Ojibwé" },
    { value: "om", label: "Oromo" },
    { value: "or", label: "Oriya" },
    { value: "os", label: "Ossète" },
    { value: "pa", label: "Pendjabi" },
    { value: "pi", label: "Pali" },
    { value: "pl", label: "Polonais" },
    { value: "ps", label: "Pachto" },
    { value: "pt", label: "Portugais" },
    { value: "qu", label: "Quechua" },
    { value: "rm", label: "Romanche" },
    { value: "rn", label: "Kirundi" },
    { value: "ro", label: "Roumain" },
    { value: "ru", label: "Russe" },
    { value: "rw", label: "Kinyarwanda" },
    { value: "sa", label: "Sanskrit" },
    { value: "sc", label: "Sarde" },
    { value: "sd", label: "Sindhi" },
    { value: "se", label: "Same du Nord" },
    { value: "sg", label: "Sango" },
    { value: "sh", label: "Serbo-croate" },
    { value: "si", label: "Cingalais" },
    { value: "sk", label: "Slovaque" },
    { value: "sl", label: "Slovène" },
    { value: "sm", label: "Samoan" },
    { value: "sn", label: "Shona" },
    { value: "so", label: "Somali" },
    { value: "sq", label: "Albanais" },
    { value: "sr", label: "Serbe" },
    { value: "ss", label: "Swati" },
    { value: "st", label: "Sotho du Sud" },
    { value: "su", label: "Soundanais" },
    { value: "sv", label: "Suédois" },
    { value: "sw", label: "Swahili" },
    { value: "ta", label: "Tamoul" },
    { value: "te", label: "Télougou" },
    { value: "tg", label: "Tadjik" },
    { value: "th", label: "Thaï" },
    { value: "ti", label: "Tigrigna" },
    { value: "tk", label: "Turkmène" },
    { value: "tl", label: "Tagalog" },
    { value: "tn", label: "Tswana" },
    { value: "to", label: "Tongien" },
    { value: "tr", label: "Turc" },
    { value: "ts", label: "Tsonga" },
    { value: "tt", label: "Tatar" },
    { value: "tw", label: "Twi" },
    { value: "ty", label: "Tahitien" },
    { value: "ug", label: "Ouïghour" },
    { value: "uk", label: "Ukrainien" },
    { value: "ur", label: "Ourdou" },
    { value: "uz", label: "Ouzbek" },
    { value: "ve", label: "Venda" },
    { value: "vi", label: "Vietnamien" },
    { value: "vo", label: "Volapük" },
    { value: "wa", label: "Wallon" },
    { value: "wo", label: "Wolof" },
    { value: "xh", label: "Xhosa" },
    { value: "yi", label: "Yiddish" },
    { value: "yo", label: "Yoruba" },
    { value: "za", label: "Zhuang" },
    { value: "zh", label: "Chinois" },
    { value: "zu", label: "Zoulou" },
  ];

  return (
    // <div><Navbar />
    <div className="main-update-profile">
      <div className="SignIn">
        <div className="cont-signIn">
          <img
            className="img-auto"
            alt="Sin nobg"
            src="https://cdn.animaapp.com/projects/652956d4313e8aaa8f26adb6/releases/6548c973bfd479f2efe3643d/img/sin-2-nobg-1.png"
          />

          <div className="title-signin">Modifie ton Profil !</div>

          {/* {loginMessage && (<Alert severity={loginMessageType}>
                {loginMessage}
              </Alert>)}  */}

          <TextField
            required
            className="text-field"
            sx={{ m: 1, width: "80%" }}
            id="outlined-basic"
            label="Nom d'utilisateur"
            defaultValue={context.user?.username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* <TextField required className="text-field" sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Email" variant="outlined" onChange={e => setEmail(e.target.value)}/> */}

          <TextField
            className="text-field"
            sx={{ m: 1, width: "80%" }}
            id="outlined-basic"
            label="Prénom"
            variant="outlined"
            defaultValue={context.user?.prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />

          <TextField
            className="text-field"
            sx={{ m: 1, width: "80%" }}
            id="outlined-basic"
            label="Nom de famille"
            variant="outlined"
            defaultValue={context.user?.nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <TextField
            className="text-field"
            sx={{ m: 1, width: "80%" }}
            id="outlined-basic"
            label="Date de naissance"
            type="date"
            variant="outlined"
            defaultValue={context.user?.date_de_naissance || null}
            onChange={(e) => setDateDeNaissance(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            className="text-field"
            sx={{ m: 1, width: "80%" }}
            id="outlined-basic"
            label="Genre"
            variant="outlined"
            select
            defaultValue={
              context.user?.genre !== null && context.user?.genre !== undefined
                ? context.user?.genre
                : "Non précisé"
            }
            onChange={(e) => setGenre(e.target.value)}
          >
            {genres.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
          type="file"
          onChange={handleFileChange}
        />
        {previewUrl ? <img src={previewUrl} alt="Preview" /> : <img src={blob ? URL.createObjectURL(blob) : ''} style={{width: '100px', height: '100px', objectFit: 'cover'}} alt="Default" />}

          <TextField
            required
            className="text-field"
            sx={{ m: 1, width: "80%" }}
            id="outlined-basic"
            label="Langue"
            variant="outlined"
            select
            defaultValue={context.user?.langue}
            onChange={(e) => setLangue(e.target.value)}
          >
            {langues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <NavLink to={`/profile/${username}`}>
            <button onClick={handleUpdate}>Update Profile</button>
          </NavLink>

          <div className="privacy">
            <span>
              By continuing , you agree to the{" "}
              <a href="http://">Terms of use</a> and{" "}
              <a href="http://">Privacy policies</a>
            </span>
          </div>
          <div className="last-signin">
            <div>
              <a href="http://">Autres problemes</a>
            </div>
            <div>
              <a href="http://">Mot de passe oublié ?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default UpdateProfile;
