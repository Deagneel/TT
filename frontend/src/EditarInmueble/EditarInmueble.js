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
    <div className="container-fluid" style={{ background: 'mediumpurple', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="registro-inmueble-container" style={{ background: 'white', padding: '20px', borderRadius: '8px'}}>
            <div className="centered-content">
              <h1 className="display-4 font-weight-bold mb-4" style={{ fontSize: '24px' }}>Editar inmueble</h1>
  
              <div className="form-group">
                <label htmlFor="title" className="h2" style={{ fontSize: '20px' }}>Título del anuncio</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Ingresa el título del anuncio..."
                  style={{ width: '500px', maxWidth: '100%' }}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="address" className="h2" style={{ fontSize: '20px' }}>Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Ingrese la dirección"
                  style={{ width: '500px', maxWidth: '100%' }}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="coordinates" className="h2" style={{ fontSize: '20px' }}>Coordenadas de Google Maps</label>
                <input
                  type="text"
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Ingrese las coordenadas"
                  style={{ width: '500px', maxWidth: '100%' }}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="idEscuela" className="h2" style={{ fontSize: '20px' }}>Escuela cercana</label>
                <select
                  name="idEscuela"
                  value={formData.idEscuela}
                  onChange={handleChange}
                  className="form-control mb-3"
                  style={{ width: '500px', maxWidth: '100%' }}
                >
                  {/* Mapear las opciones obtenidas de la base de datos */}
                  {escuelas.map((escuela, index) => (
                    <option key={index} value={escuela.id_escuela}>{escuela.nombre}</option>
                  ))}
                </select>
              </div>
  
              <div className="form-group">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="price" className="h2" style={{ fontSize: '20px' }}>Precio</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder="Ingrese el precio"
                      style={{ width: '500px', maxWidth: '100%' }}
                    />
                  </div>
  
                  <div className="col-md-6">
                    <label htmlFor="period" className="h2" style={{ fontSize: '20px' }}>Periodo</label>
                    <select
                      name="period"
                      value={formData.period}
                      onChange={handleChange}
                      className="form-control mb-3"
                      style={{ width: '500px', maxWidth: '100%' }}
                    >
                      <option value="mensual">Mensual</option>
                      <option value="bimestral">Bimestral</option>
                      <option value="trimestral">Trimestral</option>
                      <option value="semestral">Semestral</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div className="form-group">
                <label htmlFor="numRooms" className="h2" style={{ fontSize: '20px' }}>Número de habitaciones</label>
                <input
                  type="text"
                  name="numRooms"
                  value={formData.numRooms}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="..."
                  style={{ width: '500px', maxWidth: '100%' }}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="regulations" className="h2" style={{ fontSize: '20px' }}>Reglamento</label>
                <textarea
                  name="regulations"
                  value={formData.regulations}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Ingrese el reglamento"
                  style={{ width: '500px', maxWidth: '100%', height: '200px', resize: 'none' }}
                ></textarea>
              </div>
  
              <div className="form-group">
                <label htmlFor="image" className="h2" style={{ fontSize: '20px' }}>Imagen</label>
                <input type="file" onChange={handleFile} className="form-control-file mb-3" style={{ width: '100%', maxWidth: '100%' }} />
              </div>
  
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="privacy-checkbox" className="form-check-label">Acepto políticas de privacidad</label>
              </div>
  
              <button
                className="btn btn-primary"
                style={{ marginTop: '15px', fontSize: '18px', width: '100%', maxWidth: '100%' }}
                onClick={handleEdit}
              >
                Editar Inmueble
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  
  
  
}

export default EditarInmueble;
