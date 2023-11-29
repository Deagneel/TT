import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();

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
        <i className="fa fa-envelope icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}

function ReportesSection() {

  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    // Realizar la petición para obtener los reportes de la base de datos
    axios.get('http://localhost:3031/obtenerReportes')
      .then(response => {
        // Establecer los reportes en el estado
        setReportes(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los reportes:', error);
      });
  }, []);

  const handleGestionarIncidencia = (reporteId) => {
    // Implementar la funcionalidad para manejar cada reporte individualmente
    console.log('Gestionar incidencia del reporte ID:', reporteId);
  };


  return (
    <div style={{ flex: 1, backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <h2>Reportes</h2>
      {reportes
        .filter(reporte => reporte.estado === 0) // Filtrar por reportes no completados (estado = 0)
        .map(reporte => (
          <div key={reporte.id_reporte} style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px' }}>
            <span className='subtitles-general'>#{reporte.id_reporte}&nbsp;&nbsp;</span>
            <span className='subtitles-general'>{reporte.asunto}</span>
            <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
            <button className="button" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
              Gestionar Incidencia
            </button>
          </div>
        ))}
    </div>
  );
  
}

function UsuariosSection() {
  const [userId, setUserId] = useState('');
  const [userReports, setUserReports] = useState([]);
  
  const handleSearch = () => {
    // Realizar la petición al servidor con el ID del reporte
    axios.get(`http://localhost:3031/obtenerReportesPorUsuario/${userId}`)
      .then(response => {
        setUserReports(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los reportes del usuario:', error);
      });
  };

  const handleGestionarIncidencia = (reporteId) => {
    // Implementar la funcionalidad para manejar cada reporte individualmente
    console.log('Gestionar incidencia del reporte ID:', reporteId);
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#F9F9F9', padding: '20px', textAlign: 'center' }}>
      <h2>Usuarios</h2>
      {/* Barra de búsqueda */}
      <input type="text" placeholder="Buscar por ID de reporte..." style={{ marginBottom: '10px', width: '89%' }} value={userId} onChange={(e) => setUserId(e.target.value)}
      />
      {/* Este es el botón de búsqueda */}
      <button style={{ background: 'none', cursor: 'pointer', border: '2px solid #ccc', width: '7%' }} onClick={handleSearch}>
        <i className="fa fa-search"></i>
      </button>
      {/* Listado de reportes asociados al usuario */}
      {userReports.filter(reporte => reporte.estado === 0) // Filtrar por reportes no completados (estado = 0)
        .map(reporte => (
        <div key={reporte.id_reporte} style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
          <h3>{reporte.nombre_usuario}</h3>
          <span className='subtitles-general'>#{reporte.id_reporte}&nbsp;&nbsp;</span>
          <span className='subtitles-general'>{reporte.asunto}</span>
          <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
          <button className="button" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
            Gestionar Incidencia
          </button>
          {/* Botones debajo del último botón "Gestionar Incidencia" */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button className="button" style={{ marginRight: '10px' }}>Bloquear Usuario</button>
            <button className="button">Mensaje</button>
          </div>
        </div>
      ))}
    </div>
  );
}


function InmueblesSection() {
  const [searchParam, setSearchParam] = useState('');
  const [userReports, setUserReports] = useState([]);
  
  const handleSearch = () => {
    // Realizar la petición al servidor con el parámetro de búsqueda
    axios.get(`http://localhost:3031/obtenerReportesPorInmueble/${searchParam}`)
      .then(response => {
        setUserReports(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los reportes del inmueble:', error);
      });
  };

  const handleGestionarIncidencia = (reporteId) => {
    // Implementar la funcionalidad para manejar cada reporte individualmente
    console.log('Gestionar incidencia del reporte ID:', reporteId);
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <h2>Inmuebles</h2>
      {/* Barra de búsqueda */}
      <input 
        type="text" 
        placeholder="Buscar..." 
        style={{ marginBottom: '10px', width: '89%' }} 
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
      />
      <button 
        onClick={handleSearch} 
        style={{ background: 'none', cursor: 'pointer', border: '2px solid #ccc', width: '7%' }}
      >
        <i className="fa fa-search"></i>
      </button>
      {userReports.filter(reporte => reporte.estado === 0) // Filtrar por reportes no completados (estado = 0)
        .map(reporte => (
        <div key={reporte.id_reporte} style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
          <h3>{reporte.nombre_inmueble}</h3>
          <span className='subtitles-general'>#{reporte.id_reporte}&nbsp;&nbsp;</span>
          <span className='subtitles-general'>{reporte.asunto}</span>
          <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
          <button className="button" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
            Gestionar Incidencia
          </button>
          {/* Botones debajo del último botón "Gestionar Incidencia" */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button className="button" style={{ marginRight: '10px' }}>Pausar publicación</button>
            <button className="button">Mensaje</button>
          </div>
        </div>
      ))}
    </div>
  );
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
