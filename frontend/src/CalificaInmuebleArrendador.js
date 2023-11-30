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
          <label htmlFor="fachada">Condiciones de la fachada:</label>
          <StarsRating aspect="fachada" onChange={handleRating} />
        </div>
        <div>
          <label htmlFor="servicios">Eficiencia de los servicios básicos:</label>
          <StarsRating aspect="servicios" onChange={handleRating} />
        </div>
        <div>
          <label htmlFor="seguridad">Seguridad de la zona del inmueble:</label>
          <StarsRating aspect="seguridad" onChange={handleRating} />
        </div>
        <div>
          <label htmlFor="trato">Trato brindado por el arrendador:</label>
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
    <div>
      <label htmlFor={aspect}>Calificación ({aspect}):</label>
      <select
        id={aspect}
        value={stars}
        onChange={(e) => {
          const selectedStars = parseInt(e.target.value, 10);
          setStars(selectedStars);
          onChange(aspect, selectedStars);
        }}
      >
        <option value={0}>Selecciona...</option>
        {[1, 2, 3, 4, 5].map((star) => (
          <option key={star} value={star}>
            {star}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CalificaInmuebleArrendador;
