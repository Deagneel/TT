function Validation(values) {
  let errors = {};

  // Validaciones para el nombre
  if (values.nombre.trim() === "") {
    errors.nombre = "El nombre no puede estar vacío.";
  } else if (values.nombre.trim().length < 3) {
    errors.nombre = "Ingresa un nombre válido.";
  } else if (/(\w)\1{2}/.test(values.nombre)) {
    errors.nombre = "Ingresa un nombre válido.";
  } else {
    errors.nombre = "";
  }

  // Validaciones para el primer apellido
  if (values.primer_apellido.trim().length < 3) {
    errors.primer_apellido = "Ingresa un apellido válido.";
  } else if (/(\w)\1{2}/.test(values.primer_apellido)) {
    errors.primer_apellido = "Ingresa un apellido válido.";
  } else {
    errors.primer_apellido = "";
  }

  // Validaciones para el segundo apellido
  if (values.segundo_apellido.trim().length < 3) {
    errors.segundo_apellido = "Ingresa un apellido válido.";
  } else if (/(\w)\1{2}/.test(values.segundo_apellido)) {
    errors.segundo_apellido = "Ingresa un apellido válido.";
  } else {
    errors.segundo_apellido = "";
  }

  // Validaciones para el correo
  if (values.correo === "") {
    errors.correo = "El correo no puede estar vacío.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
    errors.correo = "El correo no es válido.";
  } else if (values.correo.length < 15 || values.correo.length > 50) {
    errors.correo = "El correo debe tener entre 15 y 50 caracteres.";
  } else {
    errors.correo = "";
  }

  // Validaciones para la contraseña
  if (values.contrasena === "") {
    errors.contrasena = "La contraseña no puede estar vacía.";
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,15}$/.test(values.contrasena)) {
    errors.contrasena = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener entre 8 y 15 caracteres.";
  } else {
    errors.contrasena = "";
  }

  return errors;
}

export default Validation;
