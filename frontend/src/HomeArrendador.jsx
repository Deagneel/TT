import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar la hoja de estilos de Bootstrap


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
    navigate('/Chat');

  };

  const [auth, setAuth] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleLogoutClick = () => {
    axios.get('http://localhost:3031/logout')
    .then(res => {
      if (res.data.Status === "Success") {
        swal("Sesión Cerrada Correctamente", " ", "success");
        navigate('/login');
      } else {
        alert("error");
      }
    }).catch(err => console.log(err))
  };

  const handlePerfilClick = () => {
    navigate('/perfilarrendador');
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
  const navigate = useNavigate();
  const [registeredProperties, setRegisteredProperties] = useState([]);


  const handleEditClick = (idInmueble) => {
    if (idInmueble) {
      const url = `/EditarInmueble/${idInmueble}`;
      console.log('URL:', url);
      navigate(url);
      console.log('Navegación realizada a /EditarInmueble');
    } else {
      console.error('Error: ID del inmueble no válido');
    }
  };
  
  
  
  useEffect(() => {
    axios.get('http://localhost:3031/inmuebles')
      .then((response) => {
        setRegisteredProperties(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de propiedades:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Inmuebles Registrados</h2>
      <div className="row justify-content-center">
        {registeredProperties.map((property, index) => (
          <div key={index} className={`col-md-4 mb-4 ${property.activo === 0 || property.activo_usuario === 1 ? 'inactive' : ''}`}>
            <div className="card">
              <img
                src={`http://localhost:3031/images/${property.foto}`}
                alt="Imagen"
                className="card-img-top"
                style={{ width: '100%', height: 'auto' }}
              />
              <div className="card-body">
                <h5 className="card-title">{property.titulo}</h5>
                <p className="card-text">Dirección: {property.direccion}</p>
                <p className="card-text">Precio: {property.precio}</p>
                <button
                  className="btn btn-primary"
                  style={{ marginRight: '10px', border: '2px solid #422985' }}
                  onClick={() => handleEditClick(property.id_inmueble)}
                >
                  Editar
                </button>
                {/* Agrega otros detalles de propiedad según sea necesario */}
              </div>
              {property.activo === 0 && <p className="card-text text-danger">Inactivo por administrador</p>}
              {property.activo_usuario === 1 && <p className="card-text text-warning">Pausado</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




// Definición del componente HomeArrendador
function HomeArrendador() {
  const [correo, setCorreo] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3031')
    .then(res => {
      if(res.data.valid) {
        setCorreo(res.data.nombre);
      } else {
        navigate('/login');
      }
    })
  })

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ArrendadorNavbar />
      <ArrendadorPageContent />
    </div>
  );
}

export default HomeArrendador