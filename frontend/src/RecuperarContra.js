import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');

  const handleInput = (event) => {
    event.preventDefault();
  
    axios.post('http://localhost:3031/recuperar-contrasena', { correo })
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

  const handleChange = (event) => {
    setCorreo(event.target.value);
  };
  

  return (
    <div className="container-fluid bg-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <Link to="/login" className="position-absolute top-0 start-0 text-decoration-none text-dark ms-3 mt-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
        Regresar
      </Link>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="bg-white p-4 rounded">
              <h2 className="text-center mb-4">Restablecer contraseña</h2>
              <form onSubmit={handleInput}>
                <div className="mb-4">
                  <label htmlFor="correo">
                    <strong>Correo</strong>
                  </label>
                  <input
                    placeholder="Ingresar correo"
                    name="correo"
                    value={correo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-secondary"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center mt-4 mt-md-0">
            <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
              <img
                src={process.env.PUBLIC_URL + '/Imagen1.png'}
                alt="Imagen"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContrasena;

