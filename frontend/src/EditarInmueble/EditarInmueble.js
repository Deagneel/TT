import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';
import { faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function EditarInmueble() {
  
  const [aceptarTerminos, setAceptarTerminos] = useState(false);

  const handleCheckbox = () => {
    setAceptarTerminos(!aceptarTerminos);
  };
  const { id_inmueble } = useParams();
  const navigate = useNavigate();
  const [escuelas, setEscuelas] = useState([]);
  const [formData, setFormData] = useState({
    id: id_inmueble,
    title: '',
    address: '',
    cp: '',
    alcaldia: '',
    latitud: '',
    longitud: '',
    price: '',
    period: 'mensual',
    numRooms: '',
    regulations: '',
    images: '',
    idEscuela: '',
    privacyAccepted: false,
    Tvivienda: '',
    activo: '',
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
          cp: responseInmueble.data.cp,
          alcaldia: responseInmueble.data.alcaldia,
          latitud: responseInmueble.data.latitud,
          longitud: responseInmueble.data.longitud,
          price: responseInmueble.data.precio,
          period: responseInmueble.data.periodo_de_renta,
          numRooms: responseInmueble.data.no_habitaciones,
          regulations: responseInmueble.data.reglamento,
          images: responseInmueble.data.foto,
          idEscuela: responseInmueble.data.id_escuela,
          Tvivienda: responseInmueble.data.tipo_de_habitacion,
          activo: responseInmueble.data.activo_usuario,
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
      formDataToSend.append('cp', formData.cp);
      formDataToSend.append('alcaldia', formData.alcaldia);
      formDataToSend.append('latitud', formData.latitud);
      formDataToSend.append('longitud', formData.longitud);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('period', formData.period);
      formDataToSend.append('numRooms', formData.numRooms);
      formDataToSend.append('regulations', formData.regulations);
      formDataToSend.append('idEscuela', formData.idEscuela);
      formDataToSend.append('Tvivienda', formData.Tvivienda);
      formDataToSend.append('activo', formData.activo);
      await axios.put(`http://localhost:3031/editarinmueble/${id_inmueble}`, formDataToSend);

      swal("Datos Actualizados Correctamente", " ", "success");
      navigate('/homearrendador');
    } catch (error) {
      console.error('Error al editar el inmueble:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  const handlePause = async () => {
    try {
      console.log('Valor actual de activo:', formData.activo);
      const updatedData = {
        ...formData,
        activo: formData.activo == '1' ? '0' : '1', // Cambiar el valor de activo
      };
  
      // Realizar la petición PUT con todos los campos existentes y activo actualizado
      await axios.put(`http://localhost:3031/editarinmueble/${id_inmueble}`, updatedData);
  
      swal("Inmueble actualizado correctamente", "", "success");
      navigate('/homearrendador');
    } catch (error) {
      console.error('Error al actualizar el inmueble:', error);
    }
  };
  
  
  const handleDelete = () => {
    // Lógica para eliminar el inmueble
    // ...
  };


  return (
    <div className="registro-inmueble-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontWeight: 'bold', margin: '0' }}>
              {formData.activo == '1' ? 'Activar inmueble' : 'Pausar inmueble'}
            </p>
            <button onClick={handlePause} style={{ marginTop: '10px' }}>
              <FontAwesomeIcon icon={faPause} />
            </button>
          </div>
          <div style={{ width: '80px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontWeight: 'bold', margin: '0' }}>Eliminar inmueble</p>
            <button onClick={handleDelete} style={{ marginTop: '10px' }}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
      </div>

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
        <h2 style={{ fontSize: '20px' }}>Código Postal</h2>
        <input
          type="text"
          name="cp"
          value={formData.cp}
          onChange={handleChange}
          style={{ width: '338px', marginBottom: '10px' }}
          className="input-box"
          placeholder="Ingrese el código postal"
        />
        <h2 style={{ fontSize: '20px' }}>Alcaldía</h2>
        <input
          type="text"
          name="alcaldia"
          value={formData.alcaldia}
          onChange={handleChange}
          style={{ width: '338px', marginBottom: '10px' }}
          className="input-box"
          placeholder="Ingrese la Alcaldía"
        />
        <h2 style={{ fontSize: '20px' }}>Latitud</h2>
        <input
          type="text"
          name="latitud"
          value={formData.latitud}
          onChange={handleChange}
          style={{ width: '338px', marginBottom: '10px' }}
          className="input-box"
          placeholder="Ingrese la Latitud"
        />
        <h2 style={{ fontSize: '20px' }}>Longitud</h2>
        <input
          type="text"
          name="longitud"
          value={formData.longitud}
          onChange={handleChange}
          style={{ width: '338px', marginBottom: '10px' }}
          className="input-box"
          placeholder="Ingrese la longitud"
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

        <div>
          <h2 style={{ fontSize: '20px', marginLeft: '99px' }}>Tipo de vivienda</h2>
          <select
            name="Tvivienda"
            value={formData.Tvivienda}
            onChange={handleChange}
            style={{ width: '338px', marginBottom: '10px',  height: '49%'  }}
            className="input-box"
          >
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
          <input type="file" onChange={handleFile} />
        </div>

        <div className="privacy-policy">
          <input
            type="checkbox"
            name="aceptar_terminos"
            onChange={handleCheckbox}
            checked={aceptarTerminos}
          />
          <label htmlFor="aceptar_terminos" style={{ fontSize: '15px' }}>Acepto políticas de privacidad</label>
        </div>

        <button
          className="register-button"
          style={{ backgroundColor: '#422985', color: 'white', height: '43px', width: '108px', marginTop: '10px', opacity: aceptarTerminos ? '1' : '0.5',
          pointerEvents: aceptarTerminos ? 'auto' : 'none' }}
          onClick={handleEdit}
          disabled={!aceptarTerminos}
        >
          Editar
        </button>
        </div>
      </div>
  );

}

export default EditarInmueble;
