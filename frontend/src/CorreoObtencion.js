// En tu componente CorreoObtencion.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat'; // Importa el componente Chat

function CorreoObtencion() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState(null); // Estado para almacenar el correo
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3031')
      .then(res => {
        if (res.data.valid) {
          setCorreo(res.data.nombre); // Establece el correo en el estado
        } else {
          swal('Necesitas iniciar sesión para acceder a esta función');
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        swal('Error al verificar la autenticación');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Una vez que se obtenga el correo, renderiza el componente Chat y pásale el correo como prop
  return correo ? <Chat correo={correo} /> : null;
}

export default CorreoObtencion;
