function Validation(values) {

    let error = {}

    const correo_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const contrasena_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/


    if(values.correo === "") {        
        error.correo = "El correo no puede estar vacío"    
    }     else if(!correo_pattern.test(values.correo)) {        
        error.correo = "El correo no coincide"    
    }    else {        error.correo = ""    }
    if(values.contrasena === "") {        
        error.contrasena = "La contraseña no puede estar vacía"    
    }     else if(!contrasena_pattern.test(values.contrasena)) {        
        error.contrasena = "La contraseña no coincide"    
    }     else {        
        error.contrasena = ""    
    }    
    return error;
}

export default Validation;