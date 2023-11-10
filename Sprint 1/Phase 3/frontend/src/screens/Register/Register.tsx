import React, {useCallback, useContext, useState} from "react";
import { Divider } from "../../components/Divider";
import { LinkText } from "../../components/LinkText";
import { Property1Hide } from "../../icons/Property1Hide";
import "../Register/style.css";
import { AlertColor, Button, TextField } from "@mui/material";
import { Property1See } from "../../icons/Property1See";
import { MyBlogContext } from "../../MyBlogContext";
import { UserService } from "../../services/UserService";
import { config } from "../../config";
import { User } from "../../dto/User";
import { useNavigate } from "react-router-dom";

export function Register() {
  const context = useContext(MyBlogContext);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loginMessageType, setLoginMessageType] = useState<AlertColor>(
    "info"
  );
  const [loginMessage, setLoginMessage] = useState("Se connecter");
  const navigate = useNavigate();
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

  const _handleLoginRequested = () => {
    console.log(username + " " + password + + " test login");
    if (username && username === password) {
      const userService = new UserService(config.API_URL);
      userService.getUser(username).then((u) => {
        if (u.data) {
          login(u.data);
        } else {
          const user: User = {
            username: username,
            firstName: username,
            lastName: username,
            email: username + "@mail.com",
            avatar: "",
          };
          userService.addUser(user).then((u) => {
            if (u.data) {
              login(u.data);
            }
          });
        }
      });
    } else {
      setLoginMessage("Mauvais mot de passe !")
      setLoginMessageType("error");
    }
  };

  const _handleRegisterRequested = () => {
    console.log(username + " " + password + + " test login");
    if (username) {
      const userService = new UserService(config.API_URL);
      userService.getUser(username).then((u) => {
        
      })
    }
  }
 
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
                    <div className="label"> Nom d'utilisateur </div>
                  </div>
                  <input className="text-field"/>
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Email </div>
                  </div>
                  <input className="text-field"/>
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Téléphone </div>
                  </div>
                  <input className="text-field"/>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label"> Prénom </div>
                    </div>
                    <input className="text-field"/>
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Nom de famille </div>
                  </div>
                  <input className="text-field"/>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label-2">Mot de passe</div>
                    </div>
                    <input className="text-field" type="password"/>
                </div>
                <div className="div-3">
                    <div className="frame-4">
                        <div className="label"> Confirmer le mot de passe </div>
                    </div>
                    <input className="text-field" type="password"/>
                </div>
                <div className="frame-5">
                  <Button className="frame-wrapper">
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