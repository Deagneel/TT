import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './EditInmue.css';
import { faTimesCircle, faPauseCircle, faEdit } from '@fortawesome/free-solid-svg-icons';

function EditarInmueble() {
  return (
    <div className="app-container">
    <div style={{ marginLeft: '25px', marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button className="close-button">X</button>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' }}>Borrar publicación</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button className="color-icon" style={{ marginLeft:'45px' }}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
        </div>

        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' }}>Pausar publicación</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button className="color-icon" style={{ marginLeft:'45px' }}>
              <FontAwesomeIcon icon={faPauseCircle} />
            </button>
          </div>
        </div>

        {/* Placeholder titulo */}
        <div style={{ marginLeft:'105px', flex: '1', display: 'flex', alignItems: 'center' }}>
          <input type="text" className='fondo-placeholder' placeholder="Titulo de la publicación" style={{ width: '400px' }} />
          <button className="color-icon" style={{ marginLeft:'8px' }}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </div>

      {/* Carrusel de imágenes */}
      <div style={{ marginTop: '1px', border: '1px solid #000', width: '550px', height: '270px', margin: '0 auto' }}>
      {/* Aquí irá el carrusel de imágenes */}
      <button className="color-icon" style={{ marginLeft:'560px', marginTop:'110px', }}>
        <FontAwesomeIcon icon={faEdit} />
      </button>
      </div>

      {/* Aquí comienzan los detalles del departamento */}
      <div style={{ marginTop:'29px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
      {/* Direccion */}
      <div style={{ marginRight: '55px' }}>
          <span style={{ marginBottom: '0' }}>Dirección</span>
          <button className="color-icon" style={{ marginLeft:'8px' }}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <textarea placeholder="Ingresar dirección" className='fondo-placeholder' style={{ width: '420px', height: '100px', resize: 'none' }} />
          </div>
        </div>
      {/* Coordenadas */}
      <div style={{ marginRight: '55px' }}>
          <span style={{ marginBottom: '0' }}>Coordenadas</span>
          <button className="color-icon" style={{ marginLeft:'8px'}}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input placeholder="Ingresar dirección" className='fondo-placeholder' style={{ width: '200px', resize: 'none' }} />
          </div>
          {/* Num cuartos */}
      <div style={{ marginRight: '5px' }}>
          <span style={{ marginBottom: '0' }}>Número de cuartos</span>
          <button className="color-icon" style={{ marginLeft:'8px'}}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input placeholder="Ingresar el número de cuartos" className='fondo-placeholder' style={{ width: '200px', resize: 'none' }} />
          </div>
      </div>
      </div>
      {/* Precio */}
      <div style={{ marginRight: '55px' }}>
          <span style={{ marginBottom: '0' }}>Precio</span>
          <button className="color-icon" style={{ marginLeft:'8px' }}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input placeholder="Precio" className='fondo-placeholder' style={{ width: '100px', resize: 'none' }} />
          </div>
      </div>
      {/* Periodo del contrato */}
      <div style={{ marginRight: '55px' }}>
          <span style={{ marginBottom: '0' }}>Periodo del contrato</span>
          <button className="color-icon" style={{ marginLeft:'8px'}}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <select style={{ width: '150px', fontSize: '16px', height:'30px' }} className="input-box">
                <option value="mensual">Mensual</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Tremestral</option>
                <option value="semestral">Semestral</option>
            </select>
          </div>
      </div>
      {/* Tipo de habitación */}
      <div>
          <span style={{ marginBottom: '0' }}>Tipo de vivienda</span>
          <button className="color-icon" style={{ marginLeft:'8px' }}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <select style={{ width: '150px', fontSize: '16px', height:'30px' }} className="input-box">
                <option value="compartida">Compartida</option>
                <option value="individual">Individual</option>
            </select>
          </div>
      </div>
      </div>

      {/* Reglamento */}
      <div style={{ marginRight: '35px', width: '620px', margin: '0 auto' }}>
          <span style={{marginLeft: '270px', marginBottom: '0' }}>Reglamento</span>
          <button className="color-icon" style={{ marginLeft:'8px' }}>
              <FontAwesomeIcon icon={faEdit} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <textarea placeholder="Ingresar reglamento" className='fondo-placeholder' style={{ width: '660px', height: '500px', resize: 'none' }} />
          </div>
        </div>
    </div>
    </div>
  );
}

export default EditarInmueble