import './App.css';
import React, { useState, useEffect } from "react";
import { Route, Routes} from 'react-router-dom';
import {Login}  from '../screens/Login/Login';
import Main from '../screens/Main/Main';
import { MyBlogContext } from '../MyBlogContext';
import { UserService } from "../services/UserService";
import { config } from '../config';
import {Register} from '../screens/Register/Register';
import About from '../screens/About/About';
import Contact from '../screens/Contact/Contact';
import Map from '../screens/Map/Map';
import { User } from '../dto/User';
import Profile from '../screens/Profile/Profile.tsx';
import Error404 from '../screens/Error/error_404/Error404.tsx';
import UpdateProfile from '../screens/UpdateProfile/UpdateProfile.tsx';
import ProtectedRoute from '../util/ProtectedRoute.tsx';
import ProfileRoute from '../util/ProfileRoute.tsx';
import UnknownUser from '../screens/Error/unknown_user/UnknownUser.tsx';



function App() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      const userService = new UserService(config.API_URL);
      userService.getUser(username).then((u) => {
        if (u.data) {
          setUser(u.data);
        }
      });
    }
  }, []);

  return (
    
    <MyBlogContext.Provider value={{ user, setUser }}>
    <div>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/' element={<Main />}/>
        <Route path='/Register' element={<Register />}/>
        <Route path='/about' element={<About />} />
        <Route path='/map' element={<Map />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/profile/:usernameLink" element={<ProfileRoute><ProtectedRoute><Profile/></ProtectedRoute></ProfileRoute>} />
        <Route path="/updateprofile/:usernameLink" element={<UpdateProfile/>} />
        <Route path="/unknown_user" element={<UnknownUser/>}></Route>
        <Route path="/*" element={<Error404/>}></Route>
      </Routes>
    </div>
    </MyBlogContext.Provider>
  );
}

export default App;
