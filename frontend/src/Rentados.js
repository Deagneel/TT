import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';

function ArrendadorNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRegistrarInmueble = async () => {
    try {
      const perfilCompletadoResponse = await axios.get('http://localhost:3031/perfilCompletado');
      const perfilCompletado = perfilCompletadoResponse.data.perfilCompletado;
  
      if (perfilCompletado === 0) {
        await swal('Primero debes completar la documentación de tu perfil');
      } else {
        navigate('/registroinmueble');
      }
    } catch (error) {
      console.error('Error al navegar a Registro de Inmueble:', error);
    }
  };
  
  // Botón para ver perfil
  const handleVerPerfil = async () => {
        navigate('/perfilarrendador');
  };
  
  // Botón para acceder a los chats
  const handleChats = async () => {
        navigate('/correoobtencion');
  };
  

  const handleLogoutClick = () => {
    axios
      .get('http://localhost:3031/logout')
      .then((res) => {
        if (res.data.Status === 'Success') {
          swal('Sesión Cerrada Correctamente', ' ', 'success');
          navigate('/login');
        } else {
          alert('error');
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={toggleMenu}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
        <ul className="navbar-nav w-100 nav-fill">
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={() => window.history.back()}>Volver</button>
          </li>
          <li className="nav-item active">
             <a className="nav-link btn btn-link w-100" onClick={handleRegistrarInmueble}>
              Registrar Inmueble
            </a>
          </li>
          <li className="nav-item">
              <a className="nav-link btn btn-link w-100" onClick={handleVerPerfil}>
              Perfil
            </a>
          </li>
          <li className="nav-item">
              <a className="nav-link btn btn-link w-100" onClick={handleChats}>
              Chats
            </a>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={handleLogoutClick}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </nav>
  );
  
  
}
  
// Definición del componente PageContent para la página de arrendador
function ArrendadorPageContent() {
  const navigate = useNavigate();
  const [registeredProperties, setRegisteredProperties] = useState([]);
  const [currentPageLeft, setCurrentPageLeft] = useState(1);
  const [currentPageRight, setCurrentPageRight] = useState(1);
  const itemsPerPage = 4;
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3031/solicitudesPendientes')
      .then((response) => {
        setSolicitudesPendientes(response.data);
        if (response.data.length === 0) {
          // Mostrar mensaje SweetAlert si no hay solicitudes pendientes
          swal('No tienes solicitudes pendientes', 'No tienes ninguna solicitud de renta pendiente en este momento.', 'info');
        }
      })
      .catch((error) => {
        console.error('Error al obtener solicitudes pendientes:', error);
      });
  }, []);
  
  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3031')
    .then(res => {
      if(res.data.valid) {
      } else {
        swal('Necesitas iniciar sesión para acceder a esta función');
        navigate('/login');
      }
    })
  })
  
  useEffect(() => {
    axios.get('http://localhost:3031/inmueblesRenta')
      .then((response) => {
        setRegisteredProperties(response.data);
        if (response.data.length === 0) {
          // Mostrar mensaje SweetAlert si no hay inmuebles rentados
          swal('No tienes inmuebles rentados', 'No tienes ningún inmueble rentado en este momento.', 'info');
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos de propiedades:', error);
      });
  }, []);

  const handleChangePageLeft = (newPage) => {
    setCurrentPageLeft(newPage);
  };

  const handleChangePageRight = (newPage) => {
    setCurrentPageRight(newPage);
  };

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

  // Calcula los inmuebles a mostrar en la columna izquierda
  const indexOfLastItemLeft = currentPageLeft * itemsPerPage;
  const indexOfFirstItemLeft = indexOfLastItemLeft - itemsPerPage;
  const currentItemsLeft = registeredProperties.slice(indexOfFirstItemLeft, indexOfLastItemLeft);

  // Calcula los inmuebles a mostrar en la columna derecha
  const indexOfLastItemRight = currentPageRight * itemsPerPage;
  const indexOfFirstItemRight = indexOfLastItemRight - itemsPerPage;
  const currentSolicitudes = solicitudesPendientes.slice(indexOfFirstItemRight, indexOfLastItemRight);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Primera mitad de inmuebles a la izquierda */}
        <div className="col-md-6 divider-right">
          <h2 className="text-center mb-4">Inmuebles rentados</h2>
          <div className="row justify-content-center">
            {currentItemsLeft.map((property, index) => (
              <div key={index} className={`col-md-6 mb-4 ${property.activo === 0 || property.activo_usuario === 1 ? 'inactive' : ''}`}>
                <div className="card shadow" style={{ width: '100%', height: '100%' }}>
                  <img
                    src={`http://localhost:3031/images/${property.foto}`}
                    alt="Imagen del Inmueble"
                    className="card-img-top"
                    style={{ width: '100%', height: '50%', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{property.titulo}</h5>
                    <p className="card-text">Dirección: {property.direccion}</p>
                    <p className="card-text">Rentado a: {property.nombre} {property.primer_apellido} {property.segundo_apellido}</p>
                    {/* Otros detalles */}
                  </div>
                  {property.activo === 0 && <p className="inactiveText">Inactivo por administrador</p>}
                  {property.activo_usuario === 1 && <p className="inactiveText">Pausado</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {[...Array(Math.ceil(registeredProperties.length / itemsPerPage)).keys()].map(number => (
              <button key={number} onClick={() => handleChangePageLeft(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Segunda mitad de inmuebles a la derecha */}
        <div className="col-md-6">
          <h2 className="text-center mb-4">Solicitudes de renta</h2>
          <div className="row justify-content-center">
            {currentSolicitudes.map((solicitud, index) => (
              <div key={index} className={`col-md-6 mb-4 ${solicitud.activo === 0 || solicitud.activo_usuario === 1 ? 'inactive' : ''}`}>
                <div className="card shadow" style={{ width: '100%', height: '100%' }}>
                  <img
                    src={`http://localhost:3031/images/${solicitud.foto}`}
                    alt="Imagen del Inmueble"
                    className="card-img-top"
                    style={{ width: '100%', height: '50%', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{solicitud.titulo}</h5>
                    <p className="card-text">Dirección: {solicitud.direccion}</p>
                    <p className="card-text">Solicitud por: {solicitud.nombre} {solicitud.primer_apellido} {solicitud.segundo_apellido}</p>
                    <button
                        className="btn btn-secondary"
                        style={{ backgroundColor: '#beaf87', color: 'black' }}
                        onClick={() => navigate(`/trato/${solicitud.id_usuario}/${solicitud.id_inmueble}/${solicitud.idSolicitante}`)}
                        >
                        Consultar
                    </button>
                    {/* Otros detalles */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {[...Array(Math.ceil(registeredProperties.length / itemsPerPage)).keys()].map(number => (
              <button key={number} onClick={() => handleChangePageRight(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Rentados() {
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

export default Rentados