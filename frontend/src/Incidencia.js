import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function Incidencia({}) {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const { id_usuario, id_inmueble } = useParams();

  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('https://apirest-408205.uc.r.appspot.com')
    .then(res => {
      if(res.data.valid) {
      } else {
        navigate('/login');
      }
    })
  })

  const handleGoBack = () => {
    window.history.back(); // Esta línea te lleva a la página anterior
  };
  
  const [formData, setFormData] = useState({
    aff: '',
    description: '',
    date: '',
    id_usuario: id_usuario,
    id_inmueble: id_inmueble,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    if (!formData.aff.trim() || !formData.description.trim()) {
      swal("Error", "El asunto y la descripción son obligatorios", "error");
      return;
    }
    // Validar la longitud mínima de 'aff' y 'description'
    if (formData.aff.trim().length < 5 || formData.description.trim().length < 10) {
      swal("Error", "Necesitamos un poco más de información para ayudarte mejor", "error");
      return;
    }

    try {
      const currentDate = new Date().toISOString().slice(0, 10);

      let requestData = {
        aff: formData.aff,
        description: formData.description,
        date: currentDate,
        id_usuario: formData.id_usuario,
        id_inmueble: formData.id_inmueble,
      };
  
      // Agregar id_usuario si está definido
      if (formData.id_usuario) {
        requestData.id_usuario = formData.id_usuario;
      }
  
      // Agregar id_inmueble si está definido
      if (formData.id_inmueble) {
        requestData.id_inmueble = formData.id_inmueble;
      }
  
      const response = await axios.post('https://apirest-408205.uc.r.appspot.com/generarReporte', requestData);
      window.history.back(); 

      swal("Reporte realizado con éxito", " ", "success");
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
        background: '#999999', // Color gris de fondo
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
        onClick={handleGoBack}
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
            class="btn btn-danger"
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
