import React, { useState } from 'react';
import axios from 'axios';

const CalificaArrendatario = () => {
  const [comportamiento, setComportamiento] = useState(0);

  const handleRating = (stars) => {
    setComportamiento(stars);
  };

  const handleSubmit = () => {
    const data = {
      comportamiento,
    };

    axios.post('URL_API', data)
      .then(response => {
        console.log('Reseña enviada:', response.data);
        // Puedes realizar acciones adicionales aquí si es necesario
      })
      .catch(error => {
        console.error('Error al enviar la reseña:', error);
      });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0 }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', flex: 1 }}>
        <h2>Reseña</h2>
        <div>
          <p>Por favor, califique el comportamiento del arrendatario:</p>
          <StarsRating onChange={handleRating} />
        </div>
        <button style={{ backgroundColor: '#dcd9e7', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer' }} onClick={handleSubmit}>
          Enviar Reseña
        </button>
      </div>
      <div style={{ backgroundColor: '#dcd9e7', padding: '20px', flex: 2 }}>
        <div>
          <h2>Nombre del Arrendatario</h2>
          <img src="ruta-de-la-imagen-arrendatario" alt="Arrendatario" />
        </div>
      </div>
    </div>
  );
};

const StarsRating = ({ onChange }) => {
  const [stars, setStars] = useState(0);

  return (
    <div className="stars-rating" style={{ cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`fa fa-star${star <= stars ? ' checked' : ''}`}
          onClick={() => {
            setStars(star);
            onChange(star);
          }}
        ></span>
      ))}
    </div>
  );
};

export default CalificaArrendatario;
