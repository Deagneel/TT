import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function Trato() {
  const { id_inmueble, id_usuario } = useParams();
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [inmuebleTitulo, setInmuebleTitulo] = useState('');
  const [idRenta, setIdRenta] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const usuarioResponse = await axios.get(`http://localhost:3031/obtenerUsuario/${id_usuario}`);
        const inmuebleResponse = await axios.get(`http://localhost:3031/obtenerInmueble/${id_inmueble}`);

        setUsuarioNombre(usuarioResponse.data.nombre);
        setInmuebleTitulo(inmuebleResponse.data.titulo);

        const rentadosResponse = await axios.get(`http://localhost:3031/obtenerIdRenta/${id_inmueble}`);
        setIdRenta(rentadosResponse.data.id_renta);
        
      } catch (error) {
        console.error('Error al obtener detalles:', error);
      }
    }

    fetchDetails();
  }, [id_inmueble, id_usuario]);

  const handleAceptarClic = async  () =>{
    try {
        const willDoTrato = await swal({
          title: "¿Seguro que quieres aceptar el trato?",
          text: "Se considerará a tu inmueble como rentado.",
          icon: "info",
          buttons: true,
          dangerMode: false,
        });
        if (willDoTrato) {
            await axios.put(`http://localhost:3031/actualizarEstado/${idRenta}`);
            await axios.put(`http://localhost:3031/restarHabitacion/${id_inmueble}`);
            await axios.put(`http://localhost:3031/actualizarEstadoInmueble/${id_inmueble}`);

          swal("Has aceptado el trato.", {
            icon: "success",
          });
          
        } else {
          swal("Operación Cancelada");
        }
      } catch (error) {
        console.error('Error al realizar el trato:', error);
      }
  }

  const handleDeclinarClic = async() =>{
    try {
        const willDoTrato = await swal({
          title: "¿Seguro que quieres declinar el trato?",
          text: "Se eliminará la solicitud.",
          icon: "info",
          buttons: true,
          dangerMode: false,
        });
        if (willDoTrato) {

          await axios.delete(`http://localhost:3031/eliminarRentado/${idRenta}`);
          
          swal("Has declinado el trato.", {
            icon: "success",
          });
          
        } else {
          swal("Operación Cancelada");
        }
      } catch (error) {
        console.error('Error al declinar el trato:', error);
      }
  }

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#999999' }}
    >
      <div
        className="shadow p-4 text-center"
        style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '600px', width: '80%' }}
      >
        <h3>Detalles del trato</h3>
        <div className="mb-3">Usuario interesado: {usuarioNombre}</div>
        <div className="mb-3">Inmueble: {inmuebleTitulo}</div>
        <button className="btn btn-primary me-3" onClick={handleAceptarClic}>Hacer trato</button>
        <button className="btn btn-danger" onClick={handleDeclinarClic}>Declinar trato</button>
      </div>
    </div>
  );
  
  
}

export default Trato;
