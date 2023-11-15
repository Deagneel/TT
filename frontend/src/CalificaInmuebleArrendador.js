import React, { useState } from 'react';
import axios from 'axios';

const CalificaInmuebleArrendador = () => {
  const [fachada, setFachada] = useState(0);
  const [servicios, setServicios] = useState(0);
  const [seguridad, setSeguridad] = useState(0);
  const [trato, setTrato] = useState(0);

  const handleRating = (aspect, stars) => {
    switch (aspect) {
      case 'fachada':
        setFachada(stars);
        break;
      case 'servicios':
        setServicios(stars);
        break;
      case 'seguridad':
        setSeguridad(stars);
        break;
      case 'trato':
        setTrato(stars);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const data = {
      fachada,
      servicios,
      seguridad,
      trato,
    };

    axios.post('URL_API', data)
      .then(response => {
        console.log('Reseñas enviadas:', response.data);
        // Puedes realizar acciones adicionales aquí si es necesario
      })
      .catch(error => {
        console.error('Error al enviar las reseñas:', error);
      });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0 }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', flex: 1 }}>
        <h2>Reseñas</h2>
        <div>
          <p>Condiciones de la fachada:</p>
          <StarsRating aspect="fachada" onChange={handleRating} />
        </div>
        <div>
          <p>Eficiencia de los servicios básicos:</p>
          <StarsRating aspect="servicios" onChange={handleRating} />
        </div>
        <div>
          <p>Seguridad de la zona del inmueble:</p>
          <StarsRating aspect="seguridad" onChange={handleRating} />
        </div>
        <div>
          <p>Trato brindado por el arrendador:</p>
          <StarsRating aspect="trato" onChange={handleRating} />
        </div>
        <button style={{ backgroundColor: '#dcd9e7', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer' }} onClick={handleSubmit}>
          Enviar
        </button>
      </div>
      <div style={{ backgroundColor: '#dcd9e7', padding: '20px', flex: 2 }}>
        <div>
          <h2>Nombre del Inmueble</h2>
          <img src="ruta-de-la-imagen-inmueble" alt="Inmueble" />
        </div>
        <div>
          <h2>Nombre del Arrendador</h2>
          <img src="ruta-de-la-imagen-arrendador" alt="Arrendador" />
        </div>
      </div>
    </div>
  );
};

const StarsRating = ({ aspect, onChange }) => {
  const [stars, setStars] = useState(0);

  return (
    <div className="stars-rating" style={{ cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`fa fa-star${star <= stars ? ' checked' : ''}`}
          onClick={() => {
            setStars(star);
            onChange(aspect, star);
          }}
        ></span>
      ))}
    </div>
  );
};

export default CalificaInmuebleArrendador;
