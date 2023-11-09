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

function PerfilArrendador() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', height: '89%' }}>
        <div style={{ flex: '0 0 60%', borderRight: '3px solid #422985' }}>
          {/* Contenido del lado izquierdo */}
          <PageContent />
        </div>
        <div style={{ flex: '1', backgroundColor: '#C7B3FF' }}>
          {/* Contenido del lado derecho */}
        </div>
      </div>
    </div>
  );
}

export default PerfilArrendador