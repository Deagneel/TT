import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function Trato() {
  const { id_arrendador,id_inmueble, id_usuario } = useParams();
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [inmuebleTitulo, setInmuebleTitulo] = useState('');
  const [idRenta, setIdRenta] = useState(null);
  const [correoV, setcorreoV] = useState(null);
  const [correoT, setcorreoT] = useState(null);
  const [documentosUsuario, setDocumentosUsuario] = useState({});

  useEffect(() => {
    async function fetchDetails() {
      try {
        const usuarioResponse = await axios.get(`http://localhost:3031/obtenerUsuario/${id_usuario}`);
        const inmuebleResponse = await axios.get(`http://localhost:3031/obtenerInmueble/${id_inmueble}`);
        const usuariocoreoResponse = await axios.get(`http://localhost:3031/obtenerCorreoUsuario/${id_arrendador}`);
        const usuarioArrendatarioResponse = await axios.get(`http://localhost:3031/obtenerCorreoUsuario/${id_usuario}`);
        const documentosResponse = await axios.get(`http://localhost:3031/obtenerDocumentosUsuario/${id_usuario}`);
        const documentos = documentosResponse.data;

        setDocumentosUsuario(documentos);
        setUsuarioNombre(usuarioResponse.data.nombre);
        setInmuebleTitulo(inmuebleResponse.data.titulo);
        const correoUsuario = usuariocoreoResponse.data[0].correo; // Acceder al correo dentro del objeto en la primera posición del array
        setcorreoV(correoUsuario);

        const correoArrendatario = usuarioArrendatarioResponse.data[0].correo; // Acceder al correo dentro del objeto en la primera posición del array
        setcorreoT(correoArrendatario);


        const rentadosResponse = await axios.get(`http://localhost:3031/obtenerIdRenta/${id_inmueble}`);
        setIdRenta(rentadosResponse.data.id_renta);
        
      } catch (error) {
        console.error('Error al obtener detalles:', error);
      }
    }

    fetchDetails();
  }, [id_arrendador,id_inmueble, id_usuario]);

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

            //Envio del correo con datos del arrendatario
            await axios.post(`http://localhost:3031/enviarCorreoDocumentacion`, {
              correoV,
              identificacion_oficial: documentosUsuario.identificacion_oficial,
              comprobante_de_domicilio: documentosUsuario.comprobante_de_domicilio,
              credencial_de_estudiante: documentosUsuario.credencial_de_estudiante,
              comprobante_de_inscripcion: documentosUsuario.comprobante_de_inscripcion,
            });

            await axios.post(`http://localhost:3031/enviarCorreoReporte`, {
              correoV,
              id_usuario,
              usuarioNombre,
              inmuebleTitulo,
            });
            
            //Envio de correo para calificar
            await axios.post(`http://localhost:3031/enviarCorreoResena`, {
              correoT,
              id_inmueble,
            });

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
