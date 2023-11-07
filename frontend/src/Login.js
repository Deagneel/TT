import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Validation from './LoginValidation';

function Login() {
  const [values, setValues] = useState({
    correo: '',
    contrasena: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.correo === '' && err.contrasena === '') {
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          if (res.data.errors) {
            setBackendError(res.data.errors);
          } else {
            setBackendError({});
            if (res.data === 'Success') {
              navigate('/home');
            } else {
              alert('No record existed');
            }
          }
        })
        .catch((err) => console.log(err));
    }
  }; 

  return (
    <div className="d-flex justify-content-center align-items-center bg-white vh-100">
      <Link
        to="/home"
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
            <img
              src={process.env.PUBLIC_URL + '/imagen2.png'}
              alt="Imagen"
              className="img-fluid rounded-circle"
              style={{ width: '100%', height: 'auto' }} // Corrige el valor de la propiedad height
            />
          </div>
          <div className="col-md-6" style={{ marginTop: '90px' }}> 
            <div className="bg-white p-3 rounded">
              <center>
                <h2>Inicio de Sesión</h2>
              </center>
              {Object.keys(backendError).length > 0 &&
                backendError.map((e, index) => (
                  <p className="text-danger" key={index}>
                    {e.msg}
                  </p>
                ))}
              <form action="" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="correo">
                    <strong>Correo</strong>
                  </label>
                  <input
                    type="email"
                    placeholder="Ingresar correo"
                    name="correo"
                    onChange={handleInput}
                    className="form-control rounded-0"
                    style={{ width: '100%' }}
                  />
                  {errors.correo && (
                    <span className="text-danger">{errors.correo}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="contrasena">
                    <strong>Contraseña</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresar contraseña"
                    name="contrasena"
                    onChange={handleInput}
                    className="form-control rounded-0"
                    style={{ width: '100%' }}
                  />
                  {errors.contrasena && (
                    <span className="text-danger">{errors.contrasena}</span>
                  )}
                  <br></br>
                  <Link
                    to="/recuperarcontra"
                    style={{ marginBottom: '10px' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <button
                    type="submit"
                    className="btn btn-success rounded-0"
                    style={{
                      width: 'auto',
                      padding: '5px 10px',
                      marginBottom: '10px',
                      backgroundColor: '#422985',
                    }}
                  >
                    Iniciar sesión
                  </button>
                  <Link
                    to="/tipousuario"
                    className="btn btn-success rounded-0"
                    style={{
                      width: 'auto',
                      padding: '5px 10px',
                      backgroundColor: '#422985',
                      color: 'white',
                    }}
                  >
                    Crear una cuenta
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
