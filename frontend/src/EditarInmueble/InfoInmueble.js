import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EditInmue.css';
import { faEnvelope, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
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


  const handleReportClick = () => {
    //Se activa al presionar el boton Reportar
    navigate('/incidencia');
    console.log('Clic en el sobre');
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
    <div className="app-container">
      {registeredProperties.map((property, index) => (
    <div style={{ marginLeft: '25px', marginTop: '25px'}}>
      <button onClick={handleRegresarClick} className="close-button">X</button>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' , fontWeight: 'bold'}}>Me interesa</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button onClick={handleInteresClick} className="color-icon" style={{ marginLeft:'24px' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '30px', marginRight: '10px', cursor: 'pointer' }} />
            </button>
          </div>
        </div>

        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' , fontWeight: 'bold'}}>Reportar</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button onClick={handleReportClick} className="color-icon" style={{ marginLeft:'14px' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '30px',marginRight: '10px', cursor: 'pointer' }} />
            </button>
          </div>
        </div>

        {/* Placeholder titulo */}
        <div className="align-center">
        <span className='fondo-placeholder'
          style={{fontWeight: 'bold', fontSize: '22px', maxWidth: '400px', marginLeft: '260px' }}
        >
            {property.titulo}</span>
        </div>
      </div>

      {/* Carrusel de imágenes */}
      <div style={{ marginLeft: '350px', marginTop: '1px', border: '1px solid #000', width: '550px', height: '270px', margin: '0 auto' }}>
        <img src={'http://localhost:3031/images/'+ property.foto }  alt="Imagen" style={{ width: '550px', height: '270px'}} />
      </div>

      {/* Aquí comienzan los detalles del departamento */}
      <div style={{ marginTop:'29px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
      {/* Direccion */}
      <div style={{ marginRight: '30px' }}>
          <span style={{ marginBottom: '0', fontWeight: 'bold' }}>Dirección</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <textarea readOnly value={property.direccion} placeholder="Ingresar reglamento" className='fondo-placeholder' 
          style={{fontSize: '17px', width: '460px', height: '130px', resize: 'none' }} />
          </div>
        </div>
      {/* Coordenadas */}
      <div style={{ marginRight: '45px' }}>
          <span style={{ marginBottom: '0' , fontWeight: 'bold'}}>Coordenadas</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p className='fondo-placeholder'  type="text" style={{ width: '215px', }} >{property.coordenadas}</p>
          </div>
          {/* Num cuartos */}
      <div style={{ marginRight: '5px' }}>
          <span style={{ marginBottom: '0' , fontWeight: 'bold'}}>Número de cuartos</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p  className='fondo-placeholder'  type="text" style={{ width: '40px', }} >{property.no_habitaciones}</p>
          </div>
      </div>
      </div>
      {/* Precio */}
      <div style={{ marginRight: '60px' }}>
          <span style={{ marginBottom: '0', fontWeight: 'bold' }}>Precio</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p className='fondo-placeholder'  type="text" style={{  width: '100px', }} >{property.precio}</p>
          </div>
      </div>
      {/* Periodo del contrato */}
      <div style={{ marginRight: '80px' }}>
          <span style={{ marginBottom: '0', fontWeight: 'bold' }}>Periodo del contrato</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p className='fondo-placeholder'  type="text" style={{  width: '155px', }} >{property.periodo_de_renta}</p>
          </div>
      </div>
      {/* Tipo de habitación */}
      <div>
          <span style={{ marginBottom: '0' , fontWeight: 'bold'}}>Tipo de vivienda</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p className='fondo-placeholder'  type="text" style={{  width: '125px', }} >
              {tipoVivienda}
            </p>
          </div>
      </div>
      </div>

      <div style={{ marginRight:'750px', marginTop:'29px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
          {/* Reglamento */}
          <div style={{ marginRight: '35px', width: '620px', margin: '0 auto' }}>
            <span style={{marginLeft: '290px', marginBottom: '0', fontWeight: 'bold' }}>Reglamento</span>
            <textarea readOnly value={property.reglamento} placeholder="Ingresar reglamento" className='fondo-placeholder' style={{fontSize: '17px', width: '675px', height: '500px', resize: 'none' }} />
          </div>

          <div style={{marginLeft:'200px' ,display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: 'inherit', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Luis Alberto</span>
            <span style={{ font: 'inherit', whiteSpace: 'nowrap' , fontWeight: 'bold'}}>Juan Pérez</span>
            <span style={{ font: 'inherit', whiteSpace: 'nowrap' , fontWeight: 'bold'}}>María García</span>
            <span style={{ font: 'inherit', whiteSpace: 'nowrap', fontWeight: 'bold' }}>Carlos González</span>
          </div>
      </div>
      
    </div>
     ))}
    </div>
  );
}


export default InfoInmueble
