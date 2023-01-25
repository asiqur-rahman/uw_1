import  './assets/css/style.css';
import './assets/vendors/mdi/css/materialdesignicons.min.css';
import './assets/vendors/css/vendor.bundle.base.css';
import './App.css';
import LoginPage from './Views/Account/LoginPage';
import IndexPage from './Views/IndexPage';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import ConfirmPassword from './Views/Account/ConfirmPassword';

function App() {
  return (
    <BrowserRouter >
      <Routes>
      <Route path="/login" element={<LoginPage/>} />
    <Route path="/" element={<Navigate to="login" />} />
    <Route path="/password" element={<ConfirmPassword/>} />
      <Route path="/*" element={<IndexPage/>}/>
      </Routes>
      </BrowserRouter>

  );
}

export default App;
