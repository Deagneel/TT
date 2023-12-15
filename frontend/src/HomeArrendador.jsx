import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar la hoja de estilos de Bootstrap

function ArrendadorNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRegistrarInmueble = async () => {
    try {
      const perfilCompletadoResponse = await axios.get('https://apirest-408205.uc.r.appspot.com/perfilCompletado');
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
        navigate('/chat');
  };
  

  const handleLogoutClick = () => {
    axios
      .get('https://apirest-408205.uc.r.appspot.com/logout')
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
          <li className="nav-item active">
             <a className="nav-link btn btn-link w-100" href="#" onClick={handleRegistrarInmueble}>
              Registrar Inmueble
            </a>
          </li>
          <li className="nav-item">
              <a className="nav-link btn btn-link w-100" href="#" onClick={handleVerPerfil}>
              Perfil
            </a>
          </li>
          <li className="nav-item">
              <a className="nav-link btn btn-link w-100" href="#" onClick={handleChats}>
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
  
  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('https://apirest-408205.uc.r.appspot.com')
    .then(res => {
      if(res.data.valid) {
      } else {
        swal('Necesitas iniciar sesión para acceder a esta función');
        navigate('/login');
      }
    })
  })
  
  useEffect(() => {
    axios.get('https://apirest-408205.uc.r.appspot.com/inmuebles')
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
            <div className="card shadow" style={{ width: '100%', height: '100%' }}>
              <img
                src={`https://apirest-408205.uc.r.appspot.com/images/${property.foto}`}
                alt="Imagen"
                className="card-img-top"
                style={{ width: '100%', height: '50%', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{property.titulo}</h5>
                <p className="card-text">Dirección: {property.direccion}</p>
                <p className="card-text">Precio: {property.precio}</p>
                <button
                  className="btn btn-secondary"
                  style={{ backgroundColor: '#beaf87', color: 'black' }}
                  onClick={() => handleEditClick(property.id_inmueble)}
                >
                  Editar
                </button>
                {/* Agrega otros detalles de propiedad según sea necesario */}
              </div>
              {property.activo === 0 && <p className="inactiveText">Inactivo por administrador</p>}
              {property.activo_usuario === 1 && <p className="inactiveText">Pausado</p>}
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
    axios.get('https://apirest-408205.uc.r.appspot.com')
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