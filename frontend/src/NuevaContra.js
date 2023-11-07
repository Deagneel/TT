import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function NuevaContra() {
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const navigate = useNavigate();

  const handleContrasenaInput = (event) => {
    setContrasena(event.target.value);
  };

  const handleConfirmarContrasenaInput = (event) => {
    setConfirmarContrasena(event.target.value);
  };
//ss
  const handleSubmit = (event) => {
    event.preventDefault();
    // Validar contraseñas y realizar la lógica necesaria para cambiar la contraseña
    if (contrasena !== '' && contrasena === confirmarContrasena) {
      // Aquí puedes implementar la lógica para cambiar la contraseña
      navigate('/exito');
    } else {
      // Mostrar mensaje de error si las contraseñas no coinciden
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-white vh-100">
      <Link
        to="/recuperarcontra"
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
              <br />
              <h2 className="text-center">Nueva contraseña</h2>
              <br />
              <br />
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
                    className="form-control rounded-0"
                    style={{ width: '100%' }}
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

