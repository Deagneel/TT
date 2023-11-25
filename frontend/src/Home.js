import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();


  const handleloginClick = () => {
    // Manejar la acción cuando se hace clic en boton incio de sesión
    navigate('/login');
  };

  const handlesignupClick = () => {
    // Manejar la acción cuando se hace clic en boton registrarse
    navigate('/tipousuario');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        <input type="text" placeholder="Buscar" style={{ width: '175%' }} />
      </div>
      <div>
        <button onClick={handleloginClick} className="white-text-button" style={{ marginRight: '75px' }}>Inicio de sesión</button>
        <button onClick={handlesignupClick} className="white-text-button" style={{ marginRight: '75px' }}>Registrarse</button>
      </div>
    </div>
  );
}

function Home() {
  // Información de inmuebles de la base de datos mapeada en rectángulos
  const [registeredProperties, setRegisteredProperties] = useState([]);
  const [registeredSchools, setRegisteredSchools] = useState([]);
  const [showSchools, setShowSchools] = useState(false);
  const [showInmuebles, setShowInmuebles] = useState(true);

  const handleInfoEscuelaClick = (idInmueble) => {
    navigate(`/infoinmueble?id_inmueble=${idInmueble}`);
    console.log('Clic en editar');
  };


  useEffect(() => {
    // Fetch solo la información relevante de la tabla inmueble
    axios.get('http://localhost:3031/inmueblearrendatario') // Actualiza el endpoint según sea necesario
      .then((response) => {
        setRegisteredProperties(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de propiedades:', error);
      });
  }, []);


const handleescuelaClick = () => {
  // Manejar la acción cuando se hace clic en boton escuela
  setShowSchools(true);
  setShowInmuebles(false);
};

const handleinmueClick = () => {
  // Manejar la acción cuando se hace clic en el boton inmueble
  setShowSchools(false);
  setShowInmuebles(true);
};

useEffect(() => {
  // Fetch solo la información relevante de la tabla inmueble
  axios.get('http://localhost:3031/obtenerEscuelas') // Actualiza el endpoint según sea necesario
    .then((response) => {
      setRegisteredSchools(response.data);
    })
    .catch((error) => {
      console.error('Error al obtener datos de propiedades:', error);
    });
}, []);

const navigate = useNavigate();


return (
  <div style={{ height: '100vh' }}>
    <Navbar />
    <div style={{ backgroundColor: '#808080', display: 'flex', justifyContent: 'space-between', height: '8%' }}>
      <button className="white-text-button" style={{ marginLeft: '350px' }} onClick={handleescuelaClick}>Escuelas</button>
      <button className="white-text-button" style={{ marginRight: '350px' }} onClick={handleinmueClick}>Inmuebles</button>
    </div>
    {showSchools && (
    <div className="general-container">
      {registeredSchools.map((property, index) => (
        <div key={index} className="rectangle" style={{height: '165%'}}>
          <div className="image-container">
           {/* <img src={'http://localhost:3031/images/'+ property.foto } alt="Imagen" style={{ width: '100%', height: 'auto' }} />*/}
          </div>
          <div className="propertyDetails">
            <p className="homearrendatariotitle">{property.nombre}</p>
            <p className="homearrendatario" style={{marginTop: '20px'}}>Dirección: {property.direccion}</p>
            {/* Agrega otros detalles de propiedad según sea necesario */}
          </div>
        </div>
      ))}
    </div>
    )}

    {showInmuebles && (
    <div className="general-container">
    {registeredProperties.map((property, index) => (
      <div key={index} className="rectangle">
        <div className="image-container">
          <img src={'http://localhost:3031/images/'+ property.foto } alt="Imagen" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="propertyDetails">
          <p className="homearrendatariotitle">{property.titulo}</p>
          <p className="homearrendatario">Dirección: {property.direccion}</p>
          <p className="homearrendatario">Escuela cercana: {property.nombre_escuela}</p>
          <p className="homearrendatario">Precio: {property.precio}</p>
          <button className="button" style={{ marginRight: '75px', border: '2px solid #422985' }} onClick={() => handleInfoEscuelaClick(property.id_inmueble)}>Mostrar información</button>
        {/* Agrega otros detalles de propiedad según sea necesario */}
      </div>
      </div>
      ))}
    </div>
    )}

  </div>
);
}

export default Home