import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();

  const handleBellClick = () => {
    //Boton notificaciones
  };

  const handleEnvelopeClick = () => {
    //boton mensajes
  };

  const handleSignuplick = () => {
    navigate('/tipousuario');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '11%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
        <button onClick={handleSignuplick} className="button white-text-button" style={{ marginRight: '75px' }}>Registrar Usuario</button>
        <i className="fa fa-bell icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}

function ReportesSection() {
  return (
    <div style={{ flex: 1, backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <h2>Reportes</h2>
      {/* Información de la base de datos */}
      <div style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px' }}>
        <h3>Título del Reporte</h3>
        <p>Contenido del Reporte</p>
        <button className="button" onClick={() => handleGestionarIncidencia('reporteId')}>Gestionar Incidencia</button>
      </div>
      {/* Otros reportes */}
    </div>
  );
}

function UsuariosSection() {
  return (
    <div style={{ flex: 1, backgroundColor: '#F9F9F9', padding: '20px', textAlign: 'center' }}>
      <h2>Usuarios</h2>
      {/* Barra de búsqueda */}
      <input type="text" placeholder="Buscar..." style={{ marginBottom: '10px' }} />
      {/* Texto "Reportes Asociados" */}
      <p>Reportes Asociados</p>
      {/* Listado de reportes asociados */}
      <div style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
        <h3>Nombre del Usuario</h3>
        <p>Título del Reporte Asociado</p>
        <p>Descripción del Reporte Asociado</p>
        <button className="button" onClick={() => handleGestionarIncidencia('reporteId')}>Gestionar Incidencia</button>
        {/* Botones debajo del último botón "Gestionar Incidencia" */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button className="button" style={{ marginRight: '10px' }}>Bloquear Usuario</button>
          <button className="button">Mensaje</button>
        </div>
      </div>
    </div>
  );
}

function InmueblesSection() {
  return (
    <div style={{ flex: 1, backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <h2>Inmuebles</h2>
      {/* Barra de búsqueda */}
      <input type="text" placeholder="Buscar..." style={{ marginBottom: '10px' }} />
      {/* Texto "Reportes Asociados" */}
      <p>Reportes Asociados</p>
      {/* Listado de reportes asociados */}
      <div style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
        <h3>Nombre del Usuario</h3>
        <p>Título del Reporte Asociado</p>
        <p>Descripción del Reporte Asociado</p>
        <button className="button" onClick={() => handleGestionarIncidencia('reporteId')}>Gestionar Incidencia</button>
        {/* Botones debajo del último botón "Gestionar Incidencia" */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button className="button" style={{ marginRight: '10px' }}>Bloquear Usuario</button>
          <button className="button" style={{ marginRight: '10px' }}>Pausar Publicación</button>
          <button className="button">Mensaje</button>
        </div>
      </div>
    </div>
  );
}

function handleGestionarIncidencia(reporteId) {
  console.log(`Gestionar incidencia para el reporte ${reporteId}`);
}

function HomeAdministrador() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', height: '89%' }}>
        <ReportesSection />
        <UsuariosSection />
        <InmueblesSection />
      </div>
    </div>
  );
}

export default HomeAdministrador;
