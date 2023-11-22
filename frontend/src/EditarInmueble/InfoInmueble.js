import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EditInmue.css';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function InfoInmueble() {
  return (
    <div className="app-container">
    <div style={{ marginLeft: '25px', marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button className="close-button">X</button>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' }}>Me interesa</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button className="color-icon" style={{ marginLeft:'24px' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '30px', marginRight: '10px', cursor: 'pointer' }} />
            </button>
          </div>
        </div>

        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' }}>Reportar</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button className="color-icon" style={{ marginLeft:'14px' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '30px',marginRight: '10px', cursor: 'pointer' }} />
            </button>
          </div>
        </div>

        {/* Placeholder titulo */}
        <div className="align-center">
          <input type="text" className='fondo-placeholder' placeholder="Titulo de la publicación" style={{ width: '400px' }} />
        </div>
      </div>

      {/* Carrusel de imágenes */}
      <div style={{ marginTop: '1px', border: '1px solid #000', width: '550px', height: '270px', margin: '0 auto' }}>
      {/* Aquí irá el carrusel de imágenes */}
      </div>

      {/* Aquí comienzan los detalles del departamento */}
      <div style={{ marginTop:'29px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
      {/* Direccion */}
      <div style={{ marginRight: '55px' }}>
          <span style={{ marginBottom: '0' }}>Dirección</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <textarea placeholder="Ingresar dirección" className='fondo-placeholder' style={{ width: '420px', height: '100px', resize: 'none' }} />
          </div>
        </div>
      {/* Coordenadas */}
      <div style={{ marginRight: '55px' }}>
          <span style={{ marginBottom: '0' }}>Coordenadas</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input placeholder="Ingresar dirección" className='fondo-placeholder' style={{ width: '200px', resize: 'none' }} />
          </div>
          {/* Num cuartos */}
      <div style={{ marginRight: '5px' }}>
          <span style={{ marginBottom: '0' }}>Número de cuartos</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input placeholder="Ingresar el número de cuartos" className='fondo-placeholder' style={{ width: '200px', resize: 'none' }} />
          </div>
      </div>
      </div>
      
      </div>

      <div style={{ marginTop:'29px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
      {/* Precio */}
      <div style={{ marginRight: '120px' }}>
          <span style={{ marginBottom: '0' }}>Precio</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input placeholder="Precio" className='fondo-placeholder' style={{ width: '100px', resize: 'none' }} />
          </div>
      </div>
      {/* Periodo del contrato */}
      <div style={{ marginRight: '120px' }}>
          <span style={{ marginBottom: '0' }}>Periodo del contrato</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <select style={{ width: '150px', fontSize: '16px', height:'30px' }} className="input-box">
                <option value="mensual">Mensual</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Tremestral</option>
                <option value="Cuatrimestral">Cuatrimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
            </select>
          </div>
      </div>
      {/* Tipo de habitación */}
      <div>
          <span style={{ marginBottom: '0' }}>Tipo de vivienda</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <select style={{ width: '150px', fontSize: '16px', height:'30px' }} className="input-box">
                <option value="compartida">Compartida</option>
                <option value="individual">Individual</option>
            </select>
          </div>
      </div>
      </div>

      <div style={{ marginTop:'29px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
          {/* Reglamento */}
          <div style={{ marginRight: '35px', width: '620px', margin: '0 auto' }}>
            <span style={{marginLeft: '270px', marginBottom: '0' }}>Reglamento</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <textarea placeholder="Ingresar reglamento" className='fondo-placeholder' style={{ width: '675px', height: '500px', resize: 'none' }} />
          </div>
        </div>
      </div>
      
    </div>
    </div>
  );
}

export default InfoInmueble