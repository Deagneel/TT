import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Validation from './SignupValidation.js';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [values, setValues] = useState({
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
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

  const handleInput = (e) => {
    const { name, value } = e.target;

    // Definir las validaciones para campos específicos
    const validations = {
        nombre: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]*$/.test(value),
        primer_apellido: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]*$/.test(value),
        segundo_apellido: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]*$/.test(value)
    };

    const errorMessages = {
        nombre: "El nombre solo puede contener letras y espacios",
        primer_apellido: "El primer apellido solo puede contener letras y espacios",
        segundo_apellido: "El segundo apellido solo puede contener letras y espacios"
    };

    // Verificar si hay una validación definida para este campo
    if (validations[name]) {
      // Si la validación falla, no actualizar el estado y, opcionalmente, mostrar un error
      if (!validations[name](value)) {
          swal(errorMessages[name], "", "error");
          return; // Detener la ejecución aquí
      }
    }
    if (validations[name] && !validations[name](value)) {
        // Si la validación falla, mostrar un error
        swal(errorMessages[name], "", "error");
        return; // Detener la ejecución aquí si la validación falla
    } else {
        // Actualizar el estado solo si la validación es exitosa
        setValues(prev => ({ ...prev, [name]: value }));
    }
};

const handleKeyPress = (e) => {
  // Crear una expresión regular que permita solo letras y espacios
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;

  // Verificar si la tecla presionada es un carácter no permitido
  if (!regex.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
      // Prevenir la acción predeterminada del evento (escribir el carácter en el campo)
      e.preventDefault();
  }
};



  const handleCheckbox = (event) => {
    setValues((prev) => ({ ...prev, aceptar_terminos: event.target.checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValues((prev) => ({ ...prev, intento_envio: true, boton_deshabilitado: true }));
    const err = Validation(values);
    setErrors(err);
    /*
    // Validar la longitud mínima del nombre.
    if (values.nombre.trim().length < 3) {
      swal("Error", "Ingresa un nombre válido.", "error");
      setValues(prev => ({ ...prev, boton_deshabilitado: false }));
      return;
    }

    // Validar la longitud mínima del primer apellido.
    if (values.primer_apellido.trim().length < 3) {
      swal("Error", "Ingresa un primer apellido válido.", "error");
      setValues(prev => ({ ...prev, boton_deshabilitado: false }));
      return;
    }

    // Validar la longitud mínima del segundo apellido.
    if (values.segundo_apellido.trim().length < 3) {
      swal("Error", "Ingresa un segundo apellido válido.", "error");
      setValues(prev => ({ ...prev, boton_deshabilitado: false }));
      return;
    }

    // Validar que nombre no tenga tres caracteres idénticos seguidos.
    if (/(\w)\1{2}/.test(values.nombre)) {
      swal("Error", "Ingresa un nombre valido, por favor.", "error");
      return;
    }

    // Validar que primer apellido no tenga tres caracteres idénticos seguidos.
    if (/(\w)\1{2}/.test(values.primer_apellido)) {
      swal("Error", "Ingresa un primer apellido valido, por favor.", "error");
      return;
    }

    // Validar que segundo apellido no tenga tres caracteres idénticos seguidos.
    if (/(\w)\1{2}/.test(values.segundo_apellido)) {
      swal("Error", "Ingresa un nombre valido, por favor.", "error");
      return;
    }
    */
  
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
          primer_apellido: values.primer_apellido,
          segundo_apellido: values.segundo_apellido,
          correo: values.correo,
          contrasena: values.contrasena,  // Aquí debes usar values.contrasena en lugar de values.confirmar_contrasena
          tipo_de_usuario: values.tipo_de_usuario,
        });
  
        if (signupResponse.data.error) {
          console.log('Error al registrar el usuario:', signupResponse.data.error);
          return;
        }
        

      const signupChatResponse = axios.post('http://localhost:3031/registrochat', {
          mail: values.correo,
          name: values.nombre,
          last_name: values.primer_apellido,
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
    <div className="container-fluid bg-white min-vh-100 d-flex justify-content-center align-items-center">
      <Link to="/tipousuario" className="position-absolute top-0 start-0 text-decoration-none text-dark ms-3 mt-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
        Regresar
      </Link>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6 order-md-2">
            <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
              <img
                src={process.env.PUBLIC_URL + '/Imagen1.png'}
                alt="Signup"
                className="img-fluid rounded-circle"
              />
            </div>
          </div>
          <div className="col-md-6 mt-4 mt-md-0 order-md-1">
            <div className="bg-white p-3 rounded">
              <h2 className="text-center">
                {values.tipo_de_usuario === 0 ? (
                  <span>Crear Cuenta - Arrendador</span>
                ) : (
                  <span>Crear Cuenta - Arrendatario</span>
                )}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    <strong>Nombre</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresar nombre"
                    name="nombre"
                    autoComplete="off"
                    onChange={handleInput}
                    onKeyPress={handleKeyPress}
                    className="form-control"
                  />
                  {errors.nombre && (
                    <span className="text-danger">{errors.nombre}</span>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="primer_apellido" className="form-label">
                    <strong>Primer Apellido</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresar nombre"
                    name="primer_apellido"
                    autoComplete="off"
                    onChange={handleInput}
                    onKeyPress={handleKeyPress}
                    className="form-control"
                  />
                  {errors.primer_apellido && (
                    <span className="text-danger">{errors.primer_apellido}</span>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="segundo_apellido" className="form-label">
                    <strong>Segundo Apellido</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresar nombre"
                    name="segundo_apellido"
                    autoComplete="off"
                    onChange={handleInput}
                    onKeyPress={handleKeyPress}
                    className="form-control"
                  />
                  {errors.segundo_apellido && (
                    <span className="text-danger">{errors.segundo_apellido}</span>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    <strong>Correo</strong>
                  </label>
                  <input
                    type="email"
                    placeholder="Ingresar correo"
                    name="correo"
                    autoComplete="off"
                    onChange={handleInput}
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
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmar_contrasena" className="form-label">
                    <strong>Confirmar Contraseña</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    name="confirmar_contrasena"
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                      type="checkbox"
                      className="form-check-input"
                      name="aceptar_terminos"
                      onChange={handleCheckbox}
                      id="aceptar_terminos"
                  />
                  <label className="form-check-label" htmlFor="aceptar_terminos">
                      Acepto los <Link to="/termsandconditions">términos y condiciones</Link>.
                  </label>
              </div>


                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={!values.aceptar_terminos || values.boton_deshabilitado}
                  >
                    Registrarse
                  </button>
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                  >
                    Inicio de sesión
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

export default Signup;
