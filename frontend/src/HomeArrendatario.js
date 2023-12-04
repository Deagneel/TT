import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function Navbar({ handleSearchTerm }) {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleBellClick = () => {
    // Manejar la acción cuando se hace clic en el ícono de la campana (bell)
    console.log('Clic en la campana');
  };

  const handleEnvelopeClick = () => {
    navigate('/chat');
    console.log('Clic en el sobre');
  };

  const handlePerfilClick = () => {
    navigate('/perfilarrendatario');
  };
  
  const handleLogoutClick = () => {
    axios.get('http://localhost:3031/logout')
    .then(res => {
      if (res.data.Status === "Success") {
        swal("Sesión Cerrada Correctamente", " ", "success");
        navigate('/login');
      } else {
        alert("error");
      }
    }).catch(err => console.log(err))
  };

  const handleSearchClick = () => {
    handleSearchTerm(searchInput);
  };


  return (
    <div style={{ backgroundColor: '#422985', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '11%' }}>
      <div style={{ marginLeft: '50px' }}>
        <input type="text" placeholder="Buscar" style={{ width: '179%' }} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
      </div>
      <button onClick={handleSearchClick} style={{marginRight: '348px' ,background: 'white', cursor: 'pointer', border: '1px solid #ccc', width: '2.4%' }}>
        <i className="fa fa-search"></i>
      </button>
      <div>
      <button className="white-text-button" style={{ marginRight: '75px' }} onClick={handleLogoutClick}>Cerrar sesión</button>
        <button className="white-text-button" style={{ marginRight: '75px' }} onClick={handlePerfilClick}>Perfil</button>
        <i className="fa fa-bell icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleBellClick}></i>
        <i className="fa fa-envelope icon-button" style={{ fontSize:'20px', color: 'white', marginRight: '50px', cursor: 'pointer' }} onClick={handleEnvelopeClick}></i>
      </div>
    </div>
  );
}

