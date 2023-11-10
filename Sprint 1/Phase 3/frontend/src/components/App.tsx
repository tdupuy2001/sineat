import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { User } from '../dto/User';
import { UserService } from '../services/UserService';
import { config } from '../config';
import { MyBlogContext } from '../MyBlogContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import { Index } from '../screens/Index';
import { Register } from '../screens/Register/Register';

function App() {

  return (
    <div>
      <Routes>
        <Route 
        path='/login'
        element={<Index/>}
        />
        <Route
        path='/'
        element={<LoginPage/>}/>
        <Route 
        path='/register'
        element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
