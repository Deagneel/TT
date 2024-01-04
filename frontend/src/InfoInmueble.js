import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faExclamationTriangle, faHouse, faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function Navbar({ handleSearchTerm }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (path, message) => {
    navigate(path);
    if (message) console.log(message);
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

  const handleLogoutClick = async () => {
    try {
      const res = await axios.get('http://localhost:3031/logout');
      if (res.data.Status === 'Success') {
        swal('Sesión Cerrada Correctamente', ' ', 'success');
        navigate('/login');
      } else {
        alert('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
              <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'} justify-content-center w-100`} id="navbarNav">
              <ul className="navbar-nav w-100 justify-content-around">
                  <li className="nav-item">
                      <button type="button" className="nav-link btn btn-link" onClick={() => window.history.back()}>Volver</button>
                  </li>
                  <li className="nav-item">
                      <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/perfilarrendatario')}>Perfil</button>
                  </li>
                  <li className="nav-item">
                      <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/correoobtencion', 'Clic en el sobre')}>Chats</button>
                  </li>
                  <li className="nav-item">
                      <button type="button" className="nav-link btn btn-link" onClick={handleLogoutClick}>Cerrar sesión</button>
                  </li>
              </ul>
          </div>
      </nav>
  );

  
}
function InfoInmueble() {
  let tipoVivienda; //Auxiliar tipo de vivienda
  const navigate = useNavigate();
  const [registeredProperties, setRegisteredProperties] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idInmueble = searchParams.get('id_inmueble');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [comportamiento, setComportamiento] = useState(null);
  const [contadorEvaluaciones, setContadorEvaluaciones] = useState(null);

  

  const handleInteresClick = async () => {
  try {
    // Realiza la consulta para obtener el valor de perfil_completado del usuario
    const perfilCompletadoResponse = await axios.get('http://localhost:3031/perfilCompletado');
    const perfilCompletado = perfilCompletadoResponse.data.perfilCompletado;

    if (perfilCompletado == 0) {
      // Si perfil_completado es 0, muestra un mensaje y no ejecuta el código
      await swal('Primero debes completar la documentación de tu perfil');
    } else {
      // Si perfil_completado no es 0, continúa con la lógica actual
      console.log('Clic en el sobre');
      axios.post(`http://localhost:3031/newchat/${idInmueble}`)
      .then(async (response) => {
        console.log('Petición completada con éxito:', response);
        await swal('Chat Creado');
        await navigate('/correoobtencion');
      })
      .catch((error) => {
        console.error('Error al obtener datos del inmueble', error);
      });

    }
  } catch (error) {
    console.error('Error al obtener datos del inmueble', error);
  }
  };



const handleReportClick = (idUsuario, idInmueble) => {
  // Se activa al presionar el botón Reportar
  navigate(`/incidencia/${idUsuario}/${idInmueble}`);
};


const handleTrato = async (idUsuario, idInmueble, tituloinmu) => {
  try {
    // Realizar la consulta para obtener el valor de perfil_completado del usuario
    const perfilCompletadoResponse = await axios.get('http://localhost:3031/perfilCompletado');
    const perfilCompletado = perfilCompletadoResponse.data.perfilCompletado;

    if (perfilCompletado == 0) {
      // Mostrar mensaje si perfil_completado es 0
      await swal('Primero debes completar la documentación de tu perfil');
    } else {
      const solicitudExistenteResponse = await axios.get(`http://localhost:3031/verificarSolicitud?idInmueble=${idInmueble}`);
    const solicitudExistente = solicitudExistenteResponse.data.solicitudExistente;

    if (solicitudExistente) {
        // Informar al usuario que ya existe una solicitud para ese inmueble
        await swal('No puedes hacer más de una solicitud de trato al mismo inmueble por ahora.' , '', 'error');
    } else {
      console.log(correoUsuario);
      const willDoTrato = await swal({
        title: "¿Quieres mandar una solicitud para concretar un trato?",
        text: "Enviaremos tu solicitud al arrendador.",
        icon: "info",
        buttons: true,
        dangerMode: false,
      });

      // Si el usuario confirma
      if (willDoTrato) {
        // Mostrar SweetAlert2 de éxito
        await axios.post(`http://localhost:3031/rentar/${idInmueble}`);
        swal("Tu solicitud se ha enviado.", {
          icon: "success",
        });

        await axios.post(`http://localhost:3031/enviarCorreoArrendador`, {
          idUsuario,
          idInmueble,
          correoUsuario,
          tituloinmu,
        });
      } else {
        // Mostrar SweetAlert2 de cancelación
        swal("Operación Cancelada");
      }
    }
  }
  } catch (error) {
    console.error('Error al realizar el trato:', error);
  }
};

  const handleRegresarClick = () => {
    //Se activa al presionar el boton regresar
    navigate('/homearrendatario');
  };

  useEffect(() => {
    axios.get(`http://localhost:3031/obtenerInmuebleInfo/${idInmueble}`)
      .then((response) => {
        setRegisteredProperties(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos del inmueble', error);
      });
  }, [idInmueble]);

  if(registeredProperties.map(property => property.tipo_de_habitacion) == 0){
    tipoVivienda = 'Individual';
  }else{
    tipoVivienda = 'Compartida';
  }

  useEffect(() => {
    axios.get(`http://localhost:3031/obtenerInmuebleInfo/${idInmueble}`)
      .then((response) => {
        setRegisteredProperties(response.data);
  
        // Obtener el correo del usuario y almacenarlo en un estado
        const idUsuario = response.data[0].id_usuario;
        axios.get(`http://localhost:3031/obtenerCorreoUsuario/${idUsuario}`)
          .then((correoResponse) => {
            const correoUsuario = correoResponse.data[0].correo;
            setCorreoUsuario(correoUsuario); // Guardar el correo del usuario en un estado
          })
          .catch((error) => {
            console.error('Error al obtener el correo del usuario:', error);
          });
  
        // Aquí se añade la nueva consulta para obtener comportamiento y contador_evaluaciones
        axios.get(`http://localhost:3031/obtenerDatosUsuario/${idUsuario}`)
          .then((datosUsuarioResponse) => {
            const datosUsuario = datosUsuarioResponse.data;
            // Actualizar el estado o manejar los datos como prefieras
            setComportamiento(datosUsuario.comportamiento);
            setContadorEvaluaciones(datosUsuario.contador_evaluaciones);
          })
          .catch((error) => {
            console.error('Error al obtener datos del usuario:', error);
          });
  
      })
      .catch((error) => {
        console.error('Error al obtener datos del inmueble', error);
      });
  }, [idInmueble]); // Dependencia idInmueble
  

  return (
    <div className="app-container text-center bg-dark">
      <Navbar />
      {registeredProperties.map((property, index) => (
      <div key={index} className="bg-light mx-auto p-2 rounded col-12 col-md-6">

          <div className="align-center mb-4">
            <h2 className="font-weight-bold">{property.titulo}</h2>
          </div>
  
          {/* Carrusel de imágenes */}
          <div className="border mb-4" style={{ width: '80%', height: '50%', margin: '0 auto' }}>
            <img src={`http://localhost:3031/images/${property.foto}`} alt="Imagen" className="img-fluid" />
          </div>

  
          {/* Detalles del departamento */}
          <div className="mb-4">
            {/* Calificaciones */}
            <h3 className="font-weight-bold">Calificaciones Obtenidas:</h3>
            <div className="col mb-3">
              <h5 className="font-weight-bold">
                  Condiciones: 
                  {property.contador_evaluaciones 
                      ? ((property.condiciones / property.contador_evaluaciones).toFixed(1) + " de 5")
                      : "Sin evaluaciones aún"}
                  <FontAwesomeIcon icon={faStar} />
              </h5>
            </div>

            <div className="col mb-3">
              <h5 className="font-weight-bold">
                  Servicios: 
                  {property.contador_evaluaciones 
                      ? ((property.servicios / property.contador_evaluaciones).toFixed(1) + " de 5")
                      : " Sin evaluaciones aún"}
                  <FontAwesomeIcon icon={faStar} />
              </h5>
            </div>

            <div className="col mb-3">
              <h5 className="font-weight-bold">
                  Seguridad: 
                  {property.contador_evaluaciones 
                      ? ((property.seguridad / property.contador_evaluaciones).toFixed(1) + " de 5")
                      : " Sin evaluaciones aún"}
                  <FontAwesomeIcon icon={faStar} />
              </h5>
            </div>

            <div className="col mb-5">
              <h5 className="font-weight-bold">
                  Trato brindado por el arrendador: 
                  {contadorEvaluaciones  
                      ? ((comportamiento  / contadorEvaluaciones).toFixed(1) + " de 5")
                      : " Sin evaluaciones aún"}
                  <FontAwesomeIcon icon={faStar} />
              </h5>
            </div>

            <h3 className="mb-3 font-weight-bold">Información de Inmueble:</h3>
            
            {/* Dirección */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Dirección: {property.direccion}</h5>
            </div>

            {/* Asentamientos */}
            <div className="mb-3">
              <h5 className="font-weight-bold">{property.asentamiento} &nbsp; &nbsp; &nbsp; Código postal: {property.cp}</h5>
            </div>

            {/* Alcaldía */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Alcaldía: {property.alcaldia}</h5>
              <br/>
            </div>

            {/* Precio */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Precio: ${property.precio}</h5>
            </div>

            {/* Periodo del contrato */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Periodo del contrato: {property.periodo_de_renta}</h5>
            </div>

            {/* Tipo de vivienda */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Tipo de vivienda: {tipoVivienda}</h5>
            </div>

            {/* Número de cuartos */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Número de habitaciones: {property.no_habitaciones}</h5>
              <br/>
            </div>

            {/* Reglamento */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Reglamento:</h5>
              <div className="reglamento-content" style={{ marginTop: '10px', marginLeft: '20px', textAlign: 'justify' }}>
                {property.reglamento.split('\n').map((line, index) => (
                  <p key={index} style={{ marginBottom: '5px' }}>
                    {line}
                  </p>
                ))}
              </div>
              <br/>
            </div>


            {/* Características */}
            
            <h5 className="font-weight-bold">Características:</h5>
            <div className="caracteristicas-content" style={{ marginTop: '10px', marginLeft: '20px', textAlign: 'justify' }}>
              {property.caracteristicas.split('\n').map((line, index) => (
                <p key={index} style={{ marginBottom: '5px' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          

          <div className="mb-4 justify-content-center">
            {/* Botón "Me interesa" */}
            <div className="mb-3">
              <button className="btn btn-secondary"
                  style={{ backgroundColor: '#beaf87', color: 'black' }} onClick={handleInteresClick}>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" /> Me interesa
              </button>
            </div>

            {/* Botón "Reportar" */}
            <div className="mb-3">
              <button onClick={() => handleReportClick(property.id_usuario, property.id_inmueble)} className="btn btn-secondary"
                  style={{ backgroundColor: '#beaf87', color: 'black' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
              </button>
            </div>

            {/* Botón "Trato" */}
            <div className="mb-3">
              <button onClick={() => handleTrato(property.id_usuario, property.id_inmueble, property.titulo)} className="btn btn-secondary"
                  style={{ backgroundColor: '#beaf87', color: 'black' }}> 
                <FontAwesomeIcon icon={faHouse} className="me-2" /> Hacer Trato
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

}


export default InfoInmueble
