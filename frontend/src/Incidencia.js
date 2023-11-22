import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Incidencia() {

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aff: '',
    description: '',
    date: '',
    state: '',
    id_usuario: '',
    id_inmueble: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);

      let requestData = {
        aff: formData.aff,
        description: formData.description,
        date: currentDate,
        state: 0,
      };
  
      // Agregar id_usuario si está definido
      if (formData.id_usuario) {
        requestData.id_usuario = formData.id_usuario;
      }
  
      // Agregar id_inmueble si está definido
      if (formData.id_inmueble) {
        requestData.id_inmueble = formData.id_inmueble;
      }
  
      const response = await axios.post('http://localhost:3031/generarReporte', requestData);
      
      if (response.data.error) {
        console.log('Error al subir reporte:', response.data.error);
        return;
      }
    } catch (error) {
      console.error('Error al enviar la solicitud al servidor:', error);
    }
  };

  return (
    <div
      style={{
        background: '#D6D6D6', // Color gris de fondo
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Altura completa de la ventana
      }}
    >
      <div
        style={{
          width: '400px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Icono para cerrar ventana */}
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            float: 'right',
          }}
        >
          X
        </button>

        {/* Contenido centrado */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '25px' }}>Reportar Incidencia</h1>

          <h2 style={{ fontSize: '20px' }}>Asunto</h2>
          <input name="aff" value={formData.aff} onChange={handleChange} type="text" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} placeholder="Ingresa el asunto de la incidencia..." />

          <h2 style={{ fontSize: '20px' }}>Descripción</h2>
          <textarea
             name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', height: '300px', marginBottom: '25px', padding: '8px', resize: 'none' }}
            placeholder="Describe la incidencia en detalle..."
          ></textarea>

          <button
            style={{
              backgroundColor: '#422985',
              color: 'white',
              height: '43px',
              width: '100%',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleRegister}
          >
            Reportar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Incidencia;
