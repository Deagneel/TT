import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Validation from './SignupValidation.js';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    nombre: '',
    correo: ''.trim(),
    contrasena: ''.trim(),
    confirmar_contrasena: '',
    tipo_de_usuario: 0,
    aceptar_terminos: false,
    intento_envio: false,
    boton_deshabilitado: false,
  });

  const navigate = useNavigate();
  const[errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCheckbox = (event) => {
    setValues((prev) => ({ ...prev, aceptar_terminos: event.target.checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValues((prev) => ({ ...prev, intento_envio: true, boton_deshabilitado: true }));
    const err = Validation(values);
    setErrors(err);
  
    try {
      if (
        err.nombre === '' &&
        err.correo === '' &&
        err.contrasena === '' &&
        values.contrasena === values.confirmar_contrasena &&
        values.aceptar_terminos
      ) {
        const signupResponse = await axios.post('http://localhost:3031/signup', {
          nombre: values.nombre,
          correo: values.correo,
          contrasena: values.contrasena,  // Aquí debes usar values.contrasena en lugar de values.confirmar_contrasena
          tipo_de_usuario: values.tipo_de_usuario,
        });
  
        console.log(signupResponse.data);
  
        if (signupResponse.data.error) {
          console.log('Error al registrar el usuario:', signupResponse.data.error);
          return;
        }
        

      const signupChatResponse = axios.post('http://localhost:3031/registrochat', {
          mail: values.correo,
          name: values.nombre
        });
  
        console.log(signupChatResponse.data);
        navigate('/');
      }
    } catch (err) {
      console.error('Error en la solicitud de registro:', err);
    } finally {
      setValues((prev) => ({ ...prev, boton_deshabilitado: false }));
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
                to="/tipousuario"
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
                    autoComplete="off"
                    onChange={handleInput}
                    className="form-control rounded-0"
                  />
                  {errors.nombre && (
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
                    autoComplete="off"
                    onChange={handleInput}
                    className="form-control rounded-0"
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
                  />
                  {errors.contrasena && (
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
                    disabled={!values.aceptar_terminos || values.boton_deshabilitado}
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

export default Signup;
