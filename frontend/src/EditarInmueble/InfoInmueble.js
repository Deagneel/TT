import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EditInmue.css';
import { faEnvelope, faExclamationTriangle, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function InfoInmueble() {
  let tipoVivienda; //Auxiliar tipo de vivienda
  const navigate = useNavigate();
  const [registeredProperties, setRegisteredProperties] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idInmueble = searchParams.get('id_inmueble');
  const [correoUsuario, setCorreoUsuario] = useState('');
  

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
      const response = await axios.post(`http://localhost:3031/newchat/${idInmueble}`);
      console.log('Petición completada con éxito:', response);
      await navigate('/chat');
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
      // Mostrar SweetAlert2 de confirmación
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
  
      })
      .catch((error) => {
        console.error('Error al obtener datos del inmueble', error);
      });
  }, [idInmueble]);

  return (
    <div className="app-container text-center">
      {registeredProperties.map((property, index) => (
      <div key={index} style={{ width: '50%', padding: '10px', borderRadius: '8px' }} className="bg-light mx-auto">
          <button onClick={handleRegresarClick} className="btn btn-danger close-button">X</button>

          <div className="align-center mb-4">
            <h2 className="font-weight-bold">{property.titulo}</h2>
          </div>
  
          {/* Carrusel de imágenes */}
          <div className="border mb-4" style={{ width: '80%', height: '50%', margin: '0 auto' }}>
            <img src={`http://localhost:3031/images/${property.foto}`} alt="Imagen" className="img-fluid" />
          </div>

  
          {/* Detalles del departamento */}
          <div className="mb-4">
            {/* Direccion */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Dirección</h5>
              <textarea readOnly value={property.direccion} placeholder="Ingresar reglamento" className="fondo-placeholder form-control" style={{ height: '130px' }} />
            </div>
            {/* Coordenadas */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Coordenadas</h5>
              <p className="fondo-placeholder" type="text">{property.coordenadas}</p>
            </div>
            {/* Num cuartos */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Número de cuartos</h5>
              <p className="fondo-placeholder" type="text">{property.no_habitaciones}</p>
            </div>
            {/* Precio */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Precio</h5>
              <p className="fondo-placeholder" type="text">{property.precio}</p>
            </div>
            {/* Periodo del contrato */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Periodo del contrato</h5>
              <p className="fondo-placeholder" type="text">{property.periodo_de_renta}</p>
            </div>
            {/* Tipo de habitación */}
            <div className="mb-3">
              <h5 className="font-weight-bold">Tipo de vivienda</h5>
              <p className="fondo-placeholder" type="text">{tipoVivienda}</p>
            </div>
          </div>
  
          <div className="mb-4">
            {/* Reglamento */}
            <div className="mb-3" style={{ width: '100%', margin: '0 auto' }}>
              <h5 className="mb-3 font-weight-bold">Reglamento</h5>
              <textarea readOnly value={property.reglamento} placeholder="Ingresar reglamento" className="fondo-placeholder form-control" style={{ height: '300px' }} />
            </div>
          </div>
          <div className="mb-4 d-flex justify-content-center">
            {/* Botón "Me interesa" */}
            <div className="me-3">
              <p className="mb-0 font-weight-bold">Me interesa</p>
              <button onClick={handleInteresClick} className="btn btn-primary">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              </button>
            </div>

            {/* Botón "Reportar" */}
            <div className="me-3">
              <p className="mb-0 font-weight-bold">Reportar</p>
              <button onClick={() => handleReportClick(property.id_usuario, property.id_inmueble)} className="btn btn-warning">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              </button>
            </div>

            {/* Botón "Trato" */}
            <div className="me-3">
              <p className="mb-0 font-weight-bold">Hacer Trato</p>
              <button onClick={() => handleTrato(property.id_usuario, property.id_inmueble, property.titulo)} className="btn btn-primary">
                <FontAwesomeIcon icon={faHouse} className="me-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

}


export default InfoInmueble
