// InfoInmueble.js

import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';

const InfoInmueble = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.buttonContainer}>
          <button style={styles.button}>
            Me interesa <i className="fa fa-envelope"></i>
          </button>
          <button style={styles.button}>
            Reportar <i className="fa fa-exclamation-triangle"></i>
          </button>
        </div>
        <div style={styles.closeButton}>X</div>
      </div>

      <div style={styles.titulo}>
        <h1>Título del Inmueble</h1>
      </div>

      <div style={styles.fotos}>
        {[
          { image: 'url1', content: 'Contenido 1' },
          { image: 'url2', content: 'Contenido 2' }
        ].map((foto, index) => (
          <div key={index} style={{ backgroundImage: `url(${foto.image})`, content: foto.content, ...styles.foto }} />
        ))}
      </div>

      <div style={styles.caracteristicas}>
        <div style={styles.seccion}>
          <div style={styles.direccion}>Dirección: Calle X, Ciudad Y</div>
          <div style={styles.coordenadas}>Coordenadas: (latitud, longitud)</div>
        </div>
        <div style={styles.seccion}>
          <div style={styles.precio}>Precio: $100,000</div>
          <div style={styles.contrato}>Periodo del Contrato: 1 año</div>
          <div style={styles.habitacion}>Tipo de Habitación: Dormitorio</div>
          <div style={styles.reglamento}>Reglamento: Lorem ipsum...</div>
        </div>
      </div>

      <div style={styles.reseñas}>
        <h2>Reseñas</h2>
        <div style={styles.estrellas}>
          <div style={styles.arrendador}>Arrendador: 4 estrellas</div>
          <div style={styles.fachada}>Condiciones de la Fachada: 3 estrellas</div>
          <div style={styles.servicios}>Eficiencia de los servicios básicos: 5 estrellas</div>
          <div style={styles.seguridad}>Seguridad de la zona: 4 estrellas</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#D6D6D6', // Fondo gris claro
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8a2be2', // Color morado oscuro
    color: '#fff',
    padding: '10px',
    marginRight: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
  },
  closeButton: {
    cursor: 'pointer',
    fontSize: '20px',
  },
  titulo: {
    textAlign: 'center',
    margin: '20px 0',
  },
  fotos: {
    display: 'flex',
    marginBottom: '20px',
  },
  foto: {
    width: '50%', // Ajusta el ancho según tus necesidades
    height: '200px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    padding: '10px',
    margin: '5px',
    borderRadius: '5px',
  },
  caracteristicas: {
    display: 'flex',
    marginBottom: '20px',
  },
  seccion: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginRight: '20px',
  },
  reseñas: {
    marginBottom: '20px',
  },
  estrellas: {
    display: 'flex',
    flexDirection: 'column',
  },
  arrendador: {
    marginBottom: '10px',
  },
  fachada: {
    marginBottom: '10px',
  },
  servicios: {
    marginBottom: '10px',
  },
  seguridad: {
    marginBottom: '10px',
  },
};

export default InfoInmueble;
