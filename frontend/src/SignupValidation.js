function Validation(values) {
    let errors = {};
  
    if (values.nombre.trim() === "") {
      errors.nombre = "El nombre no puede estar vacío";
    } else {
      errors.nombre = "";
    }
  
    if (values.correo === "") {
      errors.correo = "El correo no puede estar vacío";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
      errors.correo = "El correo no coincide";
    } else if (values.correo.length < 15 || values.correo.length > 50) {
      errors.correo = "El correo debe tener entre 15 y 50 caracteres";
    } else {
      errors.correo = "";
    }
  
    if (values.contrasena === "") {
      errors.contrasena = "La contraseña no puede estar vacía";
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,15}$/.test(values.contrasena)) {
      errors.contrasena = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener entre 8 y 15 caracteres";
    } else {
      errors.contrasena = "";
    }
  
    return errors;
  }
  
  export default Validation;
  