import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import {
  MultiChatSocket,
  MultiChatWindow,
  useMultiChatLogic,
} from 'react-chat-engine-advanced';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (path, message) => {
    navigate(path);
    if (message) console.log(message);
  };

  const handleLogoutClick = async () => {
    try {
      const res = await axios.get('http://localhost:3031/logout');
      if (res.data.Status === 'Success') {
        swal('Sesión Cerrada Correctamente', ' ', 'success');
        navigate('/login');
      } else {
        alert('error');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
      <button className="navbar-toggler" type="button" onClick={toggleMenu}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'} justify-content-center w-100`} id="navbarNav">
        <ul className="navbar-nav w-100 justify-content-around">
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={() => window.history.back()}>Volver</button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/perfilarrendador')}>Perfil</button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={handleLogoutClick}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </nav>
  );


}

function Chat({ correo }) {
  // Definir username y secret basados en correo
  const username = correo || 'default_username';
  const secret = correo || 'default_secret';

  // Inicializar useMultiChatLogic con los valores adecuados
  const projectId = '6a22601b-69ce-4f51-b6ff-19957596e253';
  const chatProps = useMultiChatLogic(projectId, username, secret);

  return (
    <>
      <Navbar />
      <MultiChatWindow
  {...chatProps}
  renderOptionsSettings={() => null}
  renderChatForm={() => null}
  renderPeopleSettings={() => null}
  style={{ height: '92vh', fontFamily: 'inherit' }}
/>

      <MultiChatSocket {...chatProps} />
    </>
  );
}

export default Chat;