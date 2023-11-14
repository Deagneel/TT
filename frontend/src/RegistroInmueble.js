import React from 'react';
import './Style.css'; 

function RegistroInmueble() {
  return (
    <div className="registro-inmueble-container">
      {/* Icono para cerrar ventana */}
      <button className="close-button">X</button>

      {/* Contenido centrado */}
      <div className="centered-content">
        <h1 style={{ fontSize: '28px', fontWeight:'bold', marginBottom: '25px'}}>Registrar nuevo inmueble</h1><br /><br />
        <h2 style={{ fontSize: '20px' }}>Titulo del anuncio</h2>
        <input type="text" style={{ width:'338px', marginBottom: '10px'}} placeholder="Ingresa el titulo del anuncio..." />

        <h2 style={{ fontSize: '20px' }}>Dirección</h2>
        <input type="text" style={{ width:'338px', marginBottom: '10px'}} className="input-box" placeholder="Ingrese la dirección" />

        <h2 style={{ fontSize: '20px' }}>Coordenadas de Google Maps</h2>
        <input type="text" style={{ width:'338px', marginBottom: '10px'}}  className="input-box" placeholder="Ingrese las coordenadas" />

        <div className="price-period">
          <div>
            <h2 style={{ fontSize: '20px', marginLeft:'49px' }}>Precio</h2>
            <input type="text" style={{marginRight: '40px', width:'150px'}} className="input-box" placeholder="Ingrese el precio" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', marginLeft:'39px'}}>Periodo</h2>
            <select style={{ width: '150px', fontSize: '16px', height:'49%' }} className="input-box">
                <option value="mensual">Mensual</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Tremestral</option>
                <option value="semestral">Semestral</option>
            </select>
          </div>

        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', marginRight: '10px', marginTop:'15px' }}>Número de habitaciones</h2>
            <input type="text" style={{ width:'113px', marginTop:'10px'}} className="small-input-box" placeholder="..." />
        </div>


        <h2 style={{ fontSize: '20px', marginTop:'15px' }}>Reglamento</h2>
        <textarea className="large-input-box" style={{ width:'338px', height:'200px', marginBottom: '25px'}} placeholder="Ingrese el reglamento"></textarea>

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', margin: '0' }}>Imágenes</h2>
            <button className="add-button" style={{ backgroundColor: '#422985', color: 'white', marginLeft: '10px' }}>Agregar</button>
        </div>
        <div className="image-names-container">
          {/* Aquí se mostrarán los nombres de las imágenes agregadas */}
        </div>

        <div className="privacy-policy">
          <input type="checkbox" id="privacy-checkbox" />
          <label htmlFor="privacy-checkbox" style={{ fontSize: '15px' }}>Acepto políticas de privacidad</label>
        </div>

        <button className="register-button" style={{backgroundColor:'#422985', color:'white', height:'43px', width:'108px', marginTop:'10px'}}>Registrar</button>
      </div>
    </div>
  );
}

export default RegistroInmueble