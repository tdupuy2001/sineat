import React, {useCallback, useContext, useState} from "react";
import { Divider } from "../../components/Divider";
import { LinkText } from "../../components/LinkText";
import { Property1Hide } from "../../icons/Property1Hide";
import "../Index/style.css";
import { Alert, AlertColor, Button, TextField } from "@mui/material";
import { Property1See } from "../../icons/Property1See";
import { MyBlogContext } from "../../MyBlogContext";
import { useNavigate } from "react-router-dom";
import { User } from "../../dto/User";
import { UserService } from "../../services/UserService";
import { config } from "../../config";

export function Index() {

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
  //il y a le créer un compte et se connecter ici il faudra changer
  const _handleLoginRequested = () => {
    console.log(username + " " + password + + " test login");
    if (username && username === password) {
      const userService = new UserService(config.API_URL);
      userService.getUser(username).then((u) => {
        if (u.data) {
          login(u.data);
        } else {

        }
      });
    } else {
      setLoginMessage("Mauvais mot de passe !")
      setLoginMessageType("error");
    }
  };

  const _handleForgotPasswordREquested = () => {
    setLoginMessage("Tu as oublié ton mot de passe");
    setLoginMessageType("warning");
  }

  const [shown, setShown] = useState(false);

  const handleClick = () => {
    setShown(!shown);
  }
  return (
    <div className="index">

      <div className="div-2">
        <div className="overlap-group">
          <div className="rectangle" />
          <div className="flexcontainer">
            <p className="text">
              <span className="text-wrapper-4">
                SINEAT, LE PARTENAIRE <br />
              </span>
              <span className="text-wrapper-4">
                DE VOTRE ALIMENTAIRE <br />
              </span>
              <span className="text-wrapper-4">GLUTEN FREE</span>
            </p>
          </div>
          <Divider
            className="divider-instance"
            divClassName="design-component-instance-node"
            text="New to our community"
          />
          <Button className="button">
            <div className="frame">
              <div className="sign-up">Créer un compte</div>
            </div>
          </Button>
          <img
            className="untitled"
            alt="Untitled"
            src="https://cdn.animaapp.com/projects/652956d4313e8aaa8f26adb6/releases/6548c973bfd479f2efe3643d/img/untitled-1-1.png"
          />
        </div>
        <div className="sign-in-wrapper">
          <div className="sign-in">
            <div className="frame-2">
              <img
                className="SIN-nobg"
                alt="Sin nobg"
                src="https://cdn.animaapp.com/projects/652956d4313e8aaa8f26adb6/releases/6548c973bfd479f2efe3643d/img/sin-2-nobg-1.png"
              />
              <div className="text-wrapper-5">Se connecter</div>
              <div className="frame-3">
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label"> Nom d'utilisateur</div>
                  </div>
                  <input className="text-field" type="text" defaultValue={username} onChange={(evt) => setUsername(evt.target.value)}/>
                </div>
                <div className="div-3">
                  <div className="frame-4">
                    <div className="label-2">Mot de passe</div>
                    <div className="password-hide-see">
                      <div onClick={handleClick}>
                        {shown ? <Property1See className="icon"/> : <Property1Hide className="icon" color="#666666" opacity="0.8"/>}  
                      
                        <div className="text-wrapper-6">{shown ? "Hide": "Show"}</div>
                      </div>
                    </div>
                  </div>
                  <input className="text-field" type={shown ? "text" : "password"} id="myInput" defaultValue={password} onChange={(evt) => setPassword(evt.target.value)}/>
                </div>
                <div className="frame-5">
                  <Button className="frame-wrapper" onClick={_handleLoginRequested}>
                    <div className="sign-up-wrapper">
                      <div className="sign-up-2">Se connecter</div>
                    </div>
                  </Button>
                  <LinkText className="link-text-instance" text="By continuing, you agree to the " />
                </div>
              </div>
              <div className="frame-6">
                <div className="text-wrapper-7"><a href="">Forget your password</a></div>
                <p className="p"><a href="">Other issue with sign in</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;