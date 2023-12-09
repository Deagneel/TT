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
    axios.post('http://localhost:3031/recuperar-contrasena', { correo: formData.correo })
      .then((response) => {
        console.log(response.data);
        swal("Correo enviado con éxito.", " ", "success");
        // Manejar la respuesta, por ejemplo, mostrar un mensaje de éxito o error al usuario
      })
      .catch((error) => {
        console.error('Error al recuperar la contraseña:', error);
        // Manejar el error, mostrar un mensaje al usuario, etc.
      });
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

  const handleEliminarIncidencia = async (repoId) => {
    console.log(repoId);
    try {
      // Mostrar SweetAlert2 de confirmación
      const willDelete = await swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no se podrá recuperar.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      // Si el usuario confirma la eliminación
      if (willDelete) {
        // Realizar la solicitud al servidor para eliminar el usuario
        await axios.delete(`http://localhost:3031/eliminarUsuario/${repoId}`);
        // Mostrar SweetAlert2 de éxito
        swal("Usuario Borrado del Sistema", {
          icon: "success",
        });
        // Recargar la página
        window.location.reload();
      } else {
        // Mostrar SweetAlert2 de cancelación
        swal("Operación Cancelada");
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <div className="container-fluid" style={{ margin: 0, fontFamily: 'Roboto, sans-serif', backgroundColor: '#999999' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-8 col-lg-6">
          <div className="bg-white p-4 rounded text-center">
            <h1 className="mb-4">Perfil</h1>
            
            <div className="mb-3 row align-items-center">
              <label htmlFor="nombre" className="col-sm-3 col-form-label">Nombre:</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleNombreChange}
                />
              </div>
              <div className="col-sm-3">
                <button className="btn btn-secondary" onClick={handleActualizarNombre}>
                  Actualizar
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label htmlFor="correo" className="col-sm-3 col-form-label">Correo:</label>
              <div className="col-sm-6">
                <input
                  type="email"
                  className="form-control"
                  value={formData.correo}
                  onChange={handleCorreoChange}
                />
              </div>
              <div className="col-sm-3">
                <button className="btn btn-secondary" onClick={handleActualizarCorreo}>
                  Actualizar
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-3 col-form-label">INE: </label>
              <div className="col-sm-6">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="col-sm-3">
                <button class="btn btn-secondary" onClick={handleActualizarINE}>
                  Subir
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-3 col-form-label">Credencial de Estudiante: </label>
              <div className="col-sm-6">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="col-sm-3">
                <button class="btn btn-secondary" onClick={handleCredencialEstudiante}>
                  Subir
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-3 col-form-label">Comprobante de Inscripción: </label>
              <div className="col-sm-6">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="col-sm-3">
                <button class="btn btn-secondary" onClick={handleComprobanteInscripcion}>
                  Subir
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button class="btn btn-dark" onClick={handleCambiarContraseña}>
                  Cambiar Contraseña
                </button>
                <button className="btn btn-dark btn-block" onClick={() => handleEliminarIncidencia(formData.id)}>Eliminar cuenta</button>
              </div>
            </div>

            <Link
              to="/homearrendatario"
              className="return-link"
              style={{
                color: 'black',
                textDecoration: 'none',
                position: 'absolute',
                top: '10px',
                left: '10px',
              }}
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PerfilArrendatario;
