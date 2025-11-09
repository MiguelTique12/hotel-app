import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/styles/main/main.css';

// Importar componentes en orden
import HomePage from './components/views/homePage/HomePage';
import Login from './components/views/login/Login';
import Dashboard from './components/views/Dashboard/Dashboard';
import HomeContent from './components/views/Dashboard/HomeContent';
import UsuariosRegister from './components/views/userRegister/userRegister';
import HotelRegister from './components/views/hotelRegiter/hotelRegister';
import HotelesGestion from './components/views/hotelRegiter/HotelesGestion';
import HotelDetalle from './components/views/hotelRegiter/HotelDetalle';
import HabitacionRegister from './components/views/hotelRegiter/HabitacionRegister';
import RentasRegister from './components/views/rent/rent';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <Dashboard>
              <HomeContent />
            </Dashboard>
          } />

          <Route path="/usuarios" element={
            <Dashboard>
              <UsuariosRegister />
            </Dashboard>
          } />

          <Route path="/hotel" element={
            <Dashboard>
              <HotelRegister />
            </Dashboard>
          } />

          <Route path="/hoteles" element={
            <Dashboard>
              <HotelesGestion />
            </Dashboard>
          } />

          <Route path="/hoteles/:id" element={
            <Dashboard>
              <HotelDetalle />
            </Dashboard>
          } />

          <Route path="/habitacion" element={
            <Dashboard>
              <HabitacionRegister />
            </Dashboard>
          } />

          <Route path="/alquiler" element={
            <Dashboard>
              <RentasRegister />
            </Dashboard>
          } />
        </Routes>
      </Router>
  );
}

export default App;