import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ChatEngine, 
  ChatList, ChatCard, NewChatForm,
  ChatFeed, ChatHeader, IceBreaker, MessageBubble, IsTyping, NewMessageForm,
  ChatSettings, ChatSettingsTop, PeopleSettings, PhotosSettings, OptionsSettings
} from 'react-chat-engine'


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
      <ChatEngine
      height='100vh'
			projectID='1059213f-c0e8-48fe-a49c-8bfe9a8fb1a3'
			userName={correo}
			userSecret={correo}
		/>
  );
}

export default Chat