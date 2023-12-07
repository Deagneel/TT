import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function TipoUsuario() {
  return (
    <div className="container-fluid bg-white min-vh-100 d-flex justify-content-center align-items-center">
      <Link to="/home" className="position-absolute top-0 start-0 text-decoration-none text-dark ms-3 mt-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
        Regresar
      </Link>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="bg-white p-3 rounded text-center">
              <h2>Crear Cuenta</h2>
              <br />
              <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4 d-flex flex-column align-items-center mb-4 mb-md-0">
                  <img
                    src={process.env.PUBLIC_URL + '/Arrendador.png'}
                    alt="Arrendador"
                    className="img-fluid mb-3"
                    style={{ maxWidth: '200px' }}
                  />
                  <Link
                    to={{
                      pathname: '/signup',
                      search: '?tipo_de_usuario=0',
                      state: { tipo_de_usuario: 0 },
                    }}
                    class="btn btn-secondary btn-lg"
                    style={{
                      width: 'auto',
                      padding: '5px 20px',
                      textDecoration: 'none',
                      fontSize: '1.5rem',
                    }}
                  >
                    Arrendador
                  </Link>
                  <p className="mt-2" style={{ fontFamily: 'Aharoni', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Soy propietario del inmueble
                  </p>
                </div>
                <div className="col-md-5 col-lg-4 d-flex flex-column align-items-center">
                  <img
                    src={process.env.PUBLIC_URL + '/Arrendatario.png'}
                    alt="Arrendatario"
                    className="img-fluid mb-3"
                    style={{ maxWidth: '200px' }}
                  />
                  <Link
                    to={{
                      pathname: '/signup',
                      search: '?tipo_de_usuario=1',
                      state: { tipo_de_usuario: 1 },
                    }}
                    class="btn btn-secondary btn-lg"
                    style={{
                      width: 'auto',
                      padding: '5px 20px',
                      textDecoration: 'none',
                      fontSize: '1.5rem',
                      marginTop: 'auto', // Mover el botón al fondo
                    }}
                  >
                    Arrendatario
                  </Link>
                  <p className="mt-2" style={{ fontFamily: 'Aharoni', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Quiero rentar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipoUsuario;
