import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const CalificaInmuebleArrendador = () => {
  const navigate = useNavigate();
  const [fachada, setFachada] = useState(0);
  const [servicios, setServicios] = useState(0);
  const [seguridad, setSeguridad] = useState(0);
  const [trato, setTrato] = useState(0);
  const [inmuebleInfo, setInmuebleInfo] = useState({});
  const [idUsuario, setIdUsuario] = useState(null); // Initialize idUsuario state

  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id_inmueble');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id,
      fachada,
      servicios,
      seguridad,
      trato,
      idUsuario,
    };

    try {
      const response = await axios.post('http://localhost:3031/evaluarinmueble', data);
      console.log('Reseñas enviadas:', response.data);
      swal("Reseña Enviada", "Gracias, tu opinión es muy importante.", "success");
      navigate('/home');
    } catch (error) {
      console.error('Error al enviar las reseñas:', error.message);
      // Puedes agregar una lógica para mostrar un mensaje de error al usuario.
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3031/obtenerInmuebleInfo/${id}`)
      .then(response => {
        console.log('Inmueble info response:', response.data);
        setInmuebleInfo(response.data[0]);
        setIdUsuario(response.data[0].id_usuario); // Access the object at index 0
      })
      .catch(error => {
        console.error('Error al obtener la información del inmueble:', error.message);
      });
  }, [id]);

  if (!inmuebleInfo) {
    return <div>Loading...</div>; // or render a loading spinner
  }


  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#8e44ad' }}>
      <form className="card p-5" onSubmit={handleSubmit}>
        <h2 className="mb-4">Califica tu Experiencia</h2>
        <div className="mb-3">
          <label htmlFor="fachada" className="form-label">Condiciones de la fachada:</label>
          <select
            id="fachada"
            className="form-select"
            value={fachada}
            onChange={(e) => setFachada(parseInt(e.target.value, 10))}
          >
            <option value={0}>Selecciona...</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="servicios" className="form-label">Eficiencia de los servicios básicos:</label>
          <select
            id="servicios"
            className="form-select"
            value={servicios}
            onChange={(e) => setServicios(parseInt(e.target.value, 10))}
          >
            <option value={0}>Selecciona...</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="seguridad" className="form-label">Seguridad de la zona del inmueble:</label>
          <select
            id="seguridad"
            className="form-select"
            value={seguridad}
            onChange={(e) => setSeguridad(parseInt(e.target.value, 10))}
          >
            <option value={0}>Selecciona...</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="trato" className="form-label">Trato brindado por el arrendador:</label>
          <select
            id="trato"
            className="form-select"
            value={trato}
            onChange={(e) => setTrato(parseInt(e.target.value, 10))}
          >
            <option value={0}>Selecciona...</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>

      <div className="card p-5 ms-3">
        <h2>Detalles del Inmueble</h2>
        {inmuebleInfo && (
          <div>
            <img src={'http://localhost:3031/images/'+inmuebleInfo.foto}  alt="Imagen" style={{ width: '550px', height: '270px'}} />
          </div>
        )}
        {inmuebleInfo && (
          <div className="mt-3">
            <h3>Dirección del Inmueble</h3>
            <p>{inmuebleInfo.direccion}</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default CalificaInmuebleArrendador;
