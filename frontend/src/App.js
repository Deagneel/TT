import React from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import RecuperarContra from './RecuperarContra';
import NuevaContra from './NuevaContra';
import TipoUsuario from './TipoUsuario';
import PerfilArrendador from './PerfilArrendador';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recuperarcontra" element={<RecuperarContra />} />
        <Route path="/nuevacontra" element={<NuevaContra />} />
        <Route path="/tipousuario" element={<TipoUsuario />} />
        <Route path="/perfilarrendador" element={<PerfilArrendador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
