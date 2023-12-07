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
  MarkerWithLabel,
} from "@vis.gl/react-google-maps";
import axios from 'axios';
import swal from 'sweetalert';



function Navbar({ handleSearchTerm }) {
  const [searchInput, setSearchInput] = useState('');
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

  const handleSearchClick = (e) => {
    e.preventDefault();
    handleSearchTerm(searchInput);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className={`navbar-toggler ${menuOpen ? '' : 'collapsed'}`}
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'} d-lg-flex justify-content-between w-100`} id="navbarNav">
          <form className="form-inline mx-2 d-flex" onSubmit={handleSearchClick}>
            <input
              type="text"
              className="form-control mr-sm-2"
              placeholder="Buscar"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ fontSize: '1rem', width: '500px' }}
            />
            <button className="btn btn-outline-light" type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
          <div className="navbar-nav w-100 nav-fill">
            <button type="button" className="nav-link btn btn-link w-200" onClick={() => handleClick('/perfilarrendatario')}>
              Perfil
            </button>
            <button type="button" className="nav-link btn btn-link w-200" onClick={() => handleClick('/chat', 'Clic en el sobre')}>
              Chats
            </button>
            <button type="button" className="nav-link btn btn-link w-200" onClick={handleLogoutClick}>
              Cerrar sesión
            </button>
          </div>
        </div>
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

  useEffect(() => {
    const obtenerEscuela = async () => {
      try {
        const response = await fetch(`http://localhost:3031/escuela/${idEscuela}`);
        if (!response.ok) {
          throw new Error('Error al obtener la escuela');
        }
        const data = await response.json();
        const escuela = data[0];
        const { latitud, longitud, nombre, ...restoDatosEscuela } = escuela;
        const nuevaPosition = { lat: parseFloat(latitud), lng: parseFloat(longitud) };
  
        setNombreEscuela(nombre);
        setPosition(nuevaPosition);
  
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
              inmueble.no_habitaciones > 0 &&
              inmueble.precio <= precio &&
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
          position = {{
            lat: parseFloat(selectedInmueble.latitud),
            lng: parseFloat(selectedInmueble.longitud),
          }}
          onCloseClick={() => setOpen(false)}
          >
            <div className="container" style={{ maxWidth: '300%' }}>
              <h2>{selectedInmueble.titulo}</h2>
              <img
                src={`http://localhost:3031/images/${selectedInmueble.foto}`}
                alt="Imagen inmueble"
                className="img-fluid"
                style={{ width: '100%' }}
              />
              <h5>Dirección: {selectedInmueble.direccion}</h5>
              <h5>Precio: ${selectedInmueble.precio}</h5>
              <h5>Cuartos Disponibles: {selectedInmueble.no_habitaciones}</h5>
              <h5>Distancia a la escuela: {getDistanceFromLatLonInKm(selectedInmueble.latitud, selectedInmueble.longitud, position.lat, position.lng)} km</h5>

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
  const [precio, setPrecio] = useState('5000');
  const [distancia, setDistancia] = useState('5');
  const [tipoHabitacion, setTipoHabitacion] = useState('0');

  const handleSelectChange = (event, type) => {
    const value = event.target.value;

    switch (type) {
      case 'precio':
        setPrecio(value);
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
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
  
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
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="1000">15 km y más</option>
          </select>
        </div>
  
        <div className="mb-3">
          <label htmlFor="tipoHabitacion" className="text-white">Tipo de Habitación:</label>
          <select id="tipoHabitacion" className="form-select" onChange={(e) => handleSelectChange(e, 'tipoHabitacion')}>
            <option value= {0}>Individual</option>
            <option value= {1}>Compartida</option>
          </select>
        </div>
      </div>
  
      <PageContent precio={precio} distancia={distancia} tipoHabitacion={tipoHabitacion}/>
    </div>
  );
  
}

export default ListaInmuebles;