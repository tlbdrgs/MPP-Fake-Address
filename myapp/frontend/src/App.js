import './App.css';
import FakeAddressGenerator from './AddressComponent/FakeAddressGenerator';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Login/Register';
import LoginPage from './Login/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/fake-address-generator" element={<FakeAddressGenerator />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
