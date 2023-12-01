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
        swal("Contraseña Reestablecida.", " ", "success");
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
    <div className="d-flex justify-content-center align-items-center bg-white vh-100">
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '20px',
          left: '30px',
          color: '#422985',
          textDecoration: 'none',
          fontFamily: 'Aharoni',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{ marginRight: '5px' }}
        />
        Regresar
      </Link>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="bg-white p-3 rounded">
              <br></br>
              <br></br>
              <h2 className="text-center">Restablecer contraseña</h2>
              <br />
              <br></br>
              <br></br>
              <form onSubmit={handleInput}>
                <div className="mb-3">
                  <label htmlFor="correo">
                    <strong>Correo</strong>
                  </label>
                  <input
                    placeholder="Ingresar correo"
                    name="correo"
                    value={correo}
                    onChange={handleChange}
                    className="form-control rounded-0"
                    style={{ width: '100%' }}
                  />
                </div>
                <br />
                <br />
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-success rounded-0"
                    style={{
                      width: 'auto',
                      padding: '5px 10px',
                      backgroundColor: '#422985',
                      color: 'white',
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
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

