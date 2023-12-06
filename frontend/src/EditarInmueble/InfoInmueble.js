import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EditInmue.css';
import { faEnvelope, faExclamationTriangle, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';

function InfoInmueble() {
  let tipoVivienda; //Auxiliar tipo de vivienda
  const navigate = useNavigate();
  const [registeredProperties, setRegisteredProperties] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idInmueble = searchParams.get('id_inmueble');
  
  const handleInteresClick = () => {
    // Se activa al presionar el botón Me interesa
    console.log('Clic en el sobre');
    axios.post(`http://localhost:3031/newchat/${idInmueble}`)
      .then(async (response) => {
        // Puedes hacer algo con la respuesta si es necesario
        console.log('Petición completada con éxito:', response);

        // Navega a '/chat' solo si la petición se completa correctamente
        await navigate('/chat');
      })
      .catch((error) => {
        console.error('Error al obtener datos del inmueble', error);
      });
};


const handleReportClick = (idUsuario, idInmueble) => {
  // Se activa al presionar el botón Reportar
  navigate(`/incidencia/${idUsuario}/${idInmueble}`);
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
              <button onClick={() => handleReportClick(property.id_usuario, property.id_inmueble)} className="btn btn-primary">
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
