import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPauseCircle, faEdit } from '@fortawesome/free-solid-svg-icons';

function EditarInmueble() {
  return (
    <div style={{ marginLeft: '25px', marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' }}>Borrar publicación</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button className="delete-button" style={{ marginLeft:'45px', border: 'none', background: 'none', fontSize: '24px' }}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
        </div>

        <div style={{ marginRight: '45px' }}>
          <p style={{ marginBottom: '0' }}>Pausar publicación</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button className="pause-button" style={{ marginLeft:'45px', border: 'none', background: 'none', fontSize: '24px' }}>
              <FontAwesomeIcon icon={faPauseCircle} />
            </button>
          </div>
        </div>

        {/* Placeholder titulo */}
        <div style={{ marginLeft:'124px', flex: '1', display: 'flex', alignItems: 'center' }}>
          <input type="text" placeholder="Titulo de la publicación" style={{ width: '400px' }} />
          <button className="edit-button" style={{ border: 'none', background: 'none', fontSize: '24px' }}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </div>

      {/* Carrusel de imágenes */}
      <div style={{ marginTop: '1px', border: '1px solid #000', width: '480px', height: '200px', margin: '0 auto' }}>
  {/* Aquí irá el carrusel de imágenes */}
</div>

    </div>
  );
}

export default EditarInmueble;
