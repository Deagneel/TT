"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

function Navbar() {
  const handleBellClick = () => {
    console.log('Clic en la campana');
  };

  const handleEnvelopeClick = () => {
    console.log('Clic en el sobre');
  };

  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        <input type="text" placeholder="Buscar" style={{ width: '175%' }} />
      </div>
      <div>
        <button className="white-text-button" style={{ marginRight: '75px' }}>Perfil</button>
        <i className="fa fa-bell icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize: '20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}

function PageContent() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [open, setOpen] = useState(false);
  const [selectedInmueble, setSelectedInmueble] = useState(null); // Nuevo estado para almacenar información del inmueble seleccionado
  const [inmuebles, setInmuebles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idEscuela = searchParams.get('id_escuela');

  useEffect(() => {
    fetch(`http://localhost:3031/escuela/${idEscuela}`)
        .then(response => response.json())
        .then(data => {
            const escuela = data[0]; // Supongo que solo habrá una escuela con ese ID
            const { latitud, longitud, ...restoDatosEscuela } = escuela;

            // Asigna las coordenadas de la escuela a la variable 'position'
            const nuevaPosition = { lat: parseFloat(latitud), lng: parseFloat(longitud) };

            // Realiza cualquier otra acción necesaria con los datos de la escuela
            // Puedes asignar 'nuevaPosition' a un estado si es necesario
            setPosition(nuevaPosition);
            // Puedes también hacer otras operaciones con 'restoDatosEscuela' si es necesario

            console.log("Coordenadas de la escuela:", nuevaPosition);
        })
        .catch(error => console.error('Error al obtener la escuela:', error));
}, [idEscuela]);



  useEffect(() => {
    fetch('http://localhost:3031/infoinmueblesmap')
      .then(response => response.json())
      .then(data => setInmuebles(data))
      .catch(error => console.error('Error al obtener los inmuebles:', error));
  }, []);

  return (
    <APIProvider apiKey={'AIzaSyArrTAZutsOGQ0qEXumdsKfqz6sryLq3bw'}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map zoom={15} center={position} mapId={'817a42045fb506a5'}>
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
            <div style={{ maxWidth: '300px' }}> {/* Ajusta el tamaño según tus necesidades */}
              <p>{selectedInmueble.titulo}</p>
              <img
                src={'http://localhost:3031/images/' + selectedInmueble.foto} // Ajusta el nombre de la propiedad según la estructura de tu objeto
                alt= "Imagen inmueble" // Ajusta el texto alternativo según tus necesidades
                style={{ width: '100%'}} // Ajusta el estilo según tus necesidades
              />
              <p>{"Dirección: " + selectedInmueble.direccion}</p>
              <p>{"Precio: $" + selectedInmueble.precio}</p>
              {/* Agrega más contenido si es necesario */}
              <div style={{ maxWidth: '300px' }}>
              {/* ... Otro contenido ... */}
              
              <a
                href={`/infoinmueble?id_inmueble=${selectedInmueble.id_inmueble}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/infoinmueble?id_inmueble=${selectedInmueble.id_inmueble}`);
                }}
              >
                Ver detalles
              </a>
            </div>

            </div>
          </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

function ListaInmuebles() {
  
  const handleSelectChange = (event, type) => {
    console.log(`Nuevo valor seleccionado para ${type}: ${event.target.value}`);
    // Aquí puedes realizar acciones adicionales según el cambio en los selects
  };

  return (
    <div style={{ height: '100vh' }}>
      <Navbar />
      <div style={{ backgroundColor: '#808080', display: 'flex', justifyContent: 'space-between', height: '8%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '50px' }}>
          <label htmlFor="precio" style={{ color: 'white' }}>Precio:</label>
          <select id="precio" className="white-text-select" onChange={(e) => handleSelectChange(e, 'precio')}>
            <option value="5000">Hasta $5000</option>
            <option value="10000">$5000 a $10000</option>
            <option value="10001">$10000 y más</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="distancia" style={{ color: 'white' }}>Distancia:</label>
          <select id="distancia" className="white-text-select" onChange={(e) => handleSelectChange(e, 'distancia')}>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="10">10 km y más</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '50px' }}>
          <label htmlFor="tipoHabitacion" style={{ color: 'white' }}>Tipo de Habitación:</label>
          <select id="tipoHabitacion" className="white-text-select" onChange={(e) => handleSelectChange(e, 'tipoHabitacion')}>
            <option value="0">Individual</option>
            <option value="1">Compartida</option>
          </select>
        </div>
      </div>
      <PageContent />
    </div>
  );
}

export default ListaInmuebles;