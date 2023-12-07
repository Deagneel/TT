import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function NuevaContra() {
  const { id_usuario } = useParams();
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const navigate = useNavigate();

  const handleContrasenaInput = (event) => {
    setContrasena(event.target.value);
  };

  const handleConfirmarContrasenaInput = (event) => {
    setConfirmarContrasena(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (contrasena !== '' && contrasena === confirmarContrasena) {
      axios.put(`http://localhost:3031/actualizar-contrasena/${id_usuario}`, {
        contrasena: contrasena,
      })
      .then((response) => {
        navigate('/exito');
      })
      .catch((error) => {
        console.error('Error al cambiar la contraseña:', error);
        alert('Error al cambiar la contraseña');
      });
    } else {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <div className="container-fluid bg-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="bg-white p-4 rounded">
              <h2 className="text-center mb-4">Nueva contraseña</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="contrasena">
                    <strong>Nueva contraseña</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresar contraseña"
                    name="contrasena"
                    value={contrasena}
                    onChange={handleContrasenaInput}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmarContrasena">
                    <strong>Confirmar Contraseña</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    name="confirmarContrasena"
                    value={confirmarContrasena}
                    onChange={handleConfirmarContrasenaInput}
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
            <div className="rounded-circle overflow-hidden">
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

export default NuevaContra;

