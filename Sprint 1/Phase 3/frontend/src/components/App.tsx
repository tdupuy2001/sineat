import './App.css';
import React, { useState, useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import {Login}  from '../screens/Login/Login';
import {Main } from '../screens/Main/Main';
import { MyBlogContext } from '../MyBlogContext';
import { User } from "../dto/User";
import { UserService } from "../services/UserService";
import { config } from '../config';
import {Register} from '../screens/Register/Register';
import About from '../screens/About/About';
import Contact from '../screens/Contact/Contact';


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
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
    </MyBlogContext.Provider>
  );
}

export default App;
