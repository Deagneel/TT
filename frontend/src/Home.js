import React, { useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ handleSearchTerm }) {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (path, message) => {
    navigate(path);
    if (message) console.log(message);
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
            <button type="button" className="nav-link btn btn-link w-200" onClick={() => handleClick('/login')}>
              Inicio de sesión
            </button>
            <button type="button" className="nav-link btn btn-link w-200" onClick={() => handleClick('/tipousuario')}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  
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
          console.log(response.data);
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
      school.nombre.toLowerCase().includes(term.toLowerCase()) || school.direccion.toLowerCase().includes(term.toLowerCase()) || school.institucion.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSchools(filteredSchls);
  };

  return (
    <div style={{ height: '100vh' }}>
      <Navbar handleSearchTerm={handleSearchTerm} />
        <div className="bg-secondary p-2 d-flex justify-content-center" style={{marginBottom: '20px'}}>
          <button className={`btn ${showSchools ? 'btn-dark active' : 'btn-secondary'} btn-sm mx-5`} onClick={handleescuelaClick}>
            Escuelas
          </button>
          <button className={`btn ${showInmuebles ? 'btn-dark active' : 'btn-secondary'} btn-sm mx-5`} onClick={handleinmueClick}>
            Inmuebles
          </button>
        </div>
        
      
        {showSchools && (
          <div className="container">
            {searchTerm ? (
              filteredSchools
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((property, index) => (
                  <div key={index} className="card mb-3 shadow" style={{ height: '165%' }}>
                    {/* Agregar estilos adicionales según sea necesario */}
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={`http://localhost:3031/images/${property.foto}`}
                          alt="Imagen"
                          className="img-fluid rounded-start"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{property.nombre}</h5>
                          <h6 className="card-title">{property.institucion}</h6>
                          <p className="card-text" style={{ marginTop: '20px' }}>
                            Dirección: {property.direccion}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/listainmuebles?id_escuela=${property.id_escuela}`);
                            }}
                              className="btn btn-secondary"
                              style={{ backgroundColor: '#beaf87', color: 'black' }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = '#9b8c5a')}
                              onMouseOut={(e) => (e.target.style.backgroundColor = '#beaf87')}
                          >
                            Inmuebles Cerca
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              registeredSchools
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((property, index) => (
                  <div key={index} className="card mb-3 shadow" style={{ height: '165%' }}>
                    {/* Agregar estilos adicionales según sea necesario */}
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={`http://localhost:3031/images/${property.foto}`}
                          alt="Imagen"
                          className="img-fluid rounded-start"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{property.nombre}</h5>
                          <h6 className="card-title">{property.institucion}</h6>
                          <p className="card-text" style={{ marginTop: '20px' }}>
                            Dirección: {property.direccion}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/listainmuebles?id_escuela=${property.id_escuela}`);
                            }}
                            className="btn btn-secondary"
                              style={{ backgroundColor: '#beaf87', color: 'black' }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = '#9b8c5a')}
                              onMouseOut={(e) => (e.target.style.backgroundColor = '#beaf87')}
                          >
                            Inmuebles Cerca
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

  
        {showInmuebles && (
          <div className="container">
            {searchTerm ? (
              filteredProperties
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((property, index) =>
                  (property.activo === 1 && property.activo_usuario === 0) && (
                    <div key={index} className="card mb-3 shadow">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={`http://localhost:3031/images/${property.foto}`}
                            alt="Imagen"
                            className="img-fluid rounded-start"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{property.titulo}</h5>
                            <p className="card-text">Dirección: {property.direccion}</p>
                            <p className="card-text">Escuela cercana: {property.nombre_escuela}</p>
                            <p className="card-text">Precio: {property.precio}</p>
                            <button
                              className="btn btn-secondary"
                              style={{ backgroundColor: '#beaf87', color: 'black' }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = '#9b8c5a')}
                              onMouseOut={(e) => (e.target.style.backgroundColor = '#beaf87')}
                              onClick={() => handleInfoEscuelaClick(property.id_inmueble)}
                            >
                              Mostrar información
                            </button>
                            {/* Agrega otros detalles de propiedad según sea necesario */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
            ) : (
              registeredProperties
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((property, index) =>
                (property.activo === 1 && property.activo_usuario === 0) && (
                    <div key={index} className="card mb-3 shadow">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={`http://localhost:3031/images/${property.foto}`}
                            alt="Imagen"
                            className="img-fluid rounded-start"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{property.titulo}</h5>
                            <p className="card-text">Dirección: {property.direccion}</p>
                            <p className="card-text">Escuela cercana: {property.nombre_escuela}</p>
                            <p className="card-text">Precio: {property.precio}</p>
                            <button
                              className="btn btn-secondary"
                              style={{ backgroundColor: '#beaf87', color: 'black' }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = '#9b8c5a')}
                              onMouseOut={(e) => (e.target.style.backgroundColor = '#beaf87')}
                              onClick={() => handleInfoEscuelaClick(property.id_inmueble)}
                            >
                              Mostrar información
                            </button>
                            {/* Agrega otros detalles de propiedad según sea necesario */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <button className="btn btn-light" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <i className="fa fa-arrow-left"></i> {/* Icono de flecha a la izquierda */}
          </button>
          <button
            className="btn btn-light"
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
    </div>
  );
}

export default Home