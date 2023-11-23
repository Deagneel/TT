

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


function RegistroInmueble() {

  axios.defaults.withCredentials = true;
  const [escuelas, setEscuelas] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3031/obtenerEscuelas')
      .then(response => {
        setEscuelas(response.data); // Establecer los nombres de las escuelas en el estado
      })
      .catch(error => {
        console.error('Error al obtener las escuelas:', error);
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    coordinates: '',
    price: '',
    period: 'mensual',
    numRooms: '',
    regulations: '',
    images: '',
    idEscuela: '',
    privacyAccepted: false,
    Tvivienda: '',
  });

  const [file, setFile] = useState();

  const navigate = useNavigate();
  const[errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleImageAdd = () => {
    const formdata = new FormData();
    formdata.append('image', file);
    axios.post('http://localhost:3031/upload', formdata)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  };

  const handleRegister = async () => {

    try {
      // Handle image upload
    const formImage = new FormData();
    formImage.append('image', file);
    const imageResponse = await axios.post('http://localhost:3031/upload', formImage);
    console.log(imageResponse.data);

      const response = await axios.post('http://localhost:3031/registroinmueble', {
        title: formData.title,
        address: formData.address,
        coordinates: formData.coordinates,
        price: formData.price,
        period: formData.period,
        numRooms: formData.numRooms,
        regulations: formData.regulations,
        images: imageResponse.data.url,
        idEscuela: formData.idEscuela,
        Tvivienda: formData.Tvivienda,
      });

      console.log(response.data);
  
        if (response.data.error) {
          console.log('Error al registrar inmueble:', response.data.error);
          return;
        }
  
        navigate('/homearrendador');

      
      // Manejar la respuesta del servidor según sea necesario

    } catch (error) {
      console.error('Error al enviar la solicitud al servidor:', error);

    }
  };

  const handleregresarClick = () => {
    // Manejar la acción cuando se hace clic en cerrar
    navigate('/homearrendador');
  };

  return (
    <div className="registro-inmueble-container">
    {/* Icono para cerrar ventana */}
    <nav style={{position: 'absolute', top: 0, left: 0}}>
      <a href="/homearrendador" style={{color: 'purple', fontSize: '20px', padding: '10px'}}>Regresar</a>
    </nav>





    {/* Contenido centrado */}
    <div className="centered-content">
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '25px' }}>Registrar nuevo inmueble</h1><br /><br />

      <h2 style={{ fontSize: '20px' }}>Titulo del anuncio</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        style={{ width: '338px', marginBottom: '10px' }}
        placeholder="Ingresa el titulo del anuncio..."
      />

      <h2 style={{ fontSize: '20px' }}>Dirección</h2>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        style={{ width: '338px', marginBottom: '10px' }}
        className="input-box"
        placeholder="Ingrese la dirección"
      />

      <h2 style={{ fontSize: '20px' }}>Coordenadas de Google Maps</h2>
      <input
        type="text"
        name="coordinates"
        value={formData.coordinates}
        onChange={handleChange}
        style={{ width: '338px', marginBottom: '10px' }}
        className="input-box"
        placeholder="Ingrese las coordenadas"
      />
      <div>
          <h2 style={{ fontSize: '20px', marginLeft: '100px' }}>Escuela cercana</h2>
          <select
            name="idEscuela"
            value={formData.idEscuela}
            onChange={handleChange}
            style={{ width: '338px', marginBottom: '10px',  height: '49%' }}
            className="input-box"
          >
            <option value="">Selecciona una escuela</option>
            {/* Mapear las opciones obtenidas de la base de datos */}
            {escuelas.map((escuela, index) => (
              <option key={index} value={escuela.id_escuela}> {escuela.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', marginLeft: '99px' }}>Tipo de vivienda</h2>
          <select
            name="Tvivienda"
            value={formData.Tvivienda}
            onChange={handleChange}
            style={{ width: '338px', marginBottom: '10px',  height: '49%'  }}
            className="input-box"
          >
            <option value="">Selecciona un tipo de vivienda</option>
            <option value="0">Individual</option>
            <option value="1">Compartida</option>
          </select>
        </div>

      <div className="price-period">
        <div>
          <h2 style={{ fontSize: '20px', marginLeft: '49px' }}>Precio</h2>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{ marginRight: '40px', width: '150px' }}
            className="input-box"
            placeholder="Ingrese el precio"
          />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', marginLeft: '39px' }}>Periodo</h2>
          <select
            name="period"
            value={formData.period}
            onChange={handleChange}
            style={{ width: '150px', fontSize: '16px', height: '49%' }}
            className="input-box"
          >
            <option value="">Selecciona un periodo</option>
            <option value="Mensual">Mensual</option>
            <option value="Bimestral">Bimestral</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Cuatrimestral">Cuatrimestral</option>
            <option value="Semestral">Semestral</option>
            <option value="Anual">Anual</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', marginRight: '10px', marginTop: '15px' }}>Número de habitaciones</h2>
        <input
          type="text"
          name="numRooms"
          value={formData.numRooms}
          onChange={handleChange}
          style={{ width: '113px', marginTop: '10px' }}
          className="small-input-box"
          placeholder="..."
        />
      </div>

      <h2 style={{ fontSize: '20px', marginTop: '15px' }}>Reglamento</h2>
      <textarea
        name="regulations"
        value={formData.regulations}
        onChange={handleChange}
        className="large-input-box"
        style={{ width: '338px', height: '200px', marginBottom: '25px', resize: 'none' }}
        placeholder="Ingrese el reglamento"
      ></textarea>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', margin: '0' }}>Imagen</h2>
        <input type = "file" onChange={handleFile}/>
      </div>

      <div className="privacy-policy">
        <input
          type="checkbox"
          id="privacy-checkbox"
          name="privacyAccepted"
          checked={formData.privacyAccepted}
          onChange={handleChange}
        />
        <label htmlFor="privacy-checkbox" style={{ fontSize: '15px' }}>Acepto políticas de privacidad</label>
      </div>

      <button
        className="register-button"
        style={{ backgroundColor: '#422985', color: 'white', height: '43px', width: '108px', marginTop: '10px' }}
        onClick={handleRegister}
      >
        Registrar
      </button>
    </div>
  </div>

  );
}

export default RegistroInmueble;
