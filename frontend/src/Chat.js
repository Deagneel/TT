import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';

function Navbar() {
  const handleBackClick = () => {
    // Manejar la acción cuando se hace clic en el botón de "Regresar"
    console.log('Clic en Regresar');
  };

  const handleBellClick = () => {
    // Manejar la acción cuando se hace clic en el ícono de la campana (bell)
    console.log('Clic en la campana');
  };

  const handleEnvelopeClick = () => {
    // Manejar la acción cuando se hace clic en el ícono del sobre (envelope)
    console.log('Clic en el sobre');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        <button className="white-text-button" onClick={handleBackClick}>Regresar</button>
      </div>
      <div>
        <i className="fa fa-bell icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}

function PageContent() {
  // ... (sin cambios)
}

function Chat() {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ display: 'flex', height: '89%' }}>
          <div style={{ flex: '0 0 30%', backgroundColor: '#C7B3FF', borderRight: '3px solid #422985' }}>
            {/* Contenido del lado izquierdo */}
            <PageContent />
          </div>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Barra en la parte superior */}
            <div style={{ backgroundColor: '#D6D6D6', height: '12%', display: 'flex', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px', justifyContent: 'flex-end', position: 'absolute', top: 0, left: 0, right: 0 }}>
              <div style={{ marginLeft: 'auto' }}>
                <button style={{ marginRight: '30px', backgroundColor:'#808080' }}>Hacer trato</button>
                <i className="fa fa-exclamation-triangle icon-button" style={{ fontSize: '28px', color: '#422985', cursor: 'pointer' }}></i>
              </div>
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column'}}>
              {/* Sección para escribir mensajes y botón de enviar */}
              <div style={{ height: '11%', backgroundColor: '#D6D6D6', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <input type="text" style={{ height: '100%',flex: '1', marginRight: '15px', padding: '10px' }} placeholder="Escribe tu mensaje..." />
                <i className="fa fa-paper-plane icon-button" style={{ marginRight: '10px', fontSize: '25px', color: '#422985', cursor: 'pointer' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Chat;
