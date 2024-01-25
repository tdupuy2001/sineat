import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../config";
import { UserService } from "../services/UserService";

const ProfileRoute = (props: React.PropsWithChildren<{}>) => {
  const navigate = useNavigate();
  const [userExists, setUserExists] = useState(false);
  const { usernameLink = "" } = useParams();

  const checkUser = () => {
    const userService = new UserService(config.API_URL);

    userService.getUser(usernameLink).then((response) => {
      if (response.data.user != null) {
        setUserExists(true);
      } else {
        setUserExists(false);
        navigate("/unknown_user");
      }
    });
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameLink]);

  return <React.Fragment>{userExists ? props.children : null}</React.Fragment>;
};

export default ProfileRoute;
