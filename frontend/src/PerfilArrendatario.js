import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const PerfilArrendatario = () => {

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    correo: '',
  });

  const [file, setFile] = useState();

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
      swal("Nombre Actualizado Correctamente", " ", "success");  
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

      swal("Correo Actualizado Correctamente", " ", "success");
  
      console.log(response.data); // Puedes manejar la respuesta exitosa aquí
  
    } catch (error) {
      console.error('Error al actualizar el nombre:', error.message);
      // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleFileChange = (e) => {
    // Actualiza el estado del archivo cuando cambia el campo de entrada de archivo
    setFile(e.target.files[0]);
  };

  const handleActualizarINE = async () => {
    console.log('Subir / Actualizar INE');
    try {
        // Verifica si hay un archivo seleccionado
        if (!file) {
            console.error('No se seleccionaron archivos');
            return;
        }

        const formImage = new FormData();
        formImage.append('image', file);

        // Sube la imagen y obtén la URL
        const imageResponse = await axios.post('http://localhost:3031/upload', formImage);
        console.log(imageResponse.data);

        // Realiza la solicitud PUT para actualizar el INE
        const response = await axios.put(`http://localhost:3031/newIne/${formData.id}`, {
            correo: imageResponse.data.url,
        });

        swal("INE Actualizada Correctamente", " ", "success");
        console.log(response.data); // Puedes manejar la respuesta exitosa aquí
    } catch (error) {
        console.error('Error al actualizar el INE:', error.message);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleCambiarContraseña = () => {
    console.log('Cambiar contraseña');
    swal("Cambiar Contraseña", "Le envíamos un correo con las instrucciones.", "info");
  };

  const handleCredencialEstudiante = async () => {
    console.log('Ver CREDENCIAL DE ESTUDIANTE');
    // Agrega el código para manejar la acción del botón aquí
    try {
        // Verifica si hay un archivo seleccionado
        if (!file) {
            console.error('No se seleccionaron archivos');
            return;
        }

        const formImage = new FormData();
        formImage.append('image', file);

        // Sube la imagen y obtén la URL
        const imageResponse = await axios.post('http://localhost:3031/upload', formImage);
        console.log(imageResponse.data);

        // Realiza la solicitud PUT para actualizar el INE
        const response = await axios.put(`http://localhost:3031/newCredencial/${formData.id}`, {
            correo: imageResponse.data.url,
        });

        swal("Credencial de Estudiante Actualizada Correctamente", " ", "success");

        console.log(response.data); // Puedes manejar la respuesta exitosa aquí
    } catch (error) {
        console.error('Error al actualizar el INE:', error.message);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleComprobanteInscripcion = async () => {
    console.log('Ver COMPROBANTE DE INSCRIPCIÓN');
    try {
        // Verifica si hay un archivo seleccionado
        if (!file) {
            console.error('No se seleccionaron archivos');
            return;
        }

        const formImage = new FormData();
        formImage.append('image', file);

        // Sube la imagen y obtén la URL
        const imageResponse = await axios.post('http://localhost:3031/upload', formImage);
        console.log(imageResponse.data);

        // Realiza la solicitud PUT para actualizar el INE
        const response = await axios.put(`http://localhost:3031/newComprobante/${formData.id}`, {
            correo: imageResponse.data.url,
        });

        console.log(response.data); // Puedes manejar la respuesta exitosa aquí
        swal("Comprobante de Inscripción Actualizado Correctamente", " ", "success");
    } catch (error) {
        console.error('Error al actualizar el INE:', error.message);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
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
            Perfil de Arrendatario
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
          <label>INE: </label>
              <input type="file" onChange={handleFileChange} />
              <button className="btn btn-info" onClick={handleActualizarINE}>
                  Subir / Actualizar
              </button>
          </div>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
          <label>Credencial de Estudiante: </label>
              <input type="file" onChange={handleFileChange} />
              <button className="btn btn-info" onClick={handleCredencialEstudiante}>
                  Subir / Actualizar
              </button>
          </div>

          <div className="profile-section" style={{ marginBottom: '20px' }}>
          <label>Comprobante de Inscripción: </label>
              <input type="file" onChange={handleFileChange} />
              <button className="btn btn-info" onClick={handleComprobanteInscripcion}>
                  Subir / Actualizar
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
