import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Validation from './SignupValidation.js';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmar_contrasena: '',
    tipo_de_usuario: 0,
    perfil_completado: 1,
    nombre_usuario: '',
    aceptar_terminos: false,
    intento_envio: false,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10); // Genera un número aleatorio entre 0 y 9
  };

  const handleCheckbox = (event) => {
    setValues((prev) => ({ ...prev, aceptar_terminos: event.target.checked }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues((prev) => ({ ...prev, intento_envio: true }));
    const err = Validation(values);
    setErrors(err);

    if (
      err.nombre === '' &&
      err.correo === '' &&
      err.contrasena === '' &&
      values.contrasena === values.confirmar_contrasena &&
      values.aceptar_terminos
    ) {
      const nombreUsuario =
        values.nombre.substring(0, 8) +
        generateRandomNumber() +
        generateRandomNumber() +
        generateRandomNumber(); // Genera el nombre de usuario

      const updatedValues = {
        ...values,
        nombre_usuario: nombreUsuario,
      };

      axios
        .post('http://localhost:8081/signup', updatedValues)
        .then((res) => {
          navigate('/');
        })
        .catch((err) => console.log(err));
    }
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tipoDeUsuario = searchParams.get('tipo_de_usuario');

  useEffect(() => {
    if (tipoDeUsuario !== null) {
      setValues((prev) => ({
        ...prev,
        tipo_de_usuario: parseInt(tipoDeUsuario),
      }));
    }
  }, [tipoDeUsuario]);

  return (
    <div className="d-flex justify-content-center align-items-center bg-white vh-100">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="bg-white p-3 rounded">
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
              <center>
                <h2>
                  {values.tipo_de_usuario === 0 ? (
                    <span>Crear Cuenta - Arrendador</span>
                  ) : (
                    <span>Crear Cuenta - Arrendatario</span>
                  )}
                </h2>
              </center>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre">
                    <strong>Nombre</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresar nombre"
                    name="nombre"
                    onChange={handleInput}
                    className="form-control rounded-0"
                  />
                  {values.intento_envio && errors.nombre && (
                    <span className="text-danger">{errors.nombre}</span>
                  )}
                </div>

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
                  />
                  {values.intento_envio && errors.correo && (
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
                  />
                  {values.intento_envio && errors.contrasena && (
                    <span className="text-danger">{errors.contrasena}</span>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmar_contrasena">
                    <strong>Confirmar Contraseña</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    name="confirmar_contrasena"
                    onChange={handleInput}
                    className="form-control rounded-0"
                  />
                  {values.intento_envio &&
                    values.contrasena !== values.confirmar_contrasena && (
                      <span className="text-danger">
                        Las contraseñas no coinciden
                      </span>
                    )}
                </div>

                <div className="mb-3">
                  <label htmlFor="aceptar_terminos">
                    <input
                      type="checkbox"
                      name="aceptar_terminos"
                      onChange={handleCheckbox}
                    />
                    Acepto términos y condiciones.
                  </label>
                  {values.intento_envio && !values.aceptar_terminos && (
                    <span className="text-danger">
                      Es necesario aceptar los términos y condiciones para crear la cuenta.
                    </span>
                  )}
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
                    disabled={!values.aceptar_terminos}
                  >
                    Registrarse
                  </button>

                  <Link
                    to="/"
                    className="btn btn-success rounded-0"
                    style={{
                      width: 'auto',
                      padding: '5px 10px',
                      backgroundColor: '#422985',
                      color: 'white',
                    }}
                  >
                    Inicio de sesión
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
              <img
                src={process.env.PUBLIC_URL + '/Imagen1.png'}
                alt="Signup"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup