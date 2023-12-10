import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    console.log(`Navegando a ${path}`);
    navigate(path);
  };

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

  const handleIconClick = (icon) => {
    console.log(`Clic en el icono ${icon}`);
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
            <a className="nav-link btn btn-link w-100" href="#" onClick={() => handleNavigation('/signup')}>
              Registrar Usuario
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link btn btn-link w-100" href="#" onClick={() => handleNavigation('/chat')}>
              Chats
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link btn btn-link w-100" href="#" onClick={handleLogoutClick}>
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
  
  
}

function ReportesSection() {
  const navigate = useNavigate();
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
    navigate(`/administrarincidencia/${reporteId}`);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <h2>Reportes</h2>
      <div className="row">
        {reportes.map(reporte => (
            <div key={reporte.id_reporte} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100" style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px' }}>
                {/* Contenido del reporte */}
                <span className='subtitles-general'>Folio del reporte: {reporte.id_reporte}&nbsp;&nbsp;</span>
                <span className='subtitles-general'>{reporte.asunto}</span>
                <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
                <button className="btn btn-secondary" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
                  Gestionar Incidencia
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// UsuariosSection
function UsuariosSection() {
  const navigate = useNavigate();
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
    navigate(`/administrarincidencia/${reporteId}`);
  };

  const handleEliminarIncidencia = async (repoId) => {
    try {
      // Mostrar SweetAlert2 de confirmación
      const willDelete = await swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no se podrá recuperar el usuario.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      // Si el usuario confirma la eliminación
      if (willDelete) {
        // Realizar la solicitud al servidor para eliminar el usuario
        await axios.delete(`http://localhost:3031/eliminarUsuario/${repoId}`);
        // Mostrar SweetAlert2 de éxito
        swal("Usuario Borrado del Sistema", {
          icon: "success",
        });
        // Recargar la página
        window.location.reload();
      } else {
        // Mostrar SweetAlert2 de cancelación
        swal("Operación Cancelada");
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <div className="container-fluid" style={{ flex: 1, backgroundColor: '#F9F9F9', padding: '20px', textAlign: 'center' }}>
      <h2>Usuarios</h2>
      {/* Barra de búsqueda */}
      <div className="row mb-3">
        <div className="col-9">
          <input type="text" className="form-control" placeholder="Buscar por ID de reporte..." value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
        <div className="col-3">
          <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      {/* Listado de reportes asociados al usuario */}
      <div className="row">
        {userReports.map(reporte => (
            <div key={reporte.id_reporte} className="col-lg-4 col-md-6 mb-4">
              <div className="card" style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
                {/* Contenido del usuario */}
                <h4>{reporte.nombre_usuario} {reporte.p_apellido} {reporte.s_apellido} ID: {reporte.id_usuario}</h4>
                <span className= 'subtitles-general'>Reportes asociados: {reporte.asociados}</span>
                <span className='subtitles-general'>Folio del reporte: {reporte.id_reporte}&nbsp;&nbsp;</span>
                <span className='subtitles-general'>{reporte.asunto}</span>
                <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
                <button className="btn btn-secondary" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
                  Gestionar Incidencia
                </button>
                {/* Botones debajo del último botón "Gestionar Incidencia" */}
                <div className="mt-3">
                  <button onClick={() => handleEliminarIncidencia(reporte.id_usuario)} className="btn btn-danger" style={{ marginRight: '10px' }}>
                    Eliminar Usuario
                  </button>
                  <button className="btn btn-success">Mensaje</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// InmueblesSection
function InmueblesSection() {
  const navigate = useNavigate();
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
    navigate(`/administrarincidencia/${reporteId}`);
  };

  const handlePausa = async (IdInmueble, activo) => {
    try {
      const estadoActivo = activo;
      if (estadoActivo === 1) {
        // Si activo es 1, cambiar a 0
        await axios.put(`http://localhost:3031/pausarInmueble/${IdInmueble}`, { activo: 0 });
        swal("Publicación Pausada Correctamente", "", "success");
      } else if (estadoActivo === 0) {
        // Si activo es 0, cambiar a 1
        await axios.put(`http://localhost:3031/pausarInmueble/${IdInmueble}`, { activo: 1 });
        swal("Publicación Activada Correctamente", "", "success");
      }
      window.location.reload();
    } catch (error) {
      console.error('Error al cambiar el estado de la publicación del inmueble:', error);
    }
  };

  return (
    <div className="container-fluid" style={{ flex: 1, backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <h2>Inmuebles</h2>
      {/* Barra de búsqueda */}
      <div className="row mb-3">
        <div className="col-9">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar..." 
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
        </div>
        <div className="col-3">
          <button 
            className="btn btn-outline-secondary" 
            type="button" 
            onClick={handleSearch} 
          >
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div className="row">
      {userReports.map(reporte => (
          <div key={reporte.id_reporte} className="col-lg-4 col-md-6 mb-4">
            <div className="card" style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
              {/* Contenido del inmueble */}
              <h4>{reporte.nombre_inmueble}  ID: {reporte.id_inmueble}</h4>
              <span className='subtitles-general'>Folio del reporte: {reporte.id_reporte}&nbsp;&nbsp;</span>
              <span className='subtitles-general'>{reporte.asunto}</span>
              <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
              <button className="btn btn-secondary" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
                Gestionar Incidencia
              </button>
              {/* Botones debajo del último botón "Gestionar Incidencia" */}
              <div className="mt-3">
                <button 
                  className="btn btn-warning" 
                  style={{ marginRight: '10px' }} 
                  onClick={() => handlePausa(reporte.id_inmueble, reporte.inmueble_activo)}
                >
                  {reporte.inmueble_activo == 1 ? "Pausar Publicación" : "Activar Publicación"}
                </button>
                <button className="btn btn-success">Mensaje</button>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  );
}



function HomeAdministrador() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        <ReportesSection />
        <UsuariosSection />
        <InmueblesSection />
      </div>
    </div>
  );
}

export default HomeAdministrador;
