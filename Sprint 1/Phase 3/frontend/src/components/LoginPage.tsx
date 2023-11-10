import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyBlogContext } from "../MyBlogContext";
// import { v4 as uuidv4 } from "uuid";
import { User } from "../dto/User";
import { UserService } from "../services/UserService";
import { config } from "../config";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export function LoginPage() {
  const context = useContext(MyBlogContext);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loginMessageType, setLoginMessageType] = useState<AlertColor>(
    "info"
  );
  const [loginMessage, setLoginMessage] = useState("Log in to My Blog");
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
    console.log(username + " " + password + " test login");
    if (username && username === password) {
      //axios.post() TODO real authentication
      const userService = new UserService(config.API_URL);
      userService.getUser(username).then((u) => {
        if (u.data) {
          login(u.data);
        } else {
          const user: User = {
            // id: uuidv4(),
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
      setLoginMessage("Rooh wrong password!");
      setLoginMessageType("error");
    }
  };

  const _handleForgotPasswordRequested = () => {
    setLoginMessage("Rooh you forgot your password");
    setLoginMessageType("warning");
    //axios.post()
  };

  return (
    <Stack style={{ width: "33%", margin: "auto" }}>
      <div>
        <Box display="block" width="100%" marginTop={"5%"}>
          <Alert
            severity={
              loginMessageType
            }
          >
            {loginMessage}
          </Alert>
            <Typography color="primary" variant="body1">Username: *</Typography>
            <TextField
            sx={{width:"100%"}}
              type="text"
              variant="filled"
              label="Username"
              defaultValue={username}
              onChange={(evt) => setUsername(evt.target.value)}
            ></TextField>
          </Box>
          <p></p>
          <Box>
          <Typography color="primary" variant="body1">Password: *</Typography>
            <TextField
            sx={{width:"100%"}}
              type="password"
              variant="filled"
              label="Password"
              defaultValue={password}
              onChange={(evt) => setPassword(evt.target.value)}
            ></TextField>
          </Box>
        <Box display={"flex"} marginTop={"5px"}>
          <Button onClick={_handleLoginRequested} variant="contained">Log-in</Button>
          <span style={{flex:0.1}}></span>
          <Button onClick={_handleForgotPasswordRequested} variant="outlined" color="error">Forgot password?</Button>
        </Box>
      </div>
    </Stack>
  );
}

export default LoginPage;