function HomeArrendatario() {

    // Información de inmuebles de la base de datos mapeada en rectángulos
    const [registeredProperties, setRegisteredProperties] = useState([]);
    const [registeredSchools, setRegisteredSchools] = useState([]);
    const [showSchools, setShowSchools] = useState(false);
    const [showInmuebles, setShowInmuebles] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);

    //Mostrar solo 10 resultados a la vez
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
    };


    const handleInfoEscuelaClick = (idInmueble) => {
      navigate(`/infoinmueble?id_inmueble=${idInmueble}`);
      console.log('Clic en editar');
    };

  
    useEffect(() => {
      // Fetch solo la información relevante de la tabla inmueble
      axios.get('http://localhost:3031/inmueblearrendatario') // Actualiza el endpoint según sea necesario
        .then((response) => {
          setRegisteredProperties(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener datos de propiedades:', error);
        });
    }, []);


  const handleescuelaClick = () => {
    // Manejar la acción cuando se hace clic en boton escuela
    setShowSchools(true);
    setShowInmuebles(false);
  };

  const handleinmueClick = () => {
    // Manejar la acción cuando se hace clic en el boton inmueble
    setShowSchools(false);
    setShowInmuebles(true);
  };

  useEffect(() => {
    // Fetch solo la información relevante de la tabla inmueble
    axios.get('http://localhost:3031/obtenerEscuelas') // Actualiza el endpoint según sea necesario
      .then((response) => {
        setRegisteredSchools(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de propiedades:', error);
      });
  }, []);

  const [name, setName] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3031')
    .then(res => {
      if(res.data.valid) {
        setName(res.data.nombre);
      } else {
        navigate('/login');
      }
    })
  })

  //Busqueda filtrada por la barra
  const handleSearchTerm = (term) => {
    setSearchTerm(term);

    // Filtrar los inmuebles por término de búsqueda
    const filteredProps = registeredProperties.filter(property =>
      property.titulo.toLowerCase().includes(term.toLowerCase()) || property.nombre_escuela.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProperties(filteredProps);

    // Filtrar las escuelas por término de búsqueda
    const filteredSchls = registeredSchools.filter(school =>
      school.nombre.toLowerCase().includes(term.toLowerCase()) || school.direccion.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSchools(filteredSchls);
  };

  return (
    <div style={{ height: '100vh' }}>
      <Navbar handleSearchTerm={handleSearchTerm} />
      <div style={{ backgroundColor: '#808080', display: 'flex', justifyContent: 'space-between', height: '8%' }}>
        <button className="white-text-button" style={{ marginLeft: '350px' }} onClick={handleescuelaClick}>Escuelas</button>
        <button className="white-text-button" style={{ marginRight: '350px' }} onClick={handleinmueClick}>Inmuebles</button>
      </div>

      {/* Botones de paginación con iconos */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <i className="fa fa-arrow-left"></i> {/* Icono de flecha a la izquierda */}
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              showSchools
                ? indexOfLastItem >= registeredSchools.length
                : indexOfLastItem >= registeredProperties.length
            }
          >
            <i className="fa fa-arrow-right"></i> {/* Icono de flecha a la derecha */}
          </button>
        </div>
      
      {showSchools && (
        <div className="general-container">
          {searchTerm ? (
            filteredSchools.slice(indexOfFirstItem, indexOfLastItem)
            .map((property, index) => (
              <div key={index} className="rectangle" style={{height: '165%'}}>
                <div className="image-container">
                  {/* <img src={'http://localhost:3031/images/'+ property.foto } alt="Imagen" style={{ width: '100%', height: 'auto' }} />*/}
                </div>
                <div className="propertyDetails">
                  <p className="homearrendatariotitle">{property.nombre}</p>
                  <p className="homearrendatario" style={{marginTop: '20px'}}>Dirección: {property.direccion}</p>
                  <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/listainmuebles?id_escuela=${property.id_escuela}`);
                      }}
                    >
                      Inmuebles Cerca
                  </button>
                </div>
              </div>
            ))
          ) : (
            registeredSchools.slice(indexOfFirstItem, indexOfLastItem)
            .map((property, index) => (
              <div key={index} className="rectangle" style={{height: '165%'}}>
                <div className="image-container">
                  {/* <img src={'http://localhost:3031/images/'+ property.foto } alt="Imagen" style={{ width: '100%', height: 'auto' }} />*/}
                </div>
                <div className="propertyDetails">
                  <p className="homearrendatariotitle">{property.nombre}</p>
                  <p className="homearrendatario" style={{marginTop: '20px'}}>Dirección: {property.direccion}</p>
                  <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/listainmuebles?id_escuela=${property.id_escuela}`);
                      }}
                    >
                      Inmuebles Cerca
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      )}
  
  {showInmuebles && (
  <div className="general-container">
    {searchTerm ? (
      filteredProperties
        .slice(indexOfFirstItem, indexOfLastItem)
        .map((property, index) =>
          property.activo !== 0 && (
            <div key={index} className="rectangle">
              <div className="image-container">
                <img src={'http://localhost:3031/images/' + property.foto} alt="Imagen" style={{ width: '100%', height: 'auto' }} />
              </div>
              <div className="propertyDetails">
                <p className="homearrendatariotitle">{property.titulo}</p>
                <p className="homearrendatario">Dirección: {property.direccion}</p>
                <p className="homearrendatario">Escuela cercana: {property.nombre_escuela}</p>
                <p className="homearrendatario">Precio: {property.precio}</p>
                <button className="button" style={{ marginRight: '75px', border: '2px solid #422985' }} onClick={() => handleInfoEscuelaClick(property.id_inmueble)}>Mostrar información</button>
                {/* Agrega otros detalles de propiedad según sea necesario */}
              </div>
            </div>
          )
        )
    ) : (
      registeredProperties
        .slice(indexOfFirstItem, indexOfLastItem)
        .map((property, index) =>
          property.activo !== 0 && (
            <div key={index} className="rectangle">
              <div className="image-container">
                <img src={'http://localhost:3031/images/' + property.foto} alt="Imagen" style={{ width: '100%', height: 'auto' }} />
              </div>
              <div className="propertyDetails">
                <p className="homearrendatariotitle">{property.titulo}</p>
                <p className="homearrendatario">Dirección: {property.direccion}</p>
                <p className="homearrendatario">Escuela cercana: {property.nombre_escuela}</p>
                <p className="homearrendatario">Precio: {property.precio}</p>
                <button className="button" style={{ marginRight: '75px', border: '2px solid #422985' }} onClick={() => handleInfoEscuelaClick(property.id_inmueble)}>Mostrar información</button>
                {/* Agrega otros detalles de propiedad según sea necesario */}
              </div>
            </div>
          )
              )
          )}
        </div>
      )}

      
    </div>
  );
}

export default HomeArrendatario