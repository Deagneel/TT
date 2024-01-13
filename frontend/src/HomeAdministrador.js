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
            <a className="nav-link btn btn-link w-100" onClick={() => handleNavigation('/signup')}>
              Registrar Usuario
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link btn btn-link w-100" onClick={() => handleNavigation('/correoobtencion')}>
              Chats
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link btn btn-link w-100" onClick={handleLogoutClick}>
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
  const [filtro, setFiltro] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 6;

  useEffect(() => {
    axios.get('http://localhost:3031/obtenerReportes')
      .then(response => {
        setReportes(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los reportes:', error);
      });
  }, []);

  const handleGestionarIncidencia = (reporteId) => {
    navigate(`/administrarincidencia/${reporteId}`);
  };

  const filtrarReportes = (estado) => {
    setFiltro(estado);
  };
  
  const handleSearch = () => {
    setBusqueda(searchParam); // Actualiza el estado de búsqueda cuando se presiona el botón
  };

  const reportesFiltrados = reportes
  .filter(reporte => filtro === null || reporte.estado === filtro)
  .filter(reporte => busqueda === '' || reporte.id_reporte.toString().includes(busqueda));

  const numeroDePaginas = Math.ceil(reportesFiltrados.length / reportesPorPagina);

  // Obtiene los reportes para la página actual
  const indiceDelUltimoReporte = paginaActual * reportesPorPagina;
  const indiceDelPrimerReporte = indiceDelUltimoReporte - reportesPorPagina;
  const reportesActuales = reportesFiltrados.slice(indiceDelPrimerReporte, indiceDelUltimoReporte);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };


  return (
    <div className="container-fluid" style={{ backgroundColor: '#EFEFEF', padding: '20px', textAlign: 'center' }}>
      <div className="row mb-3">
        <h2>Reportes</h2>
        <div className="col-9">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar reporte por id..." 
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

      <div className="row mb-3">
        <button className={`col-md-3 col-12 btn btn-danger ${filtro === 0 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(0)}>Pendientes</button>
        <button className={`col-md-3 col-12 btn btn-warning ${filtro === 1 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(1)}>En revisión</button>
        <button className={`col-md-3 col-12 btn btn-success ${filtro === 2 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(2)}>Resuelto</button>
        <button className={`col-md-3 col-12 btn btn-secondary ${filtro === 3 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(3)}>Cerrado</button>
      </div>
      <div className="row">
        {reportesActuales.map(reporte => (
          <div key={reporte.id_reporte} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100" style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px' }}>
              <span className='subtitles-general'>Folio del reporte: {reporte.id_reporte}&nbsp;&nbsp;</span>
              <span className='subtitles-general'>{reporte.asunto}</span>
              <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
              <button className="btn btn-secondary" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
                {reporte.estado === 2 || reporte.estado === 3 ? 'Consultar Incidencia' : 'Gestionar Incidencia'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {[...Array(numeroDePaginas).keys()].map(numero => (
          <button 
            key={numero + 1} 
            onClick={() => cambiarPagina(numero + 1)}
            className={`page-item ${paginaActual === numero + 1 ? 'active' : ''}`}
          >
            {numero + 1}
          </button>
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
  const [filtro, setFiltro] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 6;

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

  const filtrarReportes = (estado) => {
    setFiltro(estado);
  };

  const reportesFiltrados = userReports.filter(reporte => reporte.estado === filtro);

  const handleInteresClick = async (idInmueble) => {
    try {
        console.log('Clic en el sobre');
        axios.post(`http://localhost:3031/newchat/${idInmueble}`)
        .then(async (response) => {
            console.log('Petición completada con éxito:', response);
            await swal('Chat Creado');
            await navigate('/correoobtencion');
        })
        .catch((error) => {
            console.error('Error al crear el chat', error);
        });
    } catch (error) {
        console.error('Error al crear el chat', error);
    }
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

  const numeroDePaginas = Math.ceil(reportesFiltrados.length / reportesPorPagina);

  // Obtiene los reportes para la página actual
  const indiceDelUltimoReporte = paginaActual * reportesPorPagina;
  const indiceDelPrimerReporte = indiceDelUltimoReporte - reportesPorPagina;
  const reportesActuales = reportesFiltrados.slice(indiceDelPrimerReporte, indiceDelUltimoReporte);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="container-fluid" style={{ flex: 1, backgroundColor: '#F9F9F9', padding: '20px', textAlign: 'center' }}>
      <h2>Usuarios</h2>
      {/* Barra de búsqueda */}
      <div className="row mb-3">
        <div className="col-9">
          <input type="text" className="form-control" placeholder="Buscar por ID de usuario..." value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
        <div className="col-3">
          <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      
      <div className="row mb-3">
        {/* Botones de filtro aquí */}
        <button className={`col-3 btn btn-danger ${filtro === 0 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(0)}>Pendientes</button>
        <button className={`col-3 btn btn-warning ${filtro === 1 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(1)}>En revisión</button>
        <button className={`col-3 btn btn-success ${filtro === 2 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(2)}>Resuelto</button>
        <button className={`col-3 btn btn-secondary ${filtro === 3 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(3)}>Cerrado</button>
      </div>

      {/* Listado de reportes asociados al usuario */}
      <div className="row">
        {reportesActuales.map(reporte => (
            <div key={reporte.id_reporte} className="col-lg-4 col-md-6 mb-4">
              <div className="card" style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
                {/* Contenido del usuario */}
                <h4>{reporte.nombre_usuario} {reporte.p_apellido} {reporte.s_apellido} ID: {reporte.id_usuario}</h4>
                <span className= 'subtitles-general'>Reportes asociados: {reporte.asociados}</span>
                <span className='subtitles-general'>Folio del reporte: {reporte.id_reporte}&nbsp;&nbsp;</span>
                <span className='subtitles-general'>{reporte.asunto}</span>
                <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
                <button className="btn btn-secondary" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
                {reporte.estado === 2 || reporte.estado === 3 ? 'Consultar Incidencia' : 'Gestionar Incidencia'}
                </button>
                {/* Botones debajo del último botón "Gestionar Incidencia" */}
                <div className="mt-3">
                  <button onClick={() => handleEliminarIncidencia(reporte.id_usuario)} className="btn btn-danger" style={{ marginRight: '10px' }}>
                    Eliminar Usuario
                  </button>
                  <button className="btn btn-success" onClick={() => handleInteresClick(reporte.id_inmueble)}>Mensaje</button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="pagination">
        {[...Array(numeroDePaginas).keys()].map(numero => (
          <button 
            key={numero + 1} 
            onClick={() => cambiarPagina(numero + 1)}
            className={`page-item ${paginaActual === numero + 1 ? 'active' : ''}`}
          >
            {numero + 1}
          </button>
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
  const [filtro, setFiltro] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 6;

  const filtrarReportes = (estado) => {
    setFiltro(estado);
  };

  const reportesFiltrados = userReports.filter(reporte => reporte.estado === filtro);

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

  const handleInteresClick = async (idInmueble) => {
    try {
        console.log('Clic en el sobre');
        axios.post(`http://localhost:3031/newchat/${idInmueble}`)
        .then(async (response) => {
            console.log('Petición completada con éxito:', response);
            await swal('Chat Creado');
            await navigate('/correoobtencion');
        })
        .catch((error) => {
            console.error('Error al crear el chat', error);
        });
    } catch (error) {
        console.error('Error al crear el chat', error);
    }
  };

  const numeroDePaginas = Math.ceil(reportesFiltrados.length / reportesPorPagina);

  // Obtiene los reportes para la página actual
  const indiceDelUltimoReporte = paginaActual * reportesPorPagina;
  const indiceDelPrimerReporte = indiceDelUltimoReporte - reportesPorPagina;
  const reportesActuales = reportesFiltrados.slice(indiceDelPrimerReporte, indiceDelUltimoReporte);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
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
            placeholder="Buscar por ID de inmueble..." 
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

      <div className="row mb-3">
        {/* Botones de filtro aquí */}
        <button className={`col-3 btn btn-danger ${filtro === 0 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(0)}>Pendientes</button>
        <button className={`col-3 btn btn-warning ${filtro === 1 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(1)}>En revisión</button>
        <button className={`col-3 btn btn-success ${filtro === 2 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(2)}>Resuelto</button>
        <button className={`col-3 btn btn-secondary ${filtro === 3 ? 'active-btn' : ''}`} onClick={() => filtrarReportes(3)}>Cerrado</button>
      </div>

      <div className="row">
      {reportesActuales.map(reporte => (
          <div key={reporte.id_reporte} className="col-lg-4 col-md-6 mb-4">
            <div className="card" style={{ backgroundColor: '#D8BFD8', padding: '10px', margin: '10px', position: 'relative' }}>
              {/* Contenido del inmueble */}
              <h4>{reporte.nombre_inmueble}  ID: {reporte.id_inmueble}</h4>
              <span className='subtitles-general'>Folio del reporte: {reporte.id_reporte}&nbsp;&nbsp;</span>
              <span className='subtitles-general'>{reporte.asunto}</span>
              <p>{reporte.descripción.length > 96 ? `${reporte.descripción.substring(0, 96)}...` : reporte.descripción}</p>
              <button className="btn btn-secondary" onClick={() => handleGestionarIncidencia(reporte.id_reporte)}>
              {reporte.estado === 2 || reporte.estado === 3 ? 'Consultar Incidencia' : 'Gestionar Incidencia'}
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
                <button className="btn btn-success" onClick={() => handleInteresClick(reporte.id_inmueble)}>Mensaje</button>
              </div>
            </div>
          </div>
        ))}
        </div>
        <div className="pagination">
        {[...Array(numeroDePaginas).keys()].map(numero => (
          <button 
            key={numero + 1} 
            onClick={() => cambiarPagina(numero + 1)}
            className={`page-item ${paginaActual === numero + 1 ? 'active' : ''}`}
          >
            {numero + 1}
          </button>
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
