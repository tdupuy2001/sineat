import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserService } from "../services/UserService";
import { config } from "../config";
import { Route, Routes } from 'react-router-dom';

const ProfileRoute = (props: React.PropsWithChildren<{}>) => {
    const navigate = useNavigate();
    const [userExists, setUserExists] = useState(false);
    const { usernameLink="" } = useParams()

    const checkUser = () => {
        const userService = new UserService(config.API_URL);

        userService.getUser(usernameLink).then((response) => {
        if (response.data!=null) {
            setUserExists(true);
        } else { 
            setUserExists(false);
            navigate('/unknown_user');
        }
        });

    
    };

    useEffect(() => {
        checkUser();
    }, [usernameLink]);

    return (
        <React.Fragment>
        {
            userExists ? props.children : null
        }
        </React.Fragment>
    );
};

export default ProfileRoute;
