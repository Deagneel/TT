import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";
import { faPause, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapComponent from "./MapComponent"; // Asegúrate de que la ruta sea correcta

function Navbar({ handleSearchTerm }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (path, message) => {
    navigate(path);
    if (message) console.log(message);
  };

  const handleLogoutClick = async () => {
    try {
      const res = await axios.get("http://localhost:3031/logout");
      if (res.data.Status === "Success") {
        swal("Sesión Cerrada Correctamente", " ", "success");
        navigate("/login");
      } else {
        alert("error");
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
      <div
        className={`navbar-collapse ${
          menuOpen ? "show" : "collapse"
        } justify-content-center w-100`}
        id="navbarNav"
      >
        <ul className="navbar-nav w-100 justify-content-around">
          <li className="nav-item">
            <button
              type="button"
              className="nav-link btn btn-link"
              onClick={() => window.history.back()}
            >
              Volver
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link btn btn-link"
              onClick={() => handleClick("/homearrendador")}
            >
              Inicio
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link btn btn-link"
              onClick={() => handleClick("/perfilarrendatario")}
            >
              Perfil
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link btn btn-link"
              onClick={() =>
                handleClick("/correoobtencion", "Clic en el sobre")
              }
            >
              Chats
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link btn btn-link"
              onClick={handleLogoutClick}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function EditarInmueble() {
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3031").then((res) => {
      if (res.data.valid) {
      } else {
        navigate("/login");
      }
    });
  });

  const [aceptarTerminos, setAceptarTerminos] = useState(false);

  const handleCheckbox = () => {
    setAceptarTerminos(!aceptarTerminos);
  };
  const { id_inmueble } = useParams();
  const navigate = useNavigate();
  const [escuelas, setEscuelas] = useState([]);
  const [formData, setFormData] = useState({
    id: id_inmueble,
    title: "",
    address: "",
    asentamiento: "",
    cp: "",
    alcaldia: "",
    latitud: "",
    longitud: "",
    price: "",
    period: "mensual",
    numRooms: "",
    regulations: "",
    caracteristicas: "",
    images: "",
    idEscuela: "",
    privacyAccepted: false,
    Tvivienda: "",
    activo: "",
    foto: "",
  });
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseInmueble = await axios.get(
          `http://localhost:3031/infoinmuebles/${id_inmueble}`
        );
        console.log("Información del inmueble:", responseInmueble.data);
        setFormData((prevData) => ({
          ...prevData,
          title: responseInmueble.data.titulo,
          address: responseInmueble.data.direccion,
          asentamiento: responseInmueble.data.asentamiento,
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

        const responseEscuelas = await axios.get(
          "http://localhost:3031/obtenerEscuelas"
        );
        setEscuelas(responseEscuelas.data);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener información:", error);
      }
    };

    fetchData();
  }, [id_inmueble]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Definir las validaciones para campos específicos
    const validations = {
      title: (value) => !/[\d]/.test(value), // No permite números en el título
      cp: (value) => /^$|^[0-9]+$/.test(value), // Solo permite números en el código postal
      price: (value) => /^$|^[0-9]+$/.test(value), // Solo permite números en el precio
      numRooms: (value) => /^$|^[0-9]+$/.test(value), // Solo permite números en el número de habitaciones
      address: (value) =>
        value === "" || /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/.test(value), // Permite letras, números y espacios
    };

    const errorMessages = {
      title: "El título no puede incluir números",
      cp: "El código postal solo puede contener números",
      price: "El precio solo puede contener números",
      numRooms: "El número de habitaciones solo puede contener números",
      address:
        "El campo calle y número no puede incluir caracteres especiales.",
    };

    // Aplicar validaciones solo a los campos definidos
    if (validations[name] && !validations[name](value)) {
      swal(errorMessages[name], "", "error");
      return; // Detener la ejecución si la validación falla
    }

    // Actualizar el estado manteniendo la lógica existente
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = async () => {
    // Validar la longitud mínima de título.
    if (formData.regulations.trim().length < 10) {
      swal(
        "Error",
        "Necesitamos un poco más de información en el reglamento.",
        "error"
      );
      return;
    }

    // Validar la longitud mínima de características.
    if (formData.caracteristicas.trim().length < 10) {
      swal(
        "Error",
        "Necesitamos un poco más de información en las características.",
        "error"
      );
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
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("asentamiento", formData.asentamiento);
      formDataToSend.append("cp", formData.cp);
      formDataToSend.append("alcaldia", formData.alcaldia);
      formDataToSend.append("latitud", formData.latitud);
      formDataToSend.append("longitud", formData.longitud);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("period", formData.period);
      formDataToSend.append("numRooms", formData.numRooms);
      formDataToSend.append("regulations", formData.regulations);
      formDataToSend.append("caracteristicas", formData.caracteristicas);
      formDataToSend.append("idEscuela", formData.idEscuela);
      formDataToSend.append("Tvivienda", formData.Tvivienda);
      formDataToSend.append("activo", formData.activo);
      formDataToSend.append("foto", formData.foto);
      await axios.put(
        `http://localhost:3031/editarinmueble/${id_inmueble}`,
        formDataToSend
      );

      swal("Datos Actualizados Correctamente", " ", "success");
      navigate("/homearrendador");
    } catch (error) {
      console.error("Error al editar el inmueble:", error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  const handlePause = async () => {
    try {
      console.log("Valor actual de activo:", formData.activo);
      const updatedData = {
        ...formData,
        activo: formData.activo == "1" ? "0" : "1", // Cambiar el valor de activo
      };

      // Realizar la petición PUT con todos los campos existentes y activo actualizado
      await axios.put(
        `http://localhost:3031/editarinmueble/${id_inmueble}`,
        updatedData
      );

      swal("Inmueble actualizado correctamente", "", "success");
      navigate("/homearrendador");
    } catch (error) {
      console.error("Error al actualizar el inmueble:", error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      console.error("No se seleccionó ninguna imagen");
      return;
    }

    // Validar que el archivo sea una imagen PNG o JPG
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(selectedFile.type)) {
      console.error("El archivo debe ser una imagen en formato JPG o PNG");
      swal("Error", "Solo se aceptan imágenes en formato JPG o PNG.", "error");
      e.target.value = ""; // Esto resetea el input
      return;
    }

    const formDataImage = new FormData();
    formDataImage.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3031/upload",
        formDataImage
      );
      console.log("Imagen subida:", response.data);

      // Actualizar el estado con la URL de la imagen
      setFormData((prevData) => ({
        ...prevData,
        foto: response.data.url,
      }));
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handlecpvalidation = async () => {
    const cpInput = document.getElementById("cp");
    const cpValue = cpInput.value;

    try {
      const response = await axios.get(
        `http://localhost:3031/validateCP?cp=${cpValue}`
      );
      if (response.status === 200) {
        setFormData({
          ...formData,
          asentamiento: response.data.asentamiento,
          alcaldia: response.data.alcaldia, // Actualiza el estado con la alcaldía
        });
      } else {
        console.error("Error en la solicitud al servidor: ", response.status);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        swal("Código postal no encontrado", "", "error");
      } else {
        // Manejo de otros errores
        swal("Error en la solicitud al servidor", "", "error");
        console.error("Error en la solicitud al servidor soy try", error);
      }
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
        await axios.delete(
          `http://localhost:3031/eliminarinmueble/${id_inmueble}`
        );
        swal("Inmueble eliminado con éxito", {
          icon: "success",
        });
        navigate("/homearrendador");
      } else {
        // Mostrar SweetAlert2 de cancelación
        swal("Operación Cancelada");
      }
    } catch (error) {
      console.error("Error al eliminar el inmueble:", error);
      // Manejar el error aquí, mostrar un mensaje al usuario, etc.
    }
  };

  return (
    <div className="registro-inmueble-container">
      <Navbar />
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column align-items-center">
          <p className="fw-bold mb-0">
            {formData.activo == "1" ? "Activar inmueble" : "Pausar inmueble"}
          </p>
          <button className="btn mt-2" onClick={handlePause}>
            <FontAwesomeIcon icon={faPause} />
          </button>
        </div>
        <div style={{ width: "80px" }}></div>
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
          <label htmlFor="title" className="form-label">
            Título del anuncio
          </label>
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
          <label htmlFor="address" className="form-label">
            Calle y número
          </label>
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

        {/* Asentamiento */}
        <div className="mb-3">
          <label
            htmlFor="asentamiento"
            style={{ fontWeight: "bold", fontSize: "18px" }}
          >
            Asentamiento<span style={{ color: "red" }}>*</span>
          </label>
          <input
            disabled
            type="text"
            className="form-control"
            id="asentamiento"
            name="asentamiento"
            value={formData.asentamiento}
            onChange={handleChange}
            placeholder="..."
          />
        </div>

        {/* Código Postal */}
        <div className="mb-3">
          <label htmlFor="cp" style={{ fontWeight: "bold", fontSize: "18px" }}>
            Código Postal<span style={{ color: "red" }}>*</span>
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="cp"
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              placeholder="Ingrese el Código Postal"
            />
            <div className="input-group-append">
              <button
                onClick={handlecpvalidation}
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
              >
                Validar
              </button>
            </div>
          </div>
        </div>

        {/* Alcaldía */}
        <div className="mb-3">
          <label htmlFor="alcaldia" className="form-label">
            Alcaldía
          </label>
          <input
            disabled
            type="text"
            name="alcaldia"
            id="alcaldia"
            value={formData.alcaldia}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese la Alcaldía"
          />
        </div>

        {/* Mapa para seleccionar la ubicación */}
        <MapComponent
          latitud={parseFloat(formData.latitud)}
          longitud={parseFloat(formData.longitud)}
          onMarkerDragEnd={(position) => {
            setFormData({
              ...formData,
              latitud: position.lat,
              longitud: position.lng,
            });
          }}
        />

        {/* Escuela cercana */}
        <div className="mb-3">
          <label htmlFor="idEscuela" className="form-label">
            Escuela cercana
          </label>
          <select
            name="idEscuela"
            id="idEscuela"
            value={formData.idEscuela}
            onChange={handleChange}
            className="form-select"
          >
            {escuelas.map((escuela, index) => (
              <option key={index} value={escuela.id_escuela}>
                {escuela.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de vivienda */}
        <div className="mb-3">
          <label htmlFor="Tvivienda" className="form-label">
            Tipo de vivienda
          </label>
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
            <label htmlFor="price" className="form-label">
              Precio
            </label>
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
            <label htmlFor="period" className="form-label">
              Periodo de renta
            </label>
            <select
              name="period"
              id="period"
              value={formData.period}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Mensual">Mensual</option>
              <option value="Cuatrimestral">Cuatrimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        </div>

        {/* Número de habitaciones */}
        <div className="mb-3">
          <label htmlFor="numRooms" className="form-label">
            Número de habitaciones
          </label>
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
        <div className="mb-5" style={{ maxWidth: "100%" }}>
          <label htmlFor="regulations" className="form-label">
            Reglamento
          </label>
          <textarea
            name="regulations"
            id="regulations"
            value={formData.regulations}
            onChange={handleChange}
            className="form-control mh-100"
            style={{ width: "600px", height: "300px" }}
          ></textarea>
        </div>

        {/* Caracteristicas */}
        <div className="mb-5" style={{ maxWidth: "100%" }}>
          <label htmlFor="caracteristicas" className="form-label">
            Características
          </label>
          <textarea
            name="caracteristicas"
            id="caracteristicas"
            value={formData.caracteristicas}
            onChange={handleChange}
            className="form-control mh-100"
            style={{ width: "600px", height: "300px" }}
          ></textarea>
        </div>

        {/* Imagen */}
        <div className="mb-3">
          <label
            htmlFor="imageUpload"
            className="form-label"
            value={formData.foto}
          >
            Imagen
          </label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleFileChange}
            className="form-control"
          />
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
            Acepto las <Link to="/privacypolicy">políticas de privacidad</Link>
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
