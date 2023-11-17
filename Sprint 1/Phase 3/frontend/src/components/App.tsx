import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { User } from '../dto/User';
import { UserService } from '../services/UserService';
import { config } from '../config';
import { MyBlogContext } from '../MyBlogContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login  from '../screens/Login/Login';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />}/>
        
      </Routes>
    </div>
  );
}

export default App;
