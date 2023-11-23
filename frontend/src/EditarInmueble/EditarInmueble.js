import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditarInmueble() {
  const { id_inmueble } = useParams();
  const navigate = useNavigate();
  const [escuelas, setEscuelas] = useState([]);
  const [formData, setFormData] = useState({
    id: id_inmueble,
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
  });
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseInmueble = await axios.get(`http://localhost:3031/infoinmuebles/${id_inmueble}`);
        console.log('Información del inmueble:', responseInmueble.data);
        setFormData((prevData) => ({
          ...prevData,
          title: responseInmueble.data.titulo,
          address: responseInmueble.data.direccion,
          coordinates: responseInmueble.data.coordenadas,
          price: responseInmueble.data.precio,
          period: responseInmueble.data.periodo_de_renta,
          numRooms: responseInmueble.data.no_habitaciones,
          regulations: responseInmueble.data.reglamento,
          images: responseInmueble.data.foto,
          idEscuela: responseInmueble.data.id_escuela,
          privacyAccepted: responseInmueble.data.privacyAccepted || false,
        }));

        const responseEscuelas = await axios.get('http://localhost:3031/obtenerEscuelas');
        setEscuelas(responseEscuelas.data);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener información:', error);
      }
    };

    fetchData();
  }, [id_inmueble]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('coordinates', formData.coordinates);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('period', formData.period);
      formDataToSend.append('numRooms', formData.numRooms);
      formDataToSend.append('regulations', formData.regulations);
      formDataToSend.append('idEscuela', formData.idEscuela);
      await axios.put(`http://localhost:3031/editarinmueble/${id_inmueble}`, formDataToSend);

      navigate('/homearrendador');
    } catch (error) {
      console.error('Error al editar el inmueble:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="registro-inmueble-container">

      <div className="centered-content">
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '25px' }}>Editar inmueble</h1><br /><br />

        <h2 style={{ fontSize: '20px' }}>Título del anuncio</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{ width: '338px', marginBottom: '10px' }}
          placeholder="Ingresa el título del anuncio..."
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
            style={{ width: '338px', marginBottom: '10px', height: '49%' }}
            className="input-box"
          >
            {/* Mapear las opciones obtenidas de la base de datos */}
            {escuelas.map((escuela, index) => (
              <option key={index} value={escuela.id_escuela}> {escuela.nombre}</option>
            ))}
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
              <option value="mensual">Mensual</option>
              <option value="bimestral">Bimestral</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
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
          <input type="file" onChange={handleFile} />
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
          style={{ backgroundColor: '#422985', color: 'white', height: '60px', width: '108px', marginTop: '10px' }}
          onClick={handleEdit}
        >
          Editar Inmueble
        </button>
        </div>
      </div>
  );
  
  
  
  
  
}

export default EditarInmueble;
