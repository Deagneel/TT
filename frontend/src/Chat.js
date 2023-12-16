import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatEngine, ChatList, ChatFeed } from 'react-chat-engine';
import swal from 'sweetalert';

function Chat() {
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3031')
      .then(res => {
        if (res.data.valid) {
          setCorreo(res.data.nombre);
        } else {
          swal('Necesitas iniciar sesión para acceder a esta función');
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        swal('Error al verificar la autenticación');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <ChatEngine
        height='100vh'
        projectID='1059213f-c0e8-48fe-a49c-8bfe9a8fb1a3'
        userName={correo}
        userSecret={correo}
        renderChatList={(chatAppState) => <ChatList {...chatAppState} />}
        renderChatFeed={(chatAppState) => <ChatFeed {...chatAppState} />}
        renderChatSettings={() => null}
        renderNewChatForm={() => null}
      />
    </>
  );
}

export default Chat;
