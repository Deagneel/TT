import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';

function Navbar() {
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
        <input type="text" placeholder="Buscar" style={{ width: '175%' }} />
      </div>
      <div>
        <button className="white-text-button" style={{ marginRight: '75px' }}>Perfil</button>
        <i className="fa fa-bell icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}

function PageContent() {
    // Aquí debes obtener la información de la base de datos y mapearla en rectángulos
    const rectangles = [
      { image: 'url1', content: 'Contenido 1' },
      { image: 'url2', content: 'Contenido 2' },
      // ... Puedes agregar más elementos según la información de la base de datos
    ];
  
    return (
      <div style={{ height: '50%' }}>
        {rectangles.map((rectangle, index) => (
          <div key={index} className="rectangle">
            <img src={rectangle.image} alt="Imagen" />
            <p>{rectangle.content}</p>
          </div>
        ))}
      </div>
    );
  }

function BuscarArrendador() {
  return (
    <div style={{ height: '100vh' }}>
      <Navbar />
      <PageContent />
    </div>
  );
}

export default BuscarArrendador