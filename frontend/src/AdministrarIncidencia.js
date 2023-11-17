import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';

function Navbar() {
  const handleBackClick = () => {
    // Manejar la acción cuando se hace clic en el botón de "Regresar"
    console.log('Clic en Regresar');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        <button className="white-text-button" onClick={handleBackClick}>Regresar</button>
      </div>
    </div>
  );
}

function PageContent() {
  const incidencia = {
    numero: '12345',
    contenido: 'Descripción detallada de la incidencia...',
    usuario: 'Usuario Asociado',
    inmueble: 'Inmueble Asociado',
  };

  return (
    <div style={{ backgroundColor: '#E6E6FA', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
      <h2>Número de Incidencia: {incidencia.numero}</h2>
      <div style={{ backgroundColor: '#C7B3FF', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
        <p>{incidencia.contenido}</p>
      </div>
      <p>Usuario Asociado: {incidencia.usuario}</p>
      <p>Inmueble Asociado: {incidencia.inmueble}</p>
      <div style={{ marginTop: '15px' }}>
        <button style={{ marginRight: '10px' }}>Contactar con el Usuario Reportado</button>
        <button>Incidencia Resuelta</button>
      </div>
    </div>
  );
}

function AdministrarIncidencia() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <PageContent />
    </div>
  );
}

export default AdministrarIncidencia;
