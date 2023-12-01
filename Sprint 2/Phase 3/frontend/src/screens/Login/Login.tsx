import React, {useCallback, useContext, useState} from "react";
import { Alert, AlertColor, TextField } from "@mui/material";
import { MyBlogContext } from "../../MyBlogContext";
import { useNavigate } from "react-router-dom";
import { User } from "../../dto/User";
import { UserService } from "../../services/UserService";
import { config } from "../../config";



import './Login.css'
import SignUpImg from './assets/signup-img.png';
import SigninImg from './assets/SIN-2-NoBG.png'
import Divider from '../../components/Divider/Divider'

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function Login() {

  const [showPassword, setShowPassword] = useState(false);

  const _ = "";

  const navigate = useNavigate();

  const context = useContext(MyBlogContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [loginMessageType, setLoginMessageType] = useState<AlertColor>(
    "info"
  );

  const [loginMessage, setLoginMessage] = useState("");

  const login = useCallback(
    (user: User) => {
      context.setUser(user);
      sessionStorage.setItem("username", user.username);
      setLoginMessage("");
      setLoginMessageType("info");
      navigate("/");
    },
    [context, navigate]
  );


  const handleLoginRequested = () => {
    if (username && password) {
      const userService = new UserService(config.API_URL);
      userService.log_user({ username, role: _, date_de_naissance: _, email: _, password, langue: _, nom: _, prenom: _, genre: _, adresse: _, description: _ }).then((response: any) => {
        if (response.data.message === 'success') {
          const user = response.data.user;
          login(user); // This will update the context and navigate to "/"
        } else {
          setLoginMessage("Mauvais nom d'utilisateur ou mot de passe !");
          setLoginMessageType("error");
        }
      });
    } else {
      setLoginMessage("Veuillez entrer un nom d'utilisateur et un mot de passe.");
      setLoginMessageType("error");
    }
  };

  const handleRegister = () => {
    navigate("/Register");
  };
  



  
  return (
    <div className='mainLog'>
        <div className='SignUp'>
            <div className='ContSignUp'>
                <div className='Img-signup'>
                    <img src={SignUpImg} alt="SignUpImg" />
                </div>
                <Divider />   
                <div className='Btn-signup'>
                    <button className='btn-signup' onClick={handleRegister}>Créer un compte</button>
                </div>
                <div className='Texts'>
                    <span>
                    SINEAT , LE PARTENAIRE DE VOTRE ALIMENTAIRE GLUTEN FREE
                    </span>
                </div>
            </div>
        </div>
        <div className='SignIn'>
            <div className='cont-signIn'>
                <img src={SigninImg} alt="SigninImg" className='Img-signin' />
                <div className='title-signin'> Se connecter</div>
                {loginMessage && (<Alert severity={loginMessageType}>
                  {loginMessage}
                </Alert>)}
                <TextField  sx={{ m: 1, width: '80%' }} id="outlined-basic" label="Username" variant="outlined" onChange={(evt) => setUsername(evt.target.value)}/>
                <FormControl sx={{ m: 1, width: '80%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                        onChange={(evt) => setPassword(evt.target.value)}
                        />
                </FormControl>
                <button className='btn-signin' onClick={handleLoginRequested}>Se connecter</button>
                <div className='privacy'>
                    <span>
                        By continuing , you agree to the <a href="http://">Terms of use</a> and <a href="http://">Privacy policies</a>
                    </span>
                </div>
                <div className='last-signin'>
                    <div><a href="http://">Autres problemes</a></div>
                    <div><a href="http://">Mot de passe oublié ?</a></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login