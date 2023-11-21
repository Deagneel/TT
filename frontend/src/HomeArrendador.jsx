import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Definición del componente Navbar para la página de arrendador
function ArrendadorNavbar() {

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    // Manejar la acción cuando se hace clic en el botón de registrar inmueble
    console.log('Clic en Registrar Inmueble');
    navigate('/registroinmueble');
  };

  const handleBellClick = () => {
    // Manejar la acción cuando se hace clic en el ícono de la campana (bell)
    console.log('Clic en la campana');
  };

  const handleEnvelopeClick = () => {
    // Manejar la acción cuando se hace clic en el ícono del sobre (envelope)
    console.log('Clic en el sobre');
  };

 

  const [auth, setAuth] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleLogoutClick = () => {
    axios.get('http://localhost:3031/logout')
    .then(res => {
      if (res.data.Status === "Success") {
        navigate('/login');
      } else {
        alert("error");
      }
    }).catch(err => console.log(err))
  };

  const handlePerfilClick = () => {

  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        {/* Agregar el botón para registrar inmueble */}
        <button className="white-text-button" onClick={handleRegisterClick}>Registrar Inmueble</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
      <button className="white-text-button" style={{ marginRight: '75px' }} onClick={handleLogoutClick}>Cerrar Sesión</button>
        <button className="white-text-button" style={{ marginRight: '75px' }} onClick={handlePerfilClick} >Perfil</button>
        <i className="fa fa-bell icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}
  
// Definición del componente PageContent para la página de arrendador
function ArrendadorPageContent() {
  // Información de inmuebles de la base de datos mapeada en rectángulos
  const [registeredProperties, setRegisteredProperties] = useState([]);

  const handleEditClick = () => {
    // Manejar la acción cuando se hace clic en el ícono de la campana (bell)
    console.log('Clic en editar');
  };

  useEffect(() => {
    // Fetch solo la información relevante de la tabla inmueble
    axios.get('http://localhost:3031/inmuebles') // Actualiza el endpoint según sea necesario
      .then((response) => {
        setRegisteredProperties(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de propiedades:', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', height: '20vh', marginTop: '20px' }}>
      <h2 style={{ width: '100%', textAlign: 'center' }}>Inmuebles Registrados</h2>
      {registeredProperties.map((property, index) => (
        <div key={index} className="rectangle" style={{ width: '30%', margin: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <img src={'http://localhost:3031/images/'+ property.foto } alt="Imagen" style={{ width: '100%', height: 'auto' }} />
          <p>{property.titulo}</p>
          <p>Dirección: {property.direccion}</p>
          <p>Precio: {property.precio}</p>
          <button className="button" style={{ marginRight: '75px' }} onClick={handleEditClick}>Editar</button>
          {/* Agrega otros detalles de propiedad según sea necesario */}
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