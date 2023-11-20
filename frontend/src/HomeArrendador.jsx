import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Definición del componente Navbar para la página de arrendador
function ArrendadorNavbar() {
  const handleRegisterClick = () => {
    // Manejar la acción cuando se hace clic en el botón de registrar inmueble
    console.log('Clic en Registrar Inmueble');
  };

  const handleBellClick = () => {
    // Manejar la acción cuando se hace clic en el ícono de la campana (bell)
    console.log('Clic en la campana');
  };

  const handleEnvelopeClick = () => {
    // Manejar la acción cuando se hace clic en el ícono del sobre (envelope)
    console.log('Clic en el sobre');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        {/* Agregar el botón para registrar inmueble */}
        <button className="white-text-button" onClick={handleRegisterClick}>Registrar Inmueble</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
      <button className="white-text-button" style={{ marginRight: '75px' }}>Cerrar Sesión</button>
        <button className="white-text-button" style={{ marginRight: '75px' }}>Perfil</button>
        <i className="fa fa-bell icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}
  
// Definición del componente PageContent para la página de arrendador
function ArrendadorPageContent() {
  // Información de la base de datos mapeada en rectángulos
  const registeredProperties = [
    { image: 'url1', content: 'Propiedad 1' },
    { image: 'url2', content: 'Propiedad 2' },
    // ... Información de la base de datos
  ];

  return (
    <div style={{ height: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
      <h2>Inmuebles Registrados</h2>
      {registeredProperties.map((property, index) => (
        <div key={index} className="rectangle">
          <img src={property.image} alt="Imagen" />
          <p>{property.content}</p>
        </div>
      ))}
    </div>
  );
}

// Definición del componente HomeArrendador
function HomeArrendador() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3031')
    .then(res => {
      if(res.data.valid) {
        setName(res.data.nombre);
      } else {
        navigate('/login');
      }
    })
  })
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ArrendadorNavbar />
      <div><h1>Bienvenido, {name}</h1></div>
      <ArrendadorPageContent />
    </div>
  );
}

export default HomeArrendador