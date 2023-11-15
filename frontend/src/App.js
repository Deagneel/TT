import React from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import RecuperarContra from './RecuperarContra';
import NuevaContra from './NuevaContra';
import TipoUsuario from './TipoUsuario';
import PerfilArrendador from './PerfilArrendador';
import Chat from './Chat';
import HomeArrendador from './HomeArrendador';
import HomeArrendatario from './HomeArrendatario';
import ListaInmuebles from './ListaInmuebles';
import InfoInmueble from './InfoInmueble';
import RegistroInmueble from './RegistroInmueble';
import EditarInmueble from './EditarInmueble/EditarInmueble';
import BuscarArrendador from './BuscarArrendador';
import CalificaInmuebleArrendador from './CalificaInmuebleArrendador';
import CalificaArrendatario from './CalificaArrendatario';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recuperarcontra" element={<RecuperarContra />} />
        <Route path="/nuevacontra" element={<NuevaContra />} />
        <Route path="/tipousuario" element={<TipoUsuario />} />
        <Route path="/perfilarrendador" element={<PerfilArrendador />} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/homearrendador" element={<HomeArrendador />} />
        <Route path="/homearrendatario" element={<HomeArrendatario />} />
        <Route path="/listainmuebles" element={<ListaInmuebles />} />
        <Route path="/infoinmueble" element={<InfoInmueble />} />
        <Route path="/registroinmueble" element={<RegistroInmueble />} />
        <Route path="/editarinmueble" element={<EditarInmueble />} />
        <Route path="/buscararrendador" element={<BuscarArrendador />} />
        <Route path="/calificainmueblearrendador" element={<CalificaInmuebleArrendador />} />
        <Route path="/calificaarrendatario" element={<CalificaArrendatario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
