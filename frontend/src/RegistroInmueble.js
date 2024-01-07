"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import MapComponent from './MapComponent';


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
            <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/perfilarrendador')}>Perfil</button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={() => handleClick('/correoobtencion', 'Clic en el sobre')}>Chats</button>
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
  useEffect(() => {
    console.log("useEffect inicial en RegistroInmueble, formData actual:", formData);
    axios.get('http://localhost:3031')
      .then(res => {
        if (res.data.valid) {
        } else {
          navigate('/login');
        }
      })
  })
  const XLSX = require('xlsx');
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [esCpValido, setEsCpValido] = useState(null);
  const [tempAsentamiento, setTempAsentamiento] = useState('');
  const [tempAlcaldia, setTempAlcaldia] = useState('');

  const validarCP = (cp) => {
    // Convertir el CP a número para la comparación
    const cpNumerico = parseInt(cp);

    // Definir el rango de CPs de la Ciudad de México
    const rangoCPsCDMX = { min: 1000, max: 19999 };

    // Verificar si el CP está en el rango
    if (cpNumerico >= rangoCPsCDMX.min && cpNumerico <= rangoCPsCDMX.max) {
      setEsCpValido(true);
    } else {
      setEsCpValido(false);
    }
  };

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
    calle: '',
    numExterior: '',
    numInterior: '',
    asentamiento: '',
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

  console.log("Inicio del componente RegistroInmueble, estado inicial formData:", formData);

  const handleMarkerDragEnd = (position) => {
    setFormData({ ...formData, latitud: position.lat, longitud: position.lng });
  };

  const [file, setFile] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFormValidity = () => {
      const requiredFieldsFilled = formData.title && formData.address && formData.asentamiento && formData.cp &&
        formData.alcaldia && formData.latitud && formData.longitud && formData.price &&
        formData.period && formData.numRooms && formData.regulations && formData.caracteristicas &&
        formData.Tvivienda && file;

      setIsFormValid(requiredFieldsFilled && aceptarTerminos);
    };

    checkFormValidity();
  }, [formData, file, aceptarTerminos]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Definir las validaciones para campos específicos
    const validations = {
      title: value => !/[\d]/.test(value), // No permite números en el título
      cp: value => /^$|^[0-9]+$/.test(value), // Solo permite números en el código postal
      price: value => /^$|^[0-9]+$/.test(value),
      numRooms: value => /^$|^[0-9]+$/.test(value)
    };

    const errorMessages = {
      title: "El título no puede incluir números",
      cp: "El código postal solo puede contener números",
      price: "El precio solo puede contener números",
      numRooms: "El número de habitaciones solo puede contener números"
    };

    // Verificar si hay una validación definida para este campo
    if (validations[name]) {
      // Si la validación falla, no actualizar el estado y, opcionalmente, mostrar un error
      if (!validations[name](value)) {
        swal(errorMessages[name], "", "error");
        return; // Detener la ejecución aquí
      }
    }
    setFormData({
      ...formData,
      [name]: value
    });

    console.log("handleChange, formData después de actualizar:", formData);

  };

  const findNearestSchool = async (lat, lng) => {
    try {
      console.log("Latitud:", lat, "Longitud:", lng); // Para depuración
  
      const response = await axios.get(`http://localhost:3031/escuelaCercana?lat=${lat}&lon=${lng}`);
      console.log("Respuesta del servidor:", response.data); // Para depuración
  
      if (response.data && response.data.idEscuelaMasCercana) {
        setFormData(prevFormData => ({
          ...prevFormData,
          idEscuela: response.data.idEscuelaMasCercana
        }));
      } else {
        console.log("No se encontró idEscuelaMasCercana en la respuesta del servidor.");
      }
    } catch (error) {
      console.error('Error al obtener la escuela más cercana:', error);
      console.error('Detalle del error:', error.response ? error.response.data : error.message);
    }
  };
  

  //Sección de validacion de CP
  const handlecpvalidation = async () => {
    const cpInput = document.getElementById('cp');
    const cpValue = cpInput.value;

    if (!formData.calle || !formData.numExterior || !cpValue) {
      swal("Error", "Por favor, rellena los campos de Calle, Número Exterior y Código Postal antes de validar.", "error");
      return;
    }

    // Validar la longitud mínima de calle.
    if (formData.calle.trim().length < 3) {
      swal("Error", "Ingresa una calle valida, por favor.", "error");
      return;
    }

    // Validar que calle no tenga tres caracteres idénticos seguidos.
    if (/(\w)\1{2}/.test(formData.calle)) {
      swal("Error", "Ingresa una calle valida, por favor.", "error");
      return;
    }

    // Validar que numExterior no tenga tres caracteres idénticos seguidos.
    if (/(\w)\1{2}/.test(formData.numExterior)) {
      swal("Error", "Ingresa un número exterior valido, por favor.", "error");
      return;
    }

    // Validar que numExterior no tenga tres caracteres idénticos seguidos.
    if (/(\w)\1{2}/.test(formData.numInterior)) {
      swal("Error", "Ingresa un número interior valido, por favor.", "error");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3031/validateCP?cp=${cpValue}`);
      if (response.status === 200 && response.data.asentamiento && response.data.alcaldia) {
        setFormData(prevFormData => ({
          ...prevFormData,
          asentamiento: response.data.asentamiento,
          alcaldia: response.data.alcaldia,
          cp: cpValue
        }));

        // Continúa con la búsqueda de coordenadas
        const direccionCompleta = `${formData.calle} ${formData.numExterior} ${formData.numInterior ? 'Int. ' + formData.numInterior : ''}, ${response.data.asentamiento}, ${cpValue}, ${response.data.alcaldia}`;
        fetchCoordinates(direccionCompleta);
      } else {
        console.error('Error en la solicitud al servidor: ', response.status);
      }
    } catch (error) {
      swal("Ingresa un código postal valido.", "", "error");
      console.error('Error en la solicitud al servidor', error);
    }

    console.log("handlecpvalidation, fin de la función, formData:", formData);

  };


  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddressPartChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const address = e.target.value;
    setFormData({ ...formData, address });
  };

  const getAddressForMap = () => {
    // Combina los campos de la dirección
    const direccionCompleta = `${formData.calle} ${formData.numExterior} ${formData.numInterior ? 'Int. ' + formData.numInterior : ''}`.trim();

    // Construye la dirección completa con asentamiento, CP y alcaldía
    const fullAddress = `${direccionCompleta}, ${formData.asentamiento}, ${formData.cp}, ${formData.alcaldia}`;

    // Llama a la función para obtener las coordenadas con la dirección completa
    fetchCoordinates(fullAddress);
  };

  const fetchCoordinates = async (fullAddress) => {
    if (fullAddress.length > 10) { // Asegúrate de que la dirección sea lo suficientemente larga
      try {
        const response = await axios.get(`http://localhost:3031/geocode?address=${encodeURIComponent(fullAddress)}`);
        const { results } = response.data;
        if (results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          setFormData(prevFormData => ({
            ...prevFormData,
            latitud: lat,
            longitud: lng,
            address: fullAddress
          }));
          findNearestSchool(lat, lng);
        }
      } catch (error) {
        console.error('Error en la geocodificación:', error);
      }
    }

    console.log("fetchCoordinates, después de obtener coordenadas, formData:", formData);

  };

  const handleRegister = async () => {
    console.log("handleRegister, antes de registrar, formData:", formData);

    if (!isFormValid) return;

    // Combina los campos de la dirección
    const direccionCompleta = `${formData.calle} ${formData.numExterior} ${formData.numInterior ? 'Int. ' + formData.numInterior : ''}`.trim();

    // Validar la longitud mínima de título.
    if (formData.regulations.trim().length < 10) {
      swal("Error", "Necesitamos un poco más de información en el reglamento.", "error");
      return;
    }

    // Validar la longitud mínima de características.
    if (formData.caracteristicas.trim().length < 10) {
      swal("Error", "Necesitamos un poco más de información en las características.", "error");
      return;
    }

    // Validar la longitud mínima de título
    if (formData.title.trim().length < 10) {
      swal("Error", "Necesitamos un título más extenso.", "error");
      return;
    }

    // Validar la longitud mínima de dirección
    if (formData.address.trim().length < 5) {
      swal("Error", "Necesitamos una dirección valida.", "error");
      return;
    }

    try {
      const formImage = new FormData();
      formImage.append('image', file);
      const imageResponse = await axios.post('http://localhost:3031/upload', formImage);
      console.log(imageResponse.data);

      const response = await axios.post('http://localhost:3031/registroinmueble', {
        title: formData.title,
        address: direccionCompleta,
        asentamiento: formData.asentamiento,
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

  useEffect(() => {
    console.log("Cambio en formData:", formData);
  }, [formData]);


  useEffect(() => {
    console.log("Cambio detectado en asentamiento o alcaldía:", formData.asentamiento, formData.alcaldia);
  }, [formData.asentamiento, formData.alcaldia]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container-fluid registro-inmueble-container bg-secondary">
        <div className="container bg-white p-4">
          <h1 className="h3 mb-3 font-weight-bold">Registrar nuevo inmueble</h1>
          <p>Todos los campos son obligatorios.</p> {/* Mensaje de instrucción */}
          {/* Título del anuncio */}
          <div className="mb-3 form-group">
            <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '18px' }}>Ingresar título del anuncio <span style={{ color: 'red' }}>*</span></label> {/* Añadir asterisco */}
            <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Ingresa el título del anuncio..." />
          </div>

          {/* Calle */}

          <div className="mb-3 form-group">
            <label htmlFor="calle" style={{ fontWeight: 'bold', fontSize: '18px' }}>Calle <span style={{ color: 'red' }}>*</span></label>
            <input type="text" className="form-control" id="calle" name="calle" value={formData.calle} onChange={handleAddressPartChange} placeholder="Calle" />
          </div>

          {/* Número Exterior e Interior */}

          <div className="row">
            <div className="col-md-6 mb-3 form-group">
              <label htmlFor="numExterior" style={{ fontWeight: 'bold', fontSize: '18px' }}>Número Exterior <span style={{ color: 'red' }}>*</span></label>
              <input type="text" className="form-control" id="numExterior" name="numExterior" value={formData.numExterior} onChange={handleAddressPartChange} placeholder="Número Exterior" />
            </div>
            <div className="col-md-6 mb-3 form-group">
              <label htmlFor="numInterior" style={{ fontWeight: 'bold', fontSize: '18px' }}>Número Interior</label>
              <input type="text" className="form-control" id="numInterior" name="numInterior" value={formData.numInterior} onChange={handleAddressPartChange} placeholder="Número Interior (opcional)" />
            </div>
          </div>

          {/* Código Postal */}
          <div className="mb-3 form-group">
            <label htmlFor="cp" style={{ fontWeight: 'bold', fontSize: '18px' }}>Código Postal<span style={{ color: 'red' }}>*</span></label>
            <div className="input-group">
              <input type="text" className="form-control" id="cp" name="cp" value={formData.cp} onChange={handleChange} placeholder="Ingrese el Código Postal" />
              <div className="input-group-append">
                <button onClick={handlecpvalidation} className="btn btn-outline-secondary" type="button" id="button-addon2">Validar Dirección</button>
              </div>
            </div>
          </div>

          {/* Asentamiento */}
          <div className="mb-3 form-group">
            <label htmlFor="asentamiento" style={{ fontWeight: 'bold', fontSize: '18px' }}>Asentamiento<span style={{ color: 'red' }}>*</span></label>
            <input disabled type="text" className="form-control" id="asentamiento" name="asentamiento" value={formData.asentamiento} onChange={handleChange} placeholder="..." />
          </div>

          {/* Alcaldía */}
          <div className="mb-3 form-group">
            <label htmlFor="alcaldia" style={{ fontWeight: 'bold', fontSize: '18px' }}>Alcaldía<span style={{ color: 'red' }}>*</span></label>
            <input disabled type="text" className="form-control" id="alcaldia" name="alcaldia" value={formData.alcaldia} onChange={handleChange} placeholder="..." />
          </div>

          <MapComponent
            onMarkerDragEnd={handleMarkerDragEnd}
            latitud={parseFloat(formData.latitud)}
            longitud={parseFloat(formData.longitud)}
          />

          {/* Tipo de vivienda */}
          <div className="mb-3 form-group">
            <label htmlFor="Tvivienda" style={{ fontWeight: 'bold', fontSize: '18px' }}>¿Qué tipo de vivienda es?<span style={{ color: 'red' }}>*</span></label>
            <select className="form-control" id="Tvivienda" name="Tvivienda" value={formData.Tvivienda} onChange={handleChange}>
              <option value="">Selecciona un tipo de vivienda</option>
              <option value="0">Individual</option>
              <option value="1">Compartida</option>
            </select>
          </div>

          {/* Precio y Periodo */}
          <div className="mb-3 form-row">
            <div className="mb-3 col">
              <label htmlFor="price" style={{ fontWeight: 'bold', fontSize: '18px' }}>Ingresa el precio<span style={{ color: 'red' }}>*</span></label>
              <input type="text" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Ingrese el precio" />
            </div>
            <div className="mb-3 col">
              <label htmlFor="period" style={{ fontWeight: 'bold', fontSize: '18px' }}>¿Cuál es el periodo de la renta?<span style={{ color: 'red' }}>*</span></label>
              <select className="form-control" id="period" name="period" value={formData.period} onChange={handleChange} >
                <option value="Mensual">Mensual</option>
                <option value="Cuatrimestral">Cuatrimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>

          {/* Número de habitaciones */}
          <div className="mb-3 form-group">
            <label htmlFor="numRooms" style={{ fontWeight: 'bold', fontSize: '18px' }}>Ingresa el número de habitaciones<span style={{ color: 'red' }}>*</span></label>
            <input type="text" className="form-control" id="numRooms" name="numRooms" value={formData.numRooms} onChange={handleChange} placeholder="..." />
          </div>

          {/* Reglamento */}
          <div className="mb-3 form-group">
            <label htmlFor="regulations" style={{ fontWeight: 'bold', fontSize: '18px' }}>Ingresa el reglamento interno del inmueble<span style={{ color: 'red' }}>*</span></label>
            <textarea className="form-control" id="regulations" name="regulations" value={formData.regulations} onChange={handleChange} placeholder="Ingrese el reglamento"></textarea>
          </div>

          {/* Caracteristicas */}
          <div className="mb-3 form-group">
            <label htmlFor="caracteristicas" style={{ fontWeight: 'bold', fontSize: '18px' }}>Ingresa características adicionales del inmueble<span style={{ color: 'red' }}>*</span></label>
            <textarea className="form-control" id="caracteristicas" name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} placeholder="Ingrese características destacables del Inmueble"></textarea>
          </div>

          {/* Carga de imagen */}
          <div className="mb-3 form-group">
            <label htmlFor="imageUpload" style={{ fontWeight: 'bold', fontSize: '18px' }}>Sube la foto de tu inmueble<span style={{ color: 'red' }}>*</span></label>
            <input type="file" className="form-control-file" id="imageUpload" onChange={handleFile} />
          </div>

          {/* Políticas de privacidad */}
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="aceptar_terminos" name="aceptar_terminos" onChange={handleCheckbox} checked={aceptarTerminos} />
            <label className="form-check-label" htmlFor="aceptar_terminos">
              Acepto las <Link to="/privacypolicy">políticas de privacidad</Link>
            </label>
          </div>

          {/* Botón de registro */}
          <button type="button" className="btn btn-secondary"
            style={{ backgroundColor: '#beaf87', color: 'black' }}
            onClick={handleRegister}
            disabled={!isFormValid || esCpValido === false}>
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}


export default RegistroInmueble;