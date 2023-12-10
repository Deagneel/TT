import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function Navbar({ handleSearchTerm }) {
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
                      <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/perfilarrendatario')}>Perfil</button>
                  </li>
                  <li className="nav-item">
                      <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/chat', 'Clic en el sobre')}>Chats</button>
                  </li>
                  <li className="nav-item">
                      <button type="button" className="nav-link btn btn-link" onClick={handleLogoutClick}>Cerrar sesión</button>
                  </li>
              </ul>
          </div>
      </nav>
  );

  
}

function RegistroInmueble() {
  
  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3031')
    .then(res => {
      if(res.data.valid) {
      } else {
        navigate('/login');
      }
    })
  })

  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleCheckbox = () => {
    setAceptarTerminos(!aceptarTerminos);
  };

  axios.defaults.withCredentials = true;
  const [escuelas, setEscuelas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3031/obtenerEscuelas')
      .then(response => {
        setEscuelas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las escuelas:', error);
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    cp: '',
    alcaldia: '',
    latitud: '',
    longitud: '',
    price: '',
    period: 'mensual',
    numRooms: '',
    regulations: '',
    caracteristicas: '',
    idEscuela: '',
    Tvivienda: ''
  });

  const [file, setFile] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFormValidity = () => {
      const requiredFieldsFilled = formData.title && formData.address && formData.cp &&
        formData.alcaldia && formData.latitud && formData.longitud && formData.price &&
        formData.period && formData.numRooms && formData.regulations && formData.caracteristicas &&
        formData.idEscuela && formData.Tvivienda && file;

      setIsFormValid(requiredFieldsFilled && aceptarTerminos);
    };

    checkFormValidity();
  }, [formData, file, aceptarTerminos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      const formImage = new FormData();
      formImage.append('image', file);
      const imageResponse = await axios.post('http://localhost:3031/upload', formImage);
      console.log(imageResponse.data);

      const response = await axios.post('http://localhost:3031/registroinmueble', {
        title: formData.title,
        address: formData.address,
        cp: formData.cp,
        alcaldia: formData.alcaldia,
        latitud: formData.latitud,
        longitud: formData.longitud,
        price: formData.price,
        period: formData.period,
        numRooms: formData.numRooms,
        regulations: formData.regulations,
        caracteristicas: formData.caracteristicas,
        images: imageResponse.data.url,
        idEscuela: formData.idEscuela,
        Tvivienda: formData.Tvivienda,
        activo: 1
      });

      if (response.data.error) {
        console.log('Error al registrar inmueble:', response.data.error);
        return;
      }

      swal("Inmueble Registrado Correctamente", " ", "success");
      navigate('/homearrendador');
    } catch (error) {
      console.error('Error al enviar la solicitud al servidor:', error);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container-fluid registro-inmueble-container bg-secondary">
        <div className="container bg-white" style={{ maxWidth: '100%' }}>
          <div className="row justify-content-center align-items-center" style={{ maxWidth: '100%' }}>
            <div className="col-lg-5">
              <h1 className="h3 mb-3 font-weight-bold">Registrar nuevo inmueble</h1>
            <p>Todos los campos son obligatorios.</p> {/* Mensaje de instrucción */}
              {/* Aquí van todos los campos del formulario como estaban originalmente */}
              {/* Título del anuncio */}
              <div className="form-group">
              <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '18px' }}>Título del anuncio <span style={{ color: 'red' }}>*</span></label> {/* Añadir asterisco */}
                    <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Ingresa el título del anuncio..." />
                </div>

                {/* Resto de los campos con la misma clase para mantener el tamaño uniforme */}
                {/* Dirección */}
                <div className="form-group">
                    <label htmlFor="address" style={{ fontWeight: 'bold', fontSize: '18px' }}>Dirección<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Ingrese la dirección" />
                </div>

                {/* Código Postal */}
                <div className="form-group">
                    <label htmlFor="cp" style={{ fontWeight: 'bold', fontSize: '18px' }}>Código Postal<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="cp" name="cp" value={formData.cp} onChange={handleChange} placeholder="Ingrese el Código Postal" />
                </div>

                {/* Alcaldía */}
                <div className="form-group">
                    <label htmlFor="alcaldia" style={{ fontWeight: 'bold', fontSize: '18px' }}>Alcaldía<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="alcaldia" name="alcaldia" value={formData.alcaldia} onChange={handleChange} placeholder="Ingrese la Alcaldía" />
                </div>

                {/* Latitud */}
                <div className="form-group">
                    <label htmlFor="latitud" style={{ fontWeight: 'bold', fontSize: '18px' }}>Latitud - Google Maps<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="latitud" name="latitud" value={formData.latitud} onChange={handleChange} placeholder="Ingrese las coordenadas" />
                </div>

                {/* Longitud */}
                <div className="form-group">
                    <label htmlFor="longitud" style={{ fontWeight: 'bold', fontSize: '18px' }}>Longitud - Google Maps<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="longitud" name="longitud" value={formData.longitud} onChange={handleChange} placeholder="Ingrese las coordenadas" />
                </div>

                {/* Escuela cercana */}
                <div className="form-group">
                    <label htmlFor="idEscuela" style={{ fontWeight: 'bold', fontSize: '18px' }}>Escuela cercana<span style={{ color: 'red' }}>*</span></label>
                    <select className="form-control" id="idEscuela" name="idEscuela" value={formData.idEscuela} onChange={handleChange}>
                        <option value="">Selecciona una escuela</option>
                        {escuelas.map((escuela, index) => (
                            <option key={index} value={escuela.id_escuela}>{escuela.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Tipo de vivienda */}
                <div className="form-group">
                    <label htmlFor="Tvivienda" style={{ fontWeight: 'bold', fontSize: '18px' }}>Tipo de vivienda<span style={{ color: 'red' }}>*</span></label>
                    <select className="form-control" id="Tvivienda" name="Tvivienda" value={formData.Tvivienda} onChange={handleChange}>
                        <option value="">Selecciona un tipo de vivienda</option>
                        <option value="0">Individual</option>
                        <option value="1">Compartida</option>
                    </select>
                </div>

                {/* Precio y Periodo */}
                <div className="form-row">
                    <div className="col">
                        <label htmlFor="price" style={{ fontWeight: 'bold', fontSize: '18px' }}>Precio<span style={{ color: 'red' }}>*</span></label>
                        <input type="text" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Ingrese el precio" />
                    </div>
                    <div className="col">
                        <label htmlFor="period" style={{ fontWeight: 'bold', fontSize: '18px' }}>Periodo<span style={{ color: 'red' }}>*</span></label>
                        <select className="form-control" id="period" name="period" value={formData.period} onChange={handleChange} >
                          <option value="Mensual">Mensual</option>
                          <option value="Cuatrimestral">Cuatrimestral</option>
                          <option value="Semestral">Semestral</option>
                          <option value="Anual">Anual</option>
                      </select>
                    </div>
                </div>

                {/* Número de habitaciones */}
                <div className="form-group">
                    <label htmlFor="numRooms" style={{ fontWeight: 'bold', fontSize: '18px' }}>Número de habitaciones<span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" id="numRooms" name="numRooms" value={formData.numRooms} onChange={handleChange} placeholder="..." />
                </div>

                {/* Reglamento */}
                <div className="form-group">
                    <label htmlFor="regulations" style={{ fontWeight: 'bold', fontSize: '18px' }}>Reglamento<span style={{ color: 'red' }}>*</span></label>
                    <textarea className="form-control" id="regulations" name="regulations" value={formData.regulations} onChange={handleChange} placeholder="Ingrese el reglamento"></textarea>
                </div>

                {/* Caracteristicas */}
                <div className="form-group">
                    <label htmlFor="caracteristicas" style={{ fontWeight: 'bold', fontSize: '18px' }}>Características<span style={{ color: 'red' }}>*</span></label>
                    <textarea className="form-control" id="caracteristicas" name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} placeholder="Ingrese características del Inmueble"></textarea>
                </div>

                {/* Carga de imagen */}
                <div className="form-group">
                    <label htmlFor="imageUpload" style={{ fontWeight: 'bold', fontSize: '18px' }}>Imagen<span style={{ color: 'red' }}>*</span></label>
                    <input type="file" className="form-control-file" id="imageUpload" onChange={handleFile} />
                </div>

                {/* Políticas de privacidad */}
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="aceptar_terminos" name="aceptar_terminos" onChange={handleCheckbox} checked={aceptarTerminos} />
                    <label className="form-check-label" htmlFor="aceptar_terminos">Acepto políticas de privacidad</label>
                </div>

              <button type="button" className="btn btn-primary" onClick={handleRegister} disabled={!isFormValid}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RegistroInmueble;
