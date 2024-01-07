"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import {
  APIProvider,
  Map,
  Pin,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import axios from 'axios';
import swal from 'sweetalert';



function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3031')
      .then(res => {
        if (res.data.valid) {
        } else {
          navigate('/login');
        }
      })
  })

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

function PageContent({ precio, distancia, tipoHabitacion }) {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [open, setOpen] = useState(false);
  const [selectedInmueble, setSelectedInmueble] = useState(null); // Nuevo estado para almacenar información del inmueble seleccionado
  const [inmuebles, setInmuebles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idEscuela = searchParams.get('id_escuela');
  const [nombreEscuela, setNombreEscuela] = useState(null);
  const [fotoEscuela, setFotoEscuela] = useState(null);

  useEffect(() => {
    const obtenerEscuela = async () => {
      try {
        const response = await fetch(`http://localhost:3031/escuela/${idEscuela}`);
        if (!response.ok) {
          throw new Error('Error al obtener la escuela');
        }
        const data = await response.json();
        const escuela = data[0];
        const { latitud, longitud, nombre, foto, ...restoDatosEscuela } = escuela;
        const nuevaPosition = { lat: parseFloat(latitud), lng: parseFloat(longitud) };

        setNombreEscuela(nombre);
        setPosition(nuevaPosition);
        setFotoEscuela(foto);

        console.log("Coordenadas de la escuela:", nuevaPosition);
        console.log("Nombre de la escuela:", nombreEscuela);
      } catch (error) {
        console.error('Error en obtenerEscuela:', error.message);
      }
    };

    obtenerEscuela();
  }, [idEscuela]);

  useEffect(() => {
    console.log("Nombre de la escuela:", nombreEscuela);
  }, [nombreEscuela]);

  useEffect(() => {
    const obtenerInmuebles = async () => {
      if (position.lat !== 0 && position.lng !== 0 && nombreEscuela !== null) {
        console.log("Precio:", precio);
        console.log("Tipo de habitación:", tipoHabitacion);
        console.log("Distancia:", distancia);

        try {
          const response = await fetch('http://localhost:3031/infoinmueblesmap');
          if (!response.ok) {
            throw new Error('Error al obtener los inmuebles');
          }
          const data = await response.json();
          console.log("Datos recibidos:", data);

          const inmueblesFiltrados = data.filter(inmueble => {
            const distanciaEscuelaHabitacion = getDistanceFromLatLonInKm(inmueble.latitud, inmueble.longitud, position.lat, position.lng);
            const cumpleCriterios = (
              !(inmueble.activo === 0 || inmueble.activo_usuario === 1) &&
              inmueble.no_habitaciones > 0 &&
              inmueble.precio >= precio.min && // Uso de precio.min
              inmueble.precio <= precio.max &&
              inmueble.tipo_de_habitacion == tipoHabitacion &&
              distanciaEscuelaHabitacion <= distancia
            );

            console.log("Detalles del inmueble:", inmueble);
            console.log("Número de habitaciones cumple criterio:", inmueble.no_habitaciones > 0);
            console.log("Precio cumple criterio:", inmueble.precio <= precio);
            console.log("Tipo de habitación cumple criterio:", inmueble.tipo_de_habitacion == tipoHabitacion);
            console.log("Distancia cumple criterio:", distanciaEscuelaHabitacion <= distancia);
            console.log("Criterios de filtro para inmueble:", cumpleCriterios);

            return cumpleCriterios;
          });


          setInmuebles(inmueblesFiltrados);
          console.log("Inmuebles filtrados:", inmueblesFiltrados);
        } catch (error) {
          console.error('Error en obtenerInmuebles:', error.message);
        }
      }
    };

    obtenerInmuebles();
  }, [position, precio, tipoHabitacion, distancia, nombreEscuela]);



  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    try {
      var R = 6371; // Radio de la tierra en km
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distancia en km

      // Imprime los valores de entrada y salida
      console.log("Latitud 1:", lat1);
      console.log("Longitud 1:", lon1);
      console.log("Latitud 2:", lat2);
      console.log("Longitud 2:", lon2);
      console.log("Distancia calculada:", d);

      return d;
    } catch (error) {
      console.error("Error en getDistanceFromLatLonInKm:", error);
      return 0; // Maneja el error devolviendo 0 en caso de problemas
    }
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }



  return (
    <APIProvider apiKey={'AIzaSyArrTAZutsOGQ0qEXumdsKfqz6sryLq3bw'}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map zoom={15} center={position} mapId={'817a42045fb506a5'}>
          <AdvancedMarker key={idEscuela} position={position} title="Escuela" >
            <Pin
              background={"#F1C40F"}
              borderColor={"9A7D0A"}
              glyphColor={"#9A7D0A"}
            >
            </Pin>
          </AdvancedMarker>
          <InfoWindow position={position}>
            <div style={{ display: 'flex', alignItems: 'center', maxWidth: '300px' }}>
              <img
                src={`http://localhost:3031/images/` + fotoEscuela}
                alt="Imagen Escuela"
                style={{ width: '25%', objectFit: 'cover' }}
              />
              <h7 style={{ marginLeft: '10px' }}>{nombreEscuela}</h7>
            </div>
          </InfoWindow>

          {inmuebles.map(inmueble => (
            <AdvancedMarker
              key={inmueble.id_inmueble}
              position={{ lat: parseFloat(inmueble.latitud), lng: parseFloat(inmueble.longitud) }}
              onClick={() => {
                setOpen(true);
                setSelectedInmueble(inmueble);
              }}
            />
          ))}
          {selectedInmueble && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedInmueble.latitud),
                lng: parseFloat(selectedInmueble.longitud),
              }}
            >
              <div className="container" style={{ maxWidth: '300px' }}>
                <h4>{selectedInmueble.titulo}</h4>
                <img
                  src={`http://localhost:3031/images/${selectedInmueble.foto}`}
                  alt="Imagen inmueble"
                  className="img-fluid"
                  style={{ width: '100%' }}
                />
                <h6>Dirección: {selectedInmueble.direccion}</h6>
                <h6>Precio: ${selectedInmueble.precio}</h6>
                <h6>Cuartos Disponibles: {selectedInmueble.no_habitaciones}</h6>
                <h6>Distancia a la escuela: {getDistanceFromLatLonInKm(selectedInmueble.latitud, selectedInmueble.longitud, position.lat, position.lng).toFixed(2)} km</h6>

                {/* Use a button or a more descriptive element for the clickable area */}
                <button
                  className="btn btn-secondary"
                  style={{ backgroundColor: '#beaf87', color: 'black' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#9b8c5a')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#beaf87')}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/infoinmueble?id_inmueble=${selectedInmueble.id_inmueble}`);
                  }}
                >
                  Ver Detalles
                </button>
              </div>


            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );

}

