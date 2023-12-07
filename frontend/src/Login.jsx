import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Validation from './LoginValidation';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [values, setValues] = useState({
    correo: ''.trim(),
    contrasena: ''.trim(),
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const HandleCrearCuenta = () => {
    navigate('/tipousuario');
  }

  axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.correo === '' && err.contrasena === '') {
        try {
            const response = await axios.post('http://localhost:3031/login', values);
            const data = response.data;

            if (data.Login) {
              if(response.data.tipo_de_usuario === 0) {
                navigate('/homearrendador');
              } else if (response.data.tipo_de_usuario === 1) {
                navigate('/homearrendatario');
              } else if (response.data.tipo_de_usuario === 2) {
                navigate('/homeadministrador');
              }
          } else {
              alert(data.message || 'Error de inicio de sesión');
              console.log('Respuesta del servidor:', response);
          }
          
        } catch (error) {
            console.error('Error en la solicitud:', error);

            // Manejo específico de errores del servidor
            if (error.response) {
                console.error('Respuesta del servidor:', error.response.data);
                alert(error.response.data.error || 'Error interno del servidor');
            } else if (error.request) {
                console.error('No hay respuesta del servidor');
            } else {
                console.error('Error general:', error.message);
            }
        }
    }
};


return (
  <div className="container-fluid bg-white min-vh-100 d-flex justify-content-center align-items-center">
    <Link to="/home" className="position-absolute top-0 start-0 text-decoration-none text-dark ms-3 mt-3">
      <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
      Regresar
    </Link>
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <img
            src={process.env.PUBLIC_URL + '/imagen2.png'}
            alt="Imagen"
            className="img-fluid rounded-circle"
          />
        </div>
        <div className="col-md-6 mt-4 mt-md-0">
          <div className="bg-white p-3 rounded">
            <h2 className="text-center">Inicio de Sesión</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="correo" className="form-label">
                  <strong>Correo</strong>
                </label>
                <input
                  type="email"
                  placeholder="Ingresar correo"
                  name="correo"
                  onChange={handleInput}
                  autoComplete="off"
                  className="form-control"
                />
                {errors.correo && (
                  <span className="text-danger">{errors.correo}</span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="contrasena" className="form-label">
                  <strong>Contraseña</strong>
                </label>
                <input
                  type="password"
                  placeholder="Ingresar contraseña"
                  name="contrasena"
                  onChange={handleInput}
                  className="form-control"
                />
                {errors.contrasena && (
                  <span className="text-danger">{errors.contrasena}</span>
                )}
                <br />
                <Link to="/recuperarcontra" className="d-block mb-3">¿No recuerdas tu contraseña?</Link>
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-secondary"
                >
                  Iniciar sesión
                </button>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  onClick={HandleCrearCuenta}
                >
                  Crear una cuenta
                </button>
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
