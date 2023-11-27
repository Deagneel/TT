import React, { useEffect } from 'react';
import { PrettyChatWindow } from 'react-chat-engine-pretty';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <PrettyChatWindow
        projectId='1c5e1f42-db0c-47be-88e3-58413263e9e9'
        username={correo}
        secret={correo}
        style={{ height: '100%' }}
      />
    </div>
  );
}

export default Chat
