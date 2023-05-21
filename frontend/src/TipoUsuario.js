import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function TipoUsuario() {
  return (
    <div className="d-flex justify-content-center align-items-center bg-white vh-100">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-white p-3 rounded text-center">
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
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
                Regresar
              </Link>
              <h2>Crear Cuenta</h2>
              <br />
              <div className="d-flex justify-content-center">
                <div className="d-flex flex-column align-items-center mr-5">
                  <img
                    src={process.env.PUBLIC_URL + '/Rene.jpg'}
                    alt="Arrendador"
                    className="img-fluid"
                    style={{ marginBottom: '10px' }}
                  />
                  <Link
                    to={{
                      pathname: '/signup',
                      search: '?tipo_de_usuario=0',
                      state: { tipo_de_usuario: 0 },
                    }}
                    className="btn btn-success rounded"
                    style={{
                      width: 'auto',
                      padding: '5px 10px',
                      marginBottom: '10px',
                      backgroundColor: '#422985',
                      textDecoration: 'none',
                      fontSize: '25px',
                    }}
                  >
                    Arrendador
                  </Link>
                  <p style={{ marginBottom: '0', fontFamily: 'Aharoni', fontSize: '20px' }}>
                    Soy propietario del inmueble
                  </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <img
                    src={process.env.PUBLIC_URL + '/Rene.jpg'}
                    alt="Arrendatario"
                    className="img-fluid"
                    style={{ marginBottom: '10px', marginLeft: '10px' }}
                  />
                  <Link
                    to={{
                      pathname: '/signup',
                      search: '?tipo_de_usuario=1',
                      state: { tipo_de_usuario: 1 },
                    }}
                    className="btn btn-success rounded"
                    style={{
                      width: 'auto',
                      padding: '5px 10px',
                      marginBottom: '10px',
                      backgroundColor: '#422985',
                      textDecoration: 'none',
                      fontSize: '25px',
                    }}
                  >
                    Arrendatario
                  </Link>
                  <p style={{ marginBottom: '0', fontFamily: 'Aharoni', fontSize: '20px' }}>
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






