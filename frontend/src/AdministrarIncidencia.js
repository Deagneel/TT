import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleBackClick = () => {
    navigate('/homeadministrador');
  };
  const toggleMenu = () => setMenuOpen(!menuOpen);

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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className={`navbar-toggler ${menuOpen ? '' : 'collapsed'}`}
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'} d-lg-flex justify-content-between w-100`} id="navbarNav">
        <button className="btn btn-outline-light me-3" onClick={handleBackClick}>
          Regresar
        </button>
        </div>
      </div>
    </nav>
  );
  
}

function PageContent() {
  const navigate = useNavigate();
  const [userNoReports, setUserNoReports] = useState(0);
  const [reporte, setReporte] = useState(null);
  const { id_reporte } = useParams();
  const estadosReporte = {
    0: "Pendiente",
    1: "En revisión",
    2: "Resuelto",
    3: "Cerrado"
  };

  

  useEffect(() => {
    axios.get(`http://localhost:3031/obtenerReporteesp/${id_reporte}`)
      .then(response => {
        setReporte(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el reporte:', error);
      });
  }, [id_reporte]);

  useEffect(() => {
    const obtenerInformacionAdicional = async () => {
      if (reporte) {
        try {
          const [usuario, inmueble] = await Promise.all([
            obtenerNombreUsuario(reporte.id_usuario),
            obtenerTituloInmueble(reporte.id_inmueble)
          ]);
          const reporteConInfoAdicional = { ...reporte, usuario, inmueble };
          setReporte(reporteConInfoAdicional);
        } catch (error) {
          console.error('Error al obtener información adicional:', error);
        }
      }
    };

    obtenerInformacionAdicional();
  }, [reporte]);

  useEffect(() => {
    const obtenerNoReportesUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:3031/obtenerNoReportesUsuario/${reporte?.id_usuario}`);
        setUserNoReports(response.data);
      } catch (error) {
        console.error('Error al obtener el número de reportes del usuario:', error);
      }
    };
  
    obtenerNoReportesUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reporte?.id_usuario]); // Suprimir la advertencia con eslint-disable-next-line
  

  const obtenerNombreUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3031/obtenerNombreUsuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      return 'Usuario no encontrado';
    }
  };

  const obtenerTituloInmueble = async (idInmueble) => {
    try {
      const response = await axios.get(`http://localhost:3031/obtenerTituloInmueble/${idInmueble}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el título del inmueble:', error);
      return 'Inmueble no encontrado';
    }
  };

  if (!reporte) {
    return <p>El reporte no se ha encontrado.</p>;
  }

  const handlePausa = async () => {
    try {
      const estadoActivo = reporte.inmueble.activo; // Almacena el valor en una variable auxiliar
  
      if (estadoActivo === 1) {
        // Si activo es 1, cambiar a 0
        await axios.put(`http://localhost:3031/pausarInmueble/${reporte.id_inmueble}`, { activo: 0 });
        swal("Publicación Pausada Correctamente", "", "success");
      } else if (estadoActivo === 0) {
        // Si activo es 0, cambiar a 1
        await axios.put(`http://localhost:3031/pausarInmueble/${reporte.id_inmueble}`, { activo: 1 });
        swal("Publicación Activada Correctamente", "", "success");
      }
    } catch (error) {
      console.error('Error al cambiar el estado de la publicación del inmueble:', error);
    }
  };

  const handleRevision = async (idReporte) => {
    try {
      const willResolve = await swal({
        title: "¿Estás seguro de comenzar la revisión?",
        text: "Una vez iniciado será marcado como en revisión.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
  
      if (willResolve) {
        await axios.put(`http://localhost:3031/actualizarEstadoReporte/${idReporte}`, { estado: 1 });
        swal("Se cambió el estado del reporte.", " ", "success");
        navigate('/homeadministrador');
      } else {
        swal("Operación Cancelada");
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };
  
  const handleSolucionado = async (idReporte) => {
    try {
      const willResolve = await swal({
        title: "¿Estás seguro de resolver el reporte?",
        text: "Una vez resuelto no se podrá cambiar.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
  
      if (willResolve) {
        await axios.put(`http://localhost:3031/actualizarEstadoReporte/${idReporte}`, { estado: 2 });
        swal("Se cambió el estado del reporte.", " ", "success");
        navigate('/homeadministrador');
      } else {
        swal("Operación Cancelada");
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };
  
  const handleCerrar = async (idReporte) => {
    try {
      const willResolve = await swal({
        title: "¿Estás seguro de cerrar el reporte?",
        text: "Una vez cerrado no se podrá cambiar.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
  
      if (willResolve) {
        // Actualizar el estado del reporte
        await axios.put(`http://localhost:3031/actualizarEstadoReporte/${idReporte}`, { estado: 3 });
  
        // Incrementar el conteo de reportes del usuario
        await axios.put(`http://localhost:3031/incrementarReportesUsuario/${reporte.id_usuario}`);
  
        swal("Se cambió el estado del reporte.", " ", "success");
        navigate('/homeadministrador');
      } else {
        swal("Operación Cancelada");
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };
  
  
  const handleContactar = async () => {
    axios.post(`http://localhost:3031/newchat/${reporte.id_inmueble}`)
      .then(async (response) => {
        // Puedes hacer algo con la respuesta si es necesario
        console.log('Petición completada con éxito:', response);

        await navigate('/correoobtencion');
      })
      .catch((error) => {
        console.error('Error al obtener datos del inmueble', error);
      });
  };

  return (
    <div className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10 col-sm-12">
        <div className="bg-light p-4 rounded mt-5 shadow">
          <div className="row">
              <div className="col">
                <h3>Folio del reporte: {reporte.id_reporte}</h3>
              </div>
              <div className="col text-end">
                <p className="mb-0">Cantidad de reportes aociados: {userNoReports}</p>
              </div>
            </div>
          <p>Asunto: {reporte.asunto}</p>
          <div className="bg-secondary text-light p-3 rounded mb-3">
            <p>{reporte.descripción}</p>
            <p>Fecha del reporte: {reporte.fecha.split('T')[0]}</p>
          </div>
          <div>
              {reporte.usuario && reporte.usuario.nombre && reporte.usuario.primer_apellido && reporte.usuario.segundo_apellido &&
                <p>Usuario reportado: {reporte.usuario.nombre} {reporte.usuario.primer_apellido} {reporte.usuario.segundo_apellido}</p>
              }
            <p>ID del usuario: {reporte.id_usuario}</p>
          </div>
          {reporte.id_inmueble !== 21 && reporte.inmueble && (
            <div>
              <p>Inmueble reportado: {reporte.inmueble.titulo}</p>
              <p>ID del inmueble: {reporte.id_inmueble}</p>
            </div>
          )}
          <div className="d-flex mt-4">
            <button className="btn btn-secondary me-auto" onClick={handleContactar}>
              Contactar al usuario
            </button>
            {reporte.id_inmueble !== 21 && reporte.inmueble && (
              <button
                className="btn btn-secondary me-3"
                onClick={handlePausa}
              >
                {reporte.inmueble.activo === 1 ? "Pausar Publicación" : "Activar Publicación"}
              </button>
            )}
          </div>
          <div className="d-flex mt-4">
            <h5>Estado del reporte: {estadosReporte[reporte.estado]}</h5>
          </div>
          <div className="card-footer">
              {reporte.estado === 0 && (
                <div className="d-flex justify-content-around">
                  <button className="btn btn-warning" onClick={() => handleRevision(reporte.id_reporte)}>
                    En revisión
                  </button>
                </div>
              )}
              {reporte.estado === 1 && (
                <div className="d-flex justify-content-around">
                  <button className="btn btn-success" onClick={() => handleSolucionado(reporte.id_reporte)}>
                    Resuelto
                  </button>
                  <button className="btn btn-danger" onClick={() => handleCerrar(reporte.id_reporte)}>
                    Cerrar
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}


function AdministrarIncidencia() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <PageContent />
    </div>
  );
}

export default AdministrarIncidencia;
