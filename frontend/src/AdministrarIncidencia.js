import React, { useEffect, useState } from 'react';
import './Style.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/homeadministrador');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        <button className="white-text-button" onClick={handleBackClick}>Regresar</button>
      </div>
    </div>
  );
}

function PageContent() {
  const navigate = useNavigate();
  const [reporte, setReporte] = useState(null);
  const { id_reporte } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3031/obtenerReporteesp/${id_reporte}`)
      .then(response => {
        setReporte(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el reporte:', error);
      });
  }, [id_reporte]);

  useEffect(() => {
    const obtenerInformacionAdicional = async () => {
      if (reporte) {
        try {
          const [usuario, inmueble] = await Promise.all([
            obtenerNombreUsuario(reporte.id_usuario),
            obtenerTituloInmueble(reporte.id_inmueble)
          ]);
          const reporteConInfoAdicional = { ...reporte, usuario, inmueble };
          setReporte(reporteConInfoAdicional);
        } catch (error) {
          console.error('Error al obtener información adicional:', error);
        }
      }
    };

    obtenerInformacionAdicional();
  }, [reporte]);

  const obtenerNombreUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3031/obtenerNombreUsuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      return 'Usuario no encontrado';
    }
  };

  const obtenerTituloInmueble = async (idInmueble) => {
    try {
      const response = await axios.get(`http://localhost:3031/obtenerTituloInmueble/${idInmueble}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el título del inmueble:', error);
      return 'Inmueble no encontrado';
    }
  };

  if (!reporte) {
    return <p>El reporte no se ha encontrado.</p>;
  }

  const handleresultoClick = async () => {
    try {
      // Realizar una solicitud para actualizar el estado del reporte a 1
      await axios.put(`http://localhost:3031/actualizarEstado/${id_reporte}`, { estado: 1 });
      navigate('/homeadministrador');
    } catch (error) {
      console.error('Error al actualizar el estado del reporte:', error);
    }
  };

  return (
    <div style={{ marginLeft: '30px', backgroundColor: '#E6E6FA', padding: '20px', marginTop: '50px', borderRadius: '8px', width: '95%' }}>
      <h2># {reporte.id_reporte}</h2>
      <p>Asunto: {reporte.asunto}</p>
      <div style={{ backgroundColor: '#C7B3FF', padding: '10px', borderRadius: '8px', marginTop: '10px', marginBottom: '10px' }}>
        <p>{reporte.descripción}</p>
        <p>Fecha del reporte: {reporte.fecha}</p>
      </div>
      <p>Usuario asociado: {reporte.usuario}</p>
      {reporte.inmueble !== 'Inmueble no encontrado' && reporte.inmueble && (
        <p>Inmueble asociado: {reporte.inmueble}</p>
      )}
      <div style={{ marginTop: '35px', display: 'flex' }}>
        <button style={{ marginRight: 'auto', border: '2px solid #422985' }}>Contactar al usuario</button>
        <button style={{ marginLeft: 'auto', border: '2px solid #422985' }} onClick={handleresultoClick}>Incidencia resuelta</button>
      </div>
    </div>
  );
}


function AdministrarIncidencia() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <PageContent />
    </div>
  );
}

export default AdministrarIncidencia;
