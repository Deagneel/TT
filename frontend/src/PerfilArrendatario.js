import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import swal from 'sweetalert';

const PerfilArrendatario = () => {

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
  });

  const [file, setFile] = useState();

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3031')
    .then(res => {
      if(res.data.valid) {
      } else {
        navigate('/login');
      }
    })
  })

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        axios.defaults.withCredentials = true;
        const responsePerfil = await axios.get(`http://localhost:3031/perfil`);
        console.log('Información de Usuario:', responsePerfil.data);
        setFormData({
          id: responsePerfil.data.id_usuario,
          nombre: responsePerfil.data.nombre,
          primer_apellido: responsePerfil.data.primer_apellido,
          segundo_apellido: responsePerfil.data.segundo_apellido,
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

  const handleActualizarApe = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`http://localhost:3031/newApe/${formData.id}`, {
        primer_apellido: formData.primer_apellido,
      });
      console.log(response.data);
      swal("Apellido Actualizado Correctamente", " ", "success");  
    } catch (error) {
      console.error('Error al actualizar el apellido:', error.message);
    }
  };

  const handleActualizarApe2= async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`http://localhost:3031/newApe2/${formData.id}`, {
        segundo_apellido: formData.segundo_apellido,
      });
      console.log(response.data);
      swal("Apellido Actualizado Correctamente", " ", "success");  
    } catch (error) {
      console.error('Error al actualizar el apellido:', error.message);
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

  const actualizarPerfilCompletado = async () => {
    try {
      await axios.get(`http://localhost:3031/actualizarPerfilCompletado`);
    } catch (error) {
      console.error('Error al actualizar perfil completado:', error);
    }
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

        await actualizarPerfilCompletado();
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

        await actualizarPerfilCompletado();
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

        await actualizarPerfilCompletado();
    } catch (error) {
        console.error('Error al actualizar el INE:', error.message);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleComprobanteDomicilio = async () => {
    console.log('Ver COMPROBANTE DE DOMICILIO');
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
        const response = await axios.put(`http://localhost:3031/newComprobanteD/${formData.id}`, {
            correo: imageResponse.data.url,
        });

        console.log(response.data); // Puedes manejar la respuesta exitosa aquí
        swal("Comprobante de Domicilio Actualizado Correctamente", " ", "success");

        await actualizarPerfilCompletado();
    } catch (error) {
        console.error('Error al actualizar el INE:', error.message);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleNombreChange = (e) => {
    const { value } = e.target;

    // Validación para el nombre: solo permite letras y espacios
    if (!(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/.test(value) || value === '')) {
        swal("El nombre no puede incluir números ni caracteres especiales", "", "error");
        return;
    }

    setFormData({
      ...formData,
      nombre: value,
    });
  };


  const handleApeChange = (e) => {
    const { value } = e.target;

    // Validación para el nombre: solo permite letras y espacios
    if (!(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/.test(value) || value === '')) {
        swal("El nombre no puede incluir números ni caracteres especiales", "", "error");
        return;
    }

    setFormData({
      ...formData,
      primer_apellido: value,
    });
  };

  const handleApe2Change = (e) => {
    const { value } = e.target;

    // Validación para el nombre: solo permite letras y espacios
    if (!(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/.test(value) || value === '')) {
        swal("El nombre no puede incluir números ni caracteres especiales", "", "error");
        return;
    }

    setFormData({
      ...formData,
      segundo_apellido: value,
    });
  };

  const handleCorreoChange = (e) => {
    setFormData({
      ...formData,
      correo: e.target.value,
    });
  };

  const handleEliminarIncidencia = async (repoId) => {
    try {
      const rentadosCheckResponse = await axios.get(`http://localhost:3031/verificarEstadoRentados`);
      const tieneEstadoActivo = rentadosCheckResponse.data.resultado;

      if (tieneEstadoActivo == 0) {
        // Mostrar mensaje si tiene estado activo
        await swal('No puedes eliminar el perfil porque hay al menos un inmueble rentado');
      } else {
        const willDelete = await swal({
          title: "¿Estás seguro?",
          text: "Una vez eliminado, no se podrá recuperar.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
  
        if (willDelete) {
          await axios.delete(`http://localhost:3031/eliminarUsuario/${repoId}`);
          swal("Usuario Borrado del Sistema", { icon: "success" });
          window.location.reload();
        } else {
          swal("Operación Cancelada");
        }
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleBack = () => {
    window.history.back();
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
              <label htmlFor="nombre" className="col-sm-3 col-form-label">Primer apellido:</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  value={formData.primer_apellido}
                  onChange={handleApeChange}
                />
              </div>
              <div className="col-sm-3">
                <button className="btn btn-secondary" onClick={handleActualizarApe}>
                  Actualizar
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label htmlFor="nombre" className="col-sm-3 col-form-label">Segundo apellido:</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  value={formData.segundo_apellido}
                  onChange={handleApe2Change}
                />
              </div>
              <div className="col-sm-3">
                <button className="btn btn-secondary" onClick={handleActualizarApe2}>
                  Actualizar
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label htmlFor="correo" className="col-sm-3 col-form-label">Correo:</label>
              <div className="col-sm-6">
              {formData.correo}
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-3 col-form-label">INE: </label>
              <div className="col-sm-6">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="col-sm-3">
                <button className="btn btn-secondary" onClick={handleActualizarINE}>
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
                <button className="btn btn-secondary" onClick={handleCredencialEstudiante}>
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
                <button className="btn btn-secondary" onClick={handleComprobanteInscripcion}>
                  Subir
                </button>
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-3 col-form-label">Comprobante de Domicilio: </label>
              <div className="col-sm-6">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="col-sm-3">
                <button className="btn btn-secondary" onClick={handleComprobanteDomicilio}>
                  Subir
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button className="btn btn-dark md-5" onClick={handleCambiarContraseña}>
                  Cambiar Contraseña
                </button>
                <button className="btn btn-dark btn-block md-5" onClick={() => handleEliminarIncidencia(formData.id)}>Eliminar cuenta</button>
              </div>
            </div>

            <button className="btn btn-secondary" style={{ position: 'absolute', top: '10px', left: '10px' }} onClick={handleBack}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PerfilArrendatario;