function ListaInmuebles() {
  const rangosPrecios = {
    '5000': { min: 0, max: 5000 },
    '10000': { min: 5001, max: 10000 },
    '100000': { min: 10001, max: Infinity } // Para 'más de 10000', puedes usar Infinity
  };

  const [precio, setPrecio] = useState(rangosPrecios['5000']); // Estado inicial al rango 'Hasta $5000'
  const [distancia, setDistancia] = useState('5');
  const [tipoHabitacion, setTipoHabitacion] = useState('0');

  const handleSelectChange = (event, type) => {
    const value = event.target.value;

    switch (type) {
      case 'precio':
        setPrecio(rangosPrecios[value]);
        break;
      case 'distancia':
        setDistancia(value);
        break;
      case 'tipoHabitacion':
        setTipoHabitacion(value);
        break;
      default:
        break;
    }

    console.log(`Nuevo valor seleccionado para ${type}: ${value}`);
    // Aquí puedes realizar acciones adicionales según el cambio en los selects
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <div className="bg-secondary d-flex flex-wrap justify-content-around p-3">
          <div className="mb-3">
            <label htmlFor="precio" className="text-white">Precio:</label>
            <select id="precio" className="form-select" onChange={(e) => handleSelectChange(e, 'precio')}>
              <option value="5000">Hasta $5000</option>
              <option value="10000">$5000 a $10000</option>
              <option value="100000">$10000 y más</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="distancia" className="text-white">Distancia:</label>
            <select id="distancia" className="form-select" onChange={(e) => handleSelectChange(e, 'distancia')}>
              <option value="11">11 km</option>
              <option value="20">20 km</option>
              <option value="300">30 km y más</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="tipoHabitacion" className="text-white">Tipo de Habitación:</label>
            <select id="tipoHabitacion" className="form-select" onChange={(e) => handleSelectChange(e, 'tipoHabitacion')}>
              <option value={0}>Individual</option>
              <option value={1}>Compartida</option>
            </select>
          </div>
        </div>

        <PageContent precio={precio} distancia={distancia} tipoHabitacion={tipoHabitacion} />
      </div>
    </div>
  );

}

export default ListaInmuebles;