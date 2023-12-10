import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';
import { faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function EditarInmueble() {
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

  const handleCheckbox = () => {
    setAceptarTerminos(!aceptarTerminos);
  };
  const { id_inmueble } = useParams();
  const navigate = useNavigate();
  const [escuelas, setEscuelas] = useState([]);
  const [formData, setFormData] = useState({
    id: id_inmueble,
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
    images: '',
    idEscuela: '',
    privacyAccepted: false,
    Tvivienda: '',
    activo: '',
    foto:'',
  });
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseInmueble = await axios.get(`http://localhost:3031/infoinmuebles/${id_inmueble}`);
        console.log('Información del inmueble:', responseInmueble.data);
        setFormData((prevData) => ({
          ...prevData,
          title: responseInmueble.data.titulo,
          address: responseInmueble.data.direccion,
          cp: responseInmueble.data.cp,
          alcaldia: responseInmueble.data.alcaldia,
          latitud: responseInmueble.data.latitud,
          longitud: responseInmueble.data.longitud,
          price: responseInmueble.data.precio,
          period: responseInmueble.data.periodo_de_renta,
          numRooms: responseInmueble.data.no_habitaciones,
          regulations: responseInmueble.data.reglamento,
          caracteristicas: responseInmueble.data.caracteristicas,
          foto: responseInmueble.data.foto,
          idEscuela: responseInmueble.data.id_escuela,
          Tvivienda: responseInmueble.data.tipo_de_habitacion,
          activo: responseInmueble.data.activo_usuario,
          privacyAccepted: responseInmueble.data.privacyAccepted || false,
        }));


        const responseEscuelas = await axios.get('http://localhost:3031/obtenerEscuelas');
        setEscuelas(responseEscuelas.data);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener información:', error);
      }
    };

    fetchData();
  }, [id_inmueble]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('cp', formData.cp);
      formDataToSend.append('alcaldia', formData.alcaldia);
      formDataToSend.append('latitud', formData.latitud);
      formDataToSend.append('longitud', formData.longitud);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('period', formData.period);
      formDataToSend.append('numRooms', formData.numRooms);
      formDataToSend.append('regulations', formData.regulations);
      formDataToSend.append('caracteristicas', formData.caracteristicas);
      formDataToSend.append('idEscuela', formData.idEscuela);
      formDataToSend.append('Tvivienda', formData.Tvivienda);
      formDataToSend.append('activo', formData.activo);
      formDataToSend.append('foto', formData.foto);
      await axios.put(`http://localhost:3031/editarinmueble/${id_inmueble}`, formDataToSend);

      swal("Datos Actualizados Correctamente", " ", "success");
      navigate('/homearrendador');
    } catch (error) {
      console.error('Error al editar el inmueble:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  const handlePause = async () => {
    try {
      console.log('Valor actual de activo:', formData.activo);
      const updatedData = {
        ...formData,
        activo: formData.activo == '1' ? '0' : '1', // Cambiar el valor de activo
      };
  
      // Realizar la petición PUT con todos los campos existentes y activo actualizado
      await axios.put(`http://localhost:3031/editarinmueble/${id_inmueble}`, updatedData);
  
      swal("Inmueble actualizado correctamente", "", "success");
      navigate('/homearrendador');
    } catch (error) {
      console.error('Error al actualizar el inmueble:', error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      console.error('No se seleccionó ninguna imagen');
      return;
    }
  
    const formDataImage = new FormData();
    formDataImage.append('image', selectedFile);
  
    try {
      const response = await axios.post('http://localhost:3031/upload', formDataImage);
      console.log('Imagen subida:', response.data);
  
      // Actualizar el estado con la URL de la imagen
      setFormData(prevData => ({
        ...prevData,
        foto: response.data.url,
      }));
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };
  
  
  
  
  
  const handleDelete = async () => {
    try {
      const willDelete = await swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no se podrá recuperar el inmueble.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (willDelete) {
        await axios.delete(`http://localhost:3031/eliminarinmueble/${id_inmueble}`);
        swal("Inmueble eliminado con éxito", {
          icon: "success",
        });
        navigate('/homearrendador');
    } else {
      // Mostrar SweetAlert2 de cancelación
      swal("Operación Cancelada");
    }
    } catch (error) {
      console.error('Error al eliminar el inmueble:', error);
      // Manejar el error aquí, mostrar un mensaje al usuario, etc.
    }
  };


  return (
    <div className="registro-inmueble-container">
      <Navbar />
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column align-items-center">
          <p className="fw-bold mb-0">
            {formData.activo == '1' ? 'Activar inmueble' : 'Pausar inmueble'}
          </p>
          <button className="btn mt-2" onClick={handlePause}>
            <FontAwesomeIcon icon={faPause} />
          </button>
        </div>
        <div style={{ width: '80px' }}></div>
        <div className="d-flex flex-column align-items-center">
          <p className="fw-bold mb-0">Eliminar inmueble</p>
          <button className="btn mt-2" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
  
      <div className="centered-content">
        <h1 className="h3 fw-bold mb-3">Editar inmueble</h1>
  
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título del anuncio</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa el título del anuncio..."
          />
        </div>
  
        {/* Repetir la estructura anterior para los otros campos del formulario */}
        
        {/* Dirección */}
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Dirección</label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese la dirección"
          />
        </div>
  
        {/* Código Postal */}
        <div className="mb-3">
          <label htmlFor="cp" className="form-label">Código Postal</label>
          <input
            type="text"
            name="cp"
            id="cp"
            value={formData.cp}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese el código postal"
          />
        </div>
  
        {/* Alcaldía */}
        <div className="mb-3">
          <label htmlFor="alcaldia" className="form-label">Alcaldía</label>
          <input
            type="text"
            name="alcaldia"
            id="alcaldia"
            value={formData.alcaldia}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese la Alcaldía"
          />
        </div>
  
        {/* Latitud */}
        <div className="mb-3">
          <label htmlFor="latitud" className="form-label">Latitud</label>
          <input
            type="text"
            name="latitud"
            id="latitud"
            value={formData.latitud}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese la Latitud"
          />
        </div>
  
        {/* Longitud */}
        <div className="mb-3">
          <label htmlFor="longitud" className="form-label">Longitud</label>
          <input
            type="text"
            name="longitud"
            id="longitud"
            value={formData.longitud}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese la longitud"
          />
        </div>
  
        {/* Escuela cercana */}
        <div className="mb-3">
          <label htmlFor="idEscuela" className="form-label">Escuela cercana</label>
          <select
            name="idEscuela"
            id="idEscuela"
            value={formData.idEscuela}
            onChange={handleChange}
            className="form-select"
          >
            {escuelas.map((escuela, index) => (
              <option key={index} value={escuela.id_escuela}>{escuela.nombre}</option>
            ))}
          </select>
        </div>
  
        {/* Tipo de vivienda */}
        <div className="mb-3">
          <label htmlFor="Tvivienda" className="form-label">Tipo de vivienda</label>
          <select
            name="Tvivienda"
            id="Tvivienda"
            value={formData.Tvivienda}
            onChange={handleChange}
            className="form-select"
          >
            <option value="0">Individual</option>
            <option value="1">Compartida</option>
          </select>
        </div>
  
        {/* Precio y Periodo */}
        <div className="row">
          <div className="col">
            <label htmlFor="price" className="form-label">Precio</label>
            <input
              type="text"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <label htmlFor="period" className="form-label">Periodo</label>
            <select
              name="period"
              id="period"
              value={formData.period}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Mensual">Mensual</option>
              <option value="Bimestral">Bimestral</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Cuatrimestral">Cuatrimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        </div>
  
        {/* Número de habitaciones */}
        <div className="mb-3">
          <label htmlFor="numRooms" className="form-label">Número de habitaciones</label>
          <input
            type="text"
            name="numRooms"
            id="numRooms"
            value={formData.numRooms}
            onChange={handleChange}
            className="form-control"
          />
        </div>
  
        {/* Reglamento */}
        <div 
            className="mb-5" 
            style={{ maxWidth: '100%' }}
          >
            <label htmlFor="regulations" className="form-label">Reglamento</label>
            <textarea
              name="regulations"
              id="regulations"
              value={formData.regulations}
              onChange={handleChange}
              className="form-control mh-100"
              style={{ width: '600px', height: '300px' }}
            ></textarea>
          </div>

          {/* Caracteristicas */}
        <div 
            className="mb-5" 
            style={{ maxWidth: '100%' }}
          >
            <label htmlFor="caracteristicas" className="form-label">Características</label>
            <textarea
              name="caracteristicas"
              id="caracteristicas"
              value={formData.caracteristicas}
              onChange={handleChange}
              className="form-control mh-100"
              style={{ width: '600px', height: '300px' }}
            ></textarea>
          </div>

  
        {/* Imagen */}
        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label" value={formData.foto}>Imagen</label>
          <input type="file" id="imageUpload" onChange={handleFileChange} className="form-control" />
          
        </div>
  
        {/* Políticas de privacidad */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="aceptar_terminos"
            id="aceptar_terminos"
            onChange={handleCheckbox}
            checked={aceptarTerminos}
            className="form-check-input"
          />
          <label htmlFor="aceptar_terminos" className="form-check-label">
            Acepto políticas de privacidad
          </label>
        </div>
  
        <button
          className="btn btn-primary"
          onClick={handleEdit}
          disabled={!aceptarTerminos}
        >
          Editar
        </button>
      </div>
    </div>
  );
  

}

export default EditarInmueble;