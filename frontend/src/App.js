import React from 'react';
import Home from './Home';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import RecuperarContra from './RecuperarContra';
import NuevaContra from './NuevaContra';
import TipoUsuario from './TipoUsuario';
import PerfilArrendador from './PerfilArrendador';
import Chat from './Chat';
import HomeArrendador from './HomeArrendador';
import HomeArrendatario from './HomeArrendatario';
import ListaInmuebles from './ListaInmuebles';
import InfoInmueble from './EditarInmueble/InfoInmueble';
import RegistroInmueble from './RegistroInmueble';
import EditarInmueble from './EditarInmueble/EditarInmueble';
import Incidencia from './Incidencia';
import AdministrarIncidencia from './AdministrarIncidencia';
import PerfilArrendatario from './PerfilArrendatario';
import HomeAdministrador from './HomeAdministrador';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recuperarcontra" element={<RecuperarContra />} />
        <Route path="/nuevacontra/:id_usuario" element={<NuevaContra />} />
        <Route path="/tipousuario" element={<TipoUsuario />} />
        <Route path="/perfilarrendador" element={<PerfilArrendador />} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/homearrendador" element={<HomeArrendador />} />
        <Route path="/homearrendatario" element={<HomeArrendatario />} />
        <Route path="/listainmuebles" element={<ListaInmuebles />} />
        <Route path="/infoinmueble" element={<InfoInmueble />} />
        <Route path="/registroinmueble" element={<RegistroInmueble />} />
        <Route path="/EditarInmueble/:id_inmueble" element={<EditarInmueble />} />
        <Route path="/incidencia" element={<Incidencia />} />
        <Route path="/perfilarrendatario" element={<PerfilArrendatario />} />
        <Route path="/administrarincidencia/:id_reporte" element={<AdministrarIncidencia />} />
        <Route path="/homeadministrador" element={<HomeAdministrador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
