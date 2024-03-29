import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';

function Navbar() {
  const handleBellClick = () => {
    console.log('Clic en la campana');
  };

  const handleEnvelopeClick = () => {
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
  const rectangles = [

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

function ListaInmuebles() {
  const handleSelectChange = (event, type) => {
    console.log(`Nuevo valor seleccionado para ${type}: ${event.target.value}`);
    // Aquí puedes realizar acciones adicionales según el cambio en los selects
  };

  return (
    <div style={{ height: '100vh' }}>
      <Navbar />
        <div style={{ backgroundColor: '#808080', display: 'flex', justifyContent: 'space-between', height: '8%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '50px' }}>
        <label htmlFor="precio" style={{ color: 'white' }}>Precio:</label>
            <select id="precio" className="white-text-select" onChange={(e) => handleSelectChange(e, 'precio')}>
            <option value="1">Precio 1</option>
            <option value="2">Precio 2</option>
            <option value="3">Precio 3</option>
            </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="distancia" style={{ color: 'white' }}>Distancia:</label>
            <select id="distancia" className="white-text-select" onChange={(e) => handleSelectChange(e, 'distancia')}>
            <option value="1">Distancia 1</option>
            <option value="2">Distancia 2</option>
            <option value="3">Distancia 3</option>
            </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '50px' }}>
            <label htmlFor="tipoHabitacion" style={{ color: 'white' }}>Tipo de Habitación:</label>
            <select id="tipoHabitacion" className="white-text-select" onChange={(e) => handleSelectChange(e, 'tipoHabitacion')}>
            <option value="1">Tipo 1</option>
            <option value="2">Tipo 2</option>
            <option value="3">Tipo 3</option>
            </select>
        </div>
        </div>
        <PageContent />
        </div>

  );
}

export default ListaInmuebles;