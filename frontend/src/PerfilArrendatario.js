import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PerfilArrendatario = () => {

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    correo: '',
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        axios.defaults.withCredentials = true;
        const responsePerfil = await axios.get(`http://localhost:3031/perfil`);
        console.log('Información de Usuario:', responsePerfil.data);
        setFormData({
          id: responsePerfil.data.id_usuario,
          nombre: responsePerfil.data.nombre,
          correo: responsePerfil.data.correo,
        });
      } catch (error) {
        console.error('Error fetching perfil:', error);
        // Handle error as needed
      }
    };

    fetchPerfil();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const handleActualizarNombre = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`http://localhost:3031/newName/${formData.id}`, {
        nombre: formData.nombre,
      });
  
      console.log(response.data); // Puedes manejar la respuesta exitosa aquí
  
    } catch (error) {
      console.error('Error al actualizar el nombre:', error.message);
      // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };
  
  
  const handleActualizarCorreo = async () => {
    console.log('Actualizar correo');
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`http://localhost:3031/newMail/${formData.id}`, {
        correo: formData.correo,
      });
  
      console.log(response.data); // Puedes manejar la respuesta exitosa aquí
  
    } catch (error) {
      console.error('Error al actualizar el nombre:', error.message);
      // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleActualizarINE = () => {
    console.log('Subir / Actualizar INE');
  };

  const handleCambiarContraseña = () => {
    console.log('Cambiar contraseña');
  };

  const handleCredencialEstudiante = () => {
    console.log('Ver CREDENCIAL DE ESTUDIANTE');
    // Agrega el código para manejar la acción del botón aquí
  };

  const handleComprobanteInscripcion = () => {
    console.log('Ver COMPROBANTE DE INSCRIPCIÓN');
    // Agrega el código para manejar la acción del botón aquí
  };

  const handleNombreChange = (e) => {
    setFormData({
      ...formData,
      nombre: e.target.value,
    });
  };

  const handleCorreoChange = (e) => {
    setFormData({
      ...formData,
      correo: e.target.value,
    });
  };

  return (
    <div style={{ margin: 0, fontFamily: 'Roboto, sans-serif' }}>
      <div
        className="main-container"
        style={{
          backgroundColor: 'mediumpurple',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="inner-container"
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            width: '40%',
          }}
        >
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
            Perfil de Arrendador
          </h1>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
            <label>Nombre:</label>
            <input
              type="text"
              style={{ width: '50%', marginRight: '10px' }}
              value={formData.nombre}
              onChange={handleNombreChange}
            />
            <button className="btn btn-primary" onClick={handleActualizarNombre}>
              Actualizar
            </button>
          </div>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
            <label>Correo:</label>
            <input
              type="email"
              style={{ width: '50%', marginRight: '10px' }}
              value={formData.correo}
              onChange={handleCorreoChange}
            />
            <button className="btn btn-primary" onClick={handleActualizarCorreo}>
              Actualizar
            </button>
          </div>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
            <button className="btn btn-info" onClick={handleActualizarINE}>
              Subir / Actualizar INE
            </button>
          </div>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
          <button className="btn btn-success" onClick={handleCredencialEstudiante}>
             Subir / ActualizarCredencial de Estudiante
          </button>
        </div>

        <div className="profile-section" style={{ marginBottom: '20px' }}>
          <button className="btn btn-danger" onClick={handleComprobanteInscripcion}>
            Subir / Actualizar Comprobante de Inscripción
          </button>
        </div>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
            <button className="btn btn-warning" onClick={handleCambiarContraseña}>
              Cambiar Contraseña
            </button>
          </div>

          <Link
            to="/homearrendatario" // Reemplaza con la ruta a la que deseas volver
            className="return-link"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '10px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PerfilArrendatario;
