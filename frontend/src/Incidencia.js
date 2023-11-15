import React from 'react';

function Incidencia() {
  return (
    <div
      style={{
        background: '#f2f2f2', // Color gris de fondo
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Altura completa de la ventana
      }}
    >
      <div
        style={{
          width: '400px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Icono para cerrar ventana */}
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            float: 'right',
          }}
        >
          X
        </button>

        {/* Contenido centrado */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '25px' }}>Reportar Incidencia</h1>

          <h2 style={{ fontSize: '20px' }}>Asunto</h2>
          <input type="text" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} placeholder="Ingresa el asunto de la incidencia..." />

          <h2 style={{ fontSize: '20px' }}>Descripción</h2>
          <textarea
            style={{ width: '100%', height: '300px', marginBottom: '25px', padding: '8px', resize: 'none' }}
            placeholder="Describe la incidencia en detalle..."
          ></textarea>

          <div style={{ marginBottom: '15px' }}>
            <input type="checkbox" id="privacy-checkbox" />
            <label htmlFor="privacy-checkbox" style={{ fontSize: '15px', marginLeft: '5px' }}>Acepto políticas de privacidad</label>
          </div>

          <button
            style={{
              backgroundColor: '#422985',
              color: 'white',
              height: '43px',
              width: '100%',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Reportar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Incidencia;
