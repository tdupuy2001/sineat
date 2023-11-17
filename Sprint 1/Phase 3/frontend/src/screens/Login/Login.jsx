import React from 'react'
import './Login.css'
import SignUpImg from './assets/signup-img.png';
import SigninImg from './assets/SIN-2-NoBG.png'
import Divider from '../../components/Divider/Divider'

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {

    const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
                    <button className='btn-signup'>Créer un compte</button>
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
                <div className='Img-signin'>
                    <img src={SigninImg} alt="SigninImg" />
                </div>
                <div className='title-signin'> Se connecter</div>
                <div className='username'>
                    <TextField  sx={{ m: 1, width: '400px' }} id="outlined-basic" label="Username" variant="outlined" />
                </div>
                <div className='psswd'>
                <FormControl sx={{ m: 1, width: '400px' }} variant="outlined">
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
                        />
                </FormControl>
                </div>
                <div className='Btn-signin'>
                    <button className='btn-signin'>Se connecter</button>
                </div>
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