import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import axios from 'axios';



const salt = 10;
const app = express();

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer ({
    storage: storage 
})

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret', //llave secreta para cifrar la cookie de la sesión
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 100*60*60*24
    } //propiedades de la cookie

}))

const db = mysql.createConnection({
  host: "bccdb0knkukccxehxrur-mysql.services.clever-cloud.com",
  user: "u0umkw3bjydys9qe",
  password: "jS9hYCGfJdgbZ4wHnbyg",
  database: 'bccdb0knkukccxehxrur'
});
/*
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistemarentas"
});*/

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
    console.log('Conexión a la base de datos establecida');
});

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.json({url: req.file.filename});
})

app.get('/', (req, res) => {
    if(req.session.user.nombre) {
        return res.json({valid: true, nombre: req.session.user.correo})
    } else {
        return res.json({valid:false})
    }
})

app.get('/perfil', (req, res) => {
    const id_usuario = req.session.user ? req.session.user.id : null;

    if (id_usuario) {
        db.query('SELECT id_usuario, nombre, correo FROM usuario WHERE id_usuario = ?', [id_usuario], (err, result) => {
            if (err) {
                console.error('Error al obtener datos de la tabla usuario:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                // Verifica si hay al menos un resultado
                const perfil = result.length > 0 ? result[0] : null;
                res.json(perfil);
            }
        });
    } else {
        res.status(401).json({ error: 'No se proporcionó un usuario válido en la sesión.' });
    }
});

  

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

// Ruta para manejar la solicitud POST de registro de usuarios
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO usuario (nombre, correo, contrasena, tipo_de_usuario) VALUES (?, ?, ?, ?)";

  bcrypt.hash(req.body.contrasena, salt, async (err, hash) => {
      if (err) {
          console.log(err);
          return res.json("Error hashing password");
      }

      const values = [
          req.body.nombre,
          req.body.correo,
          hash,
          req.body.tipo_de_usuario
      ];

      // Imprimir la contraseña en la consola (Solo para propósitos de depuración)
      console.log('Contraseña:', req.body.contrasena);

      db.query(sql, values, async (err, data) => {
          if (err) {
              console.log(err);
              return res.json("Error inserting into database");
          }

          // Imprimir en la consola información relevante incluyendo la contraseña
          console.log('Nuevo usuario registrado:', {
              nombre: req.body.nombre,
              correo: req.body.correo,
              contrasena: req.body.contrasena,
              tipo_de_usuario: req.body.tipo_de_usuario
          });

          return res.json(data);
      });
  });
});

// Ruta para manejar la solicitud POST de inicio de sesión
app.post('/login', (req, res) => {


  const sql = "SELECT * FROM usuario WHERE correo = ?";
  console.log('Correo proporcionado:', req.body.correo);

  db.query(sql, [req.body.correo], (err, data) => {
      if (err) {
          console.error('Error en la consulta a la base de datos:', err);
          return res.json("Error");
      } 

      if (data.length > 0) {
          console.log('Datos de la base de datos:', data);

          // Imprimir las contraseñas antes de la comparación
          console.log('Contraseña proporcionada en la solicitud:', req.body.contrasena);
          console.log('Contraseña almacenada en la base de datos:', data[0].contrasena);

          bcrypt.compare(req.body.contrasena.toString(), data[0].contrasena, (err, response) => {
              if (err) {
                  console.error('Error al comparar contraseñas:', err);
                  return res.json("Error: Contraseña incorrecta");
              }

              console.log('Resultado de la comparación de contraseñas:', response);

              if (response) {
                  req.session.user = {
                      id: data[0].id_usuario,
                      nombre: data[0].nombre,
                      correo: data[0].correo
                  };
                  console.log(req.session.user);
                  return res.json({ Login: true, tipo_de_usuario: data[0].tipo_de_usuario});
              }
              return res.json({ Login: false });                
          });
      } else {
          console.log('No se encontró ningún usuario con ese correo.');
          return res.json("Fail: No coincide correo");
      }
  });
});

// Ruta para manejar la solicitud POST de registro de usuarios
app.post('/registroinmueble', (req, res) => {

    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const sql = "INSERT INTO inmueble (titulo, direccion, cp, alcaldia, latitud, longitud, precio, periodo_de_renta, no_habitaciones, reglamento, foto, id_usuario, id_escuela, tipo_de_habitacion, activo) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
    const values = [
        req.body.title,
        req.body.address,
        req.body.cp,
        req.body.alcaldia,
        req.body.latitud,
        req.body.longitud,
        req.body.price,
        req.body.period,
        req.body.numRooms,
        req.body.regulations,
        req.body.images,
        req.session.user.id,
        req.body.idEscuela,
        req.body.Tvivienda,
        req.body.activo
    ];
    console.log(req.session.user.id);
    db.query(sql, values, (err, data) => {
        if (err) {
            console.log(err);
            return res.json("Error inserting into database");
        }

        return res.json(data);
    });
});

// Ruta para obtener datos de la tabla "escuela"
app.get('/', (req, res) => {
    const sql = "SELECT * FROM escuela";
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error inside server" });
        return res.json(result);
    });
});

// Ruta para obtener datos de la tabla "escuela"
app.get('/obtenerEscuelas', (req, res) => {
    const sql = "SELECT * FROM escuela"; // Selecciona solo el campo "nombre" de la tabla
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener datos de escuela:', err);
            return res.json({ message: "Error al obtener datos de escuela" });
        }
        return res.json(result);
    });
});

// Ruta para obtener datos de una escuela específica según su ID
app.get('/escuela/:id_escuela', (req, res) => {
  const id_escuela = req.params.id_escuela;
  const sql = "SELECT * FROM escuela WHERE id_escuela = ?"; // Filtra por el ID de la escuela
  db.query(sql, [id_escuela], (err, result) => {
      if (err) {
          console.error('Error al obtener datos de escuela:', err);
          return res.json({ message: "Error al obtener datos de escuela" });
      }
      return res.json(result);
  });
});

// Ruta para obtener datos de la tabla "inmueble"
app.get('/inmuebles', (req, res) => {
    // Obtiene el valor del parámetro id_usuario de la solicitud
    const id_usuario = req.session.user.id;
  
    // Realiza la consulta a tu base de datos para obtener los datos de la tabla inmueble
    db.query('SELECT * FROM inmueble WHERE id_usuario = ?', [id_usuario], (err, result) => {
      if (err) {
        console.error('Error al obtener datos de la tabla inmueble:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.json(result);
      }
    });
  });

  // Ruta para obtener información de un inmueble por ID
app.get('/infoinmuebles/:id_inmueble', (req, res) => {
    const id_inmueble = req.params.id_inmueble;
  
    // Consulta SQL para obtener la información del inmueble
    const sql = `SELECT * FROM inmueble WHERE id_inmueble = ?`;
  
    db.query(sql, [id_inmueble], (err, result) => {
      if (err) {
        console.error('Error al obtener el inmueble:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        if (result.length > 0) {
          // Si se encuentra el inmueble, envía la información al cliente
          res.json(result[0]);
        } else {
          // Si no se encuentra el inmueble, devuelve un mensaje de error
          res.status(404).send('Inmueble no encontrado');
        }
      }
    });
  });

  app.put('/newName/:id', (req, res) => {
    const userId = req.params.id;
    const nuevoNombre = req.body.nombre; // Obtén el nombre del cuerpo de la solicitud
  
    // Verificar si el nombre está presente en la solicitud
    if (!nuevoNombre) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
    }
  
    // Realizar la consulta SQL para actualizar el nombre del usuario
    const sql = 'UPDATE usuario SET nombre = ? WHERE id_usuario = ?';
    db.query(sql, [nuevoNombre, userId], (err, result) => {
      if (err) {
        console.error('Error al actualizar el nombre: ' + err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Enviar una respuesta de éxito
      res.json({ mensaje: 'Nombre de usuario actualizado exitosamente.' });
    });
  });

  app.put('/newName/:id', (req, res) => {
    const userId = req.params.id;
    const nuevoNombre = req.body.nombre; // Obtén el nombre del cuerpo de la solicitud
  
    // Verificar si el nombre está presente en la solicitud
    if (!nuevoNombre) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
    }
  
    // Realizar la consulta SQL para actualizar el nombre del usuario
    const sql = 'UPDATE usuario SET nombre = ? WHERE id_usuario = ?';
    db.query(sql, [nuevoNombre, userId], (err, result) => {
      if (err) {
        console.error('Error al actualizar el nombre: ' + err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Enviar una respuesta de éxito
      res.json({ mensaje: 'Nombre de usuario actualizado exitosamente.' });
    });
  });

  app.put('/newMail/:id', (req, res) => {
    const userId = req.params.id;
    const nuevoCorreo = req.body.correo; // Obtén el nombre del cuerpo de la solicitud
  
    // Verificar si el nombre está presente en la solicitud
    if (!nuevoCorreo) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
    }
  
    // Realizar la consulta SQL para actualizar el nombre del usuario
    const sql = 'UPDATE usuario SET correo = ? WHERE id_usuario = ?';
    db.query(sql, [nuevoCorreo, userId], (err, result) => {
      if (err) {
        console.error('Error al actualizar el nombre: ' + err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Enviar una respuesta de éxito
      res.json({ mensaje: 'Correo de usuario actualizado exitosamente.' });
    });
  });

  app.put('/newIne/:id', (req, res) => {
    const userId = req.params.id;
    const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud
  
    // Verificar si el nombre está presente en la solicitud
    if (!nueva) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
    }
  
    // Realizar la consulta SQL para actualizar el nombre del usuario
    const sql = 'UPDATE usuario SET identificacion_oficial = ? WHERE id_usuario = ?';
    db.query(sql, [nueva, userId], (err, result) => {
      if (err) {
        console.error('Error al actualizar INE: ' + err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Enviar una respuesta de éxito
      res.json({ mensaje: 'Correo de usuario actualizado exitosamente.' });
    });
  });

  app.put('/newCredencial/:id', (req, res) => {
    const userId = req.params.id;
    const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud
  
    // Verificar si el nombre está presente en la solicitud
    if (!nueva) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
    }
  
    // Realizar la consulta SQL para actualizar el nombre del usuario
    const sql = 'UPDATE usuario SET credencial_de_estudiante = ? WHERE id_usuario = ?';
    db.query(sql, [nueva, userId], (err, result) => {
      if (err) {
        console.error('Error al actualizar Credencial de Estudiante: ' + err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Enviar una respuesta de éxito
      res.json({ mensaje: 'Credenecial de Estudiante actualizada exitosamente.' });
    });
  });

  app.put('/newComprobante/:id', (req, res) => {
    const userId = req.params.id;
    const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud
  
    // Verificar si el nombre está presente en la solicitud
    if (!nueva) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
    }
  
    // Realizar la consulta SQL para actualizar el nombre del usuario
    const sql = 'UPDATE usuario SET comprobante_de_inscripcion = ? WHERE id_usuario = ?';
    db.query(sql, [nueva, userId], (err, result) => {
      if (err) {
        console.error('Error al actualizar Credencial de Estudiante: ' + err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Enviar una respuesta de éxito
      res.json({ mensaje: 'Comprobante de innscipción actualizado exitosamente.' });
    });
  });
  
  // Actualizar información de un inmueble por ID
app.put('/infoinmuebles/:id_inmueble', upload.none(), (req, res) => {
    const id_inmueble = req.params.id_inmueble;
    const updatedData = {
      title: req.body.title,
      address: req.body.address,
      coordinates: req.body.coordinates,
      price: req.body.price,
      period: req.body.period,
      numRooms: req.body.numRooms,
      regulations: req.body.regulations,
      idEscuela: req.body.idEscuela,
      Tvivienda: req.body.Tvivienda,
      activo: req.body.activo,
    }; // Datos actualizados del inmueble
  
    // Consulta SQL para actualizar la información del inmueble
    const updateSql = `UPDATE inmueble SET ? WHERE id_inmueble = ?;`;
  
    db.query(updateSql, [updatedData, id_inmueble], (err, result) => {
      if (err) {
        console.error('Error al actualizar el inmueble:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        if (result.affectedRows > 0) {
          // Si se actualiza el inmueble correctamente, devuelve un mensaje de éxito
          res.status(200).send('Inmueble actualizado correctamente');
        } else {
          // Si no se encuentra el inmueble, devuelve un mensaje de error
          res.status(404).send('Inmueble no encontrado');
        }
      }
    });
  });

  app.put('/editarinmueble/:id_inmueble', upload.none(), (req, res) => {
    // Obtén el ID del inmueble de los parámetros de la URL
    const id_inmueble = req.params.id_inmueble;

    // Verifica si el usuario está autenticado
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Datos actualizados del inmueble
    const updatedData = {
        titulo: req.body.title,
        direccion: req.body.address,
        cp: req.body.cp,
        alcaldia: req.body.alcaldia,
        latitud: req.body.latitud,
        longitud: req.body.longitud,
        precio: req.body.price,
        periodo_de_renta: req.body.period,
        no_habitaciones: req.body.numRooms,
        reglamento: req.body.regulations,
        tipo_de_habitacion : req.body.Tvivienda,
        activo_usuario: req.body.activo,
    };

    // Consulta SQL para actualizar la información del inmueble
    const updateSql = `UPDATE inmueble SET ? WHERE id_inmueble = ?;`;

    // Ejecuta la consulta SQL
    db.query(updateSql, [updatedData, id_inmueble], (err, result) => {
        if (err) {
            console.error('Error al actualizar el inmueble:', err);
            return res.status(500).json('Error interno del servidor');
        } else {
            if (result.affectedRows > 0) {
                // Si se actualiza el inmueble correctamente, devuelve un mensaje de éxito
                return res.status(200).json('Inmueble actualizado correctamente');
            } else {
                // Si no se encuentra el inmueble, devuelve un mensaje de error
                return res.status(404).json('Inmueble no encontrado');
            }
        }
    });
});

app.delete('/eliminarinmueble/:id_inmueble', (req, res) => {
  const id_inmueble = req.params.id_inmueble;

  const deleteSql = `DELETE FROM inmueble WHERE id_inmueble = ?`;

  db.query(deleteSql, [id_inmueble], (err, result) => {
    if (err) {
      console.error('Error al eliminar el inmueble:', err);
      return res.status(500).json('Error interno del servidor');
    } else {
      if (result.affectedRows > 0) {
        // Si se elimina el inmueble correctamente, devuelve un mensaje de éxito
        return res.status(200).json('Inmueble eliminado correctamente');
      } else {
        // Si no se encuentra el inmueble, devuelve un mensaje de error
        return res.status(404).json('Inmueble no encontrado');
      }
    }
  });
});



// Ruta para eliminar usuario
app.delete('/eliminarUsuario/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;

  const sql = 'DELETE FROM usuario WHERE id_usuario = ?';

  db.query(sql, [idUsuario], (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Usuario y registros relacionados eliminados correctamente' });
    }
  });
});
  

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Ruta para obtener datos de la tabla "escuela"
app.get('/obtenerEscuelas', (req, res) => {
    const sql = "SELECT * FROM escuela"; // Selecciona solo el campo "nombre" de la tabla
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener datos de escuela:', err);
            return res.json({ message: "Error al obtener datos de escuela" });
        }
        return res.json(result);
    });
});

//Consulta en union de la tabla escuela e inmueble para HomeArrendatario
app.get('/inmueblearrendatario', (req, res) => {
    const sql = `
      SELECT i.*, e.nombre AS nombre_escuela 
      FROM inmueble AS i 
      LEFT JOIN escuela AS e ON i.id_escuela = e.id_escuela
    `;
    
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener datos de la tabla inmueble:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.json(result);
      }
    });
  });

  app.get('/obtenerReporteesp/:id_reporte', (req, res) => {
    const { id_reporte } = req.params;
  
    const sql = 'SELECT * FROM reporte WHERE id_reporte = ?';
  
    db.query(sql, [id_reporte], (err, result) => {
      if (err) {
        console.error('Error al obtener el reporte:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        if (result.length === 0) {
          res.status(404).json({ error: 'Reporte no encontrado' });
        } else {
          res.json(result[0]);
        }
      }
    });
  });
  




//Sección reportes y admon
app.put('/actualizarEstado/:id_reporte', (req, res) => {
  const { id_reporte } = req.params;
  const { estado } = req.body;

  const sql = 'UPDATE reporte SET estado = ? WHERE id_reporte = ?';

  db.query(sql, [estado, id_reporte], (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado del reporte:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Estado del reporte actualizado correctamente' });
    }
  });
});

  // Ruta para llenar los datos de la tabla reporte
  app.post('/generarReporte', (req, res) => {
    const sql = "INSERT INTO reporte (asunto, descripción, fecha, estado, id_usuario , id_inmueble) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.aff,
        req.body.description,
        req.body.date,
        req.body.state,
        req.body.id_usuario,
        req.body.id_inmueble
    ];
    console.log(req.session.user.id);
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        return res.json({ message: 'Datos insertados correctamente' });
    });
});

// Realizar la consulta SQL para obtener los datos de la tabla "reporte"
app.get('/obtenerReportes', (req, res) => {
  
  const sql = 'SELECT * FROM reporte';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener datos de reporte:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(result);
    }
  });
});


app.get('/obtenerReportesPorUsuario/:parametroBusqueda', (req, res) => {
  const { parametroBusqueda } = req.params;
  const sql = `
    SELECT r.*, u.nombre AS nombre_usuario 
    FROM reporte r 
    INNER JOIN usuario u ON r.id_usuario = u.id_usuario 
    WHERE r.id_usuario = ? OR u.nombre LIKE ?
  `;

  const searchParam = `%${parametroBusqueda}%`; // Para buscar coincidencias parciales del nombre

  db.query(sql, [parametroBusqueda, searchParam], (err, result) => {
    if (err) {
      console.error('Error al obtener datos de reporte por usuario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(result);
    }
  });
});

app.get('/obtenerReportesPorInmueble/:parametroBusqueda', (req, res) => {
  const { parametroBusqueda } = req.params;
  const sql = `
    SELECT r.*, u.titulo AS nombre_inmueble 
    FROM reporte r 
    INNER JOIN inmueble u ON r.id_inmueble = u.id_inmueble
    WHERE r.id_inmueble = ? OR u.titulo LIKE ?
  `;

  const searchParam = `%${parametroBusqueda}%`; // Para buscar coincidencias parciales del nombre

  db.query(sql, [parametroBusqueda, searchParam], (err, result) => {
    if (err) {
      console.error('Error al obtener datos de reporte por usuario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(result);
    }
  });
});

app.get('/obtenerNombreUsuario/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  const sql = 'SELECT nombre FROM usuario WHERE id_usuario = ?';

  db.query(sql, [idUsuario], (err, result) => {
    if (err) {
      console.error('Error al obtener el nombre del usuario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(result[0]?.nombre || 'Usuario no encontrado');
    }
  });
});

app.get('/obtenerTituloInmueble/:idInmueble', (req, res) => {
  const { idInmueble } = req.params;
  const sql = 'SELECT titulo FROM inmueble WHERE id_inmueble = ?';

  db.query(sql, [idInmueble], (err, result) => {
    if (err) {
      console.error('Error al obtener el título del inmueble:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(result[0]?.titulo || 'Inmueble no encontrado');
    }
  });
});






// Ruta para obtener datos de la tabla "inmueble"
app.get('/obtenerInmuebleInfo/:id_inmueble', (req, res) => {
    const id_inmueble = req.params.id_inmueble;
    const sql = "SELECT * FROM inmueble WHERE id_inmueble = ?"; // Selecciona solo el campo "nombre" de la tabla
    db.query(sql, [id_inmueble], (err, result) => {
        if (err) {
            console.error('Error al obtener datos de inmueble:', err);
            return res.json({ message: "Error al obtener datos de inmueble" });
        }
        return res.json(result);
    });
});

// Ruta para manejar la solicitud de recuperación de contraseña
app.post('/recuperar-contrasena', (req, res) => {
    const { correo } = req.body;
    const sql = "SELECT * FROM usuario WHERE correo = ?";
    
    db.query(sql, [correo], (err, data) => {
      if (err) {
        console.error('Error al buscar el correo en la base de datos:', err);
        return res.json("Error interno del servidor");
      } 
  
      if (data.length > 0) {
        // El correo existe, ahora se enviará un correo con un link para cambiar la contraseña
        const usuario = data[0];
        const link = `http://localhost:3000/nuevacontra/${usuario.id_usuario}`;

        enviarCorreoRecuperacion(usuario.correo, link)
          .then(() => {
            return res.json({ message: 'Se ha enviado un correo para restablecer la contraseña' });
          })
          .catch((error) => {
            console.error('Error al enviar el correo de recuperación:', error);
            return res.json("Error al enviar el correo de recuperación");
          });
      } else {
        // El correo no existe en la base de datos
        return res.json("El correo proporcionado no está registrado");
      }
    });
  });


  //Seccion para enviar correo de recuperacion
  const enviarCorreoRecuperacion = async (correo, link) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'inmueblesestudiante@gmail.com', // Cambiar al correo real
        pass: 'zjqqojsupetjfwrg', // Cambiar a la contraseña real
      },
    });
  
    const mailOptions = {
      from: 'inmueblesestudiante@gmail.com', // Cambiar al correo real
      to: correo,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${link}">${link}</a></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de recuperación enviado a:', correo);
    } catch (error) {
      throw error;
    }
  };

  //Actualizar contraseña encriptada
// Ruta para actualizar la contraseña encriptada
app.put('/actualizar-contrasena/:id_usuario', async (req, res) => {
    const id_usuario = req.params.id_usuario;
    const nuevaContrasena = req.body.contrasena;
  
    try {
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10); // Hash de la nueva contraseña
  
      const updatePasswordSql = 'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?';
      db.query(updatePasswordSql, [hashedPassword, id_usuario], (err, result) => {
        if (err) {
          console.error('Error al actualizar la contraseña:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
        } else {
          res.json({ message: 'Contraseña actualizada exitosamente' });
        }
      });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  


  app.post("/registrochat", async (req, res) => {

    // Desestructura directamente de req.body
    const { mail, name } = req.body;

    console.log("Nombre: ", name);
    console.log("Correo: ", mail);

    try {
        const r = await axios.put(
            'https://api.chatengine.io/users',
            { username: mail, secret: mail, first_name: name },
            { headers: { "private-key": "70e0851a-a83d-4bd5-9ed6-6c7dfdc6ee37" } }
        );
    } catch (e) {
        return res.status(500).json({ error: 'Error desconocido' });
    }
  });

  app.post("/newchat/:idInmueble", async (req, res) => {
    const id_inmueble = req.params.idInmueble;

    // Consulta SQL para obtener id_usuario
    const sql1 = "SELECT id_usuario FROM inmueble WHERE id_inmueble = ?";
    db.query(sql1, [id_inmueble], (err, result1) => {
        if (err) {
            console.error('Error al obtener datos de inmueble:', err);
            return res.status(500).json({ error: 'Error al obtener datos de inmueble' });
        }

        if (result1.length === 0) {
            console.error('Inmueble no encontrado');
            return res.status(404).json({ error: 'Inmueble no encontrado' });
        }

        const id_usuario = result1[0].id_usuario;
        console.log("ID recibido: ", id_usuario);

        // Consulta SQL para obtener correo del usuario
        const sql2 = "SELECT correo FROM usuario WHERE id_usuario = ?";
        db.query(sql2, [id_usuario], async (err, result2) => {
            if (err) {
                console.error('Error al obtener datos de usuario:', err);
                return res.status(500).json({ error: 'Error al obtener datos de usuario' });
            }

            if (result2.length === 0) {
                console.error('Usuario no encontrado');
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const destinatario = result2[0].correo;
            console.log("Correo Recibido: ", destinatario);

            const mail = req.session.user.correo;
            console.log("Correo del remitente: ", mail);

            try {
                // Realizar la solicitud a la API de chat
                const response = await axios.put(
                    'https://api.chatengine.io/chats/',
                    {
                        usernames: [destinatario],
                        title: "Chat",
                        is_direct_chat: false
                    },
                    {
                        headers: {
                            "Project-ID": "1c5e1f42-db0c-47be-88e3-58413263e9e9",
                            "User-Name": mail,
                            "User-Secret": mail
                        }
                    }
                );

                // Puedes hacer algo con la respuesta si es necesario
                console.log(response.data);

                return res.status(200).json({ success: true });
            } catch (error) {
                console.error("Error en la solicitud a la API de chat:", error);
                return res.status(500).json({ error: 'Error en la solicitud a la API de chat' });
            }
        });
    });
  });

  // Función para realizar consultas de actualización
async function updateInmueble(id_inmueble, condiciones, servicios, seguridad) {
  const updateInmuebleQuery = "UPDATE inmueble SET condiciones = condiciones + ?, servicios = servicios + ?, seguridad = seguridad + ?, contador_evaluaciones = contador_evaluaciones + 1 WHERE id_inmueble = ?";
  const inmuebleValues = [condiciones, servicios, seguridad, id_inmueble];
  console.log("Updating inmueble with values:", inmuebleValues);
  await db.query(updateInmuebleQuery, inmuebleValues);
}

// Función para actualizar la tabla de usuarios
async function updateUsuario(id_usuario, comportamiento) {
  const updateUsuarioQuery = "UPDATE usuario SET comportamiento = comportamiento + ?, contador_evaluaciones = contador_evaluaciones + 1 WHERE id_usuario = ?";
  const usuarioValues = [comportamiento, id_usuario];
  console.log("Updating usuario with values:", usuarioValues);
  await db.query(updateUsuarioQuery, usuarioValues);
}
 
app.post('/evaluarinmueble', async (req, res) => {
  try {
    const id_inmueble = req.body.id;
    const condiciones = req.body.fachada;
    const servicios = req.body.servicios;
    const seguridad = req.body.seguridad;
    const comportamiento = req.body.trato;
    const id_usuario = req.body.idUsuario;

    console.log("Received POST request with data:");
    console.log("id_inmueble:", id_inmueble);
    console.log("condiciones:", condiciones);
    console.log("servicios:", servicios);
    console.log("seguridad:", seguridad);
    console.log("comportamiento:", comportamiento);

    // Realizar la actualización del inmueble
    await updateInmueble(id_inmueble, condiciones, servicios, seguridad);

    console.log("ID received:", id_usuario);

    // Actualizar la tabla de usuarios
    await updateUsuario(id_usuario, comportamiento);

    return res.json({ success: true });
  } catch (error) {
    console.error('Error en el endpoint evaluarinmueble:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/infoinmueblesmap', (req, res) => {
  // Consulta SQL para obtener la información de todos los inmuebles
  const sql = 'SELECT * FROM inmueble';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener los inmuebles:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(result);
    }
  });
});


app.post('/rentar/:id', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const id_inmueble = req.params.id;
    
    // Simula la lógica de obtención de información del inmueble
    const sql = `SELECT * FROM inmueble WHERE id_inmueble = ?`;

    db.query(sql, [id_inmueble], (err, result) => {
      if (err) {
        console.error('Error al obtener el inmueble:', err);
        return res.status(500).json({ error: 'Error interno del servidor al obtener el inmueble' });
      }

      if (result.length > 0) {
        // Información del inmueble encontrada, continúa con la lógica
        const infoInmuebleResponse = result[0];

        if (!infoInmuebleResponse.periodo_de_renta) {
          console.error('Error: no se encontró la propiedad data en el resultado de la consulta');
          return res.status(500).json({ error: 'Error interno del servidor: no se encontró la propiedad data en el resultado de la consulta' });
        }
        
        const fecha_inicio = new Date().toISOString().slice(0, 10);
        const fecha_fin = calcularFechaFin(fecha_inicio, infoInmuebleResponse.periodo_de_renta);

        console.log("Fecha de inicio:", fecha_inicio);
        console.log("Fecha de fin:", fecha_fin);

        const insertSql = "INSERT INTO rentados (fecha_inicio, fecha_fin, estado, id_usuario, id_inmueble) VALUES (?, ?, ?, ?, ?)";
        const insertValues = [
          fecha_inicio,
          fecha_fin,
          0,
          req.session.user.id,
          id_inmueble
        ];

        // Continúa con la consulta a la base de datos para insertar en rentados
        db.query(insertSql, insertValues, (insertErr, insertData) => {
          if (insertErr) {
            console.error('Error al insertar en la base de datos:', insertErr);
            return res.status(500).json({ error: 'Error interno del servidor al insertar en la base de datos' });
          }
          return res.json(insertData);
        });
      } else {
        // Inmueble no encontrado
        return res.status(404).json({ error: 'Inmueble no encontrado' });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

function calcularFechaFin(fecha_inicio, periodo_de_renta) {
  const startDate = new Date(fecha_inicio);
  if (periodo_de_renta === 'Mensual') {
    startDate.setDate(startDate.getDate() + 30);
  } else if (periodo_de_renta === 'Cuatrimestral') {
    startDate.setMonth(startDate.getMonth() + 4);
  } else if (periodo_de_renta === 'Semestral') {
    startDate.setMonth(startDate.getMonth() + 6);
  } else if (periodo_de_renta === 'Anual') {
    startDate.setFullYear(startDate.getFullYear() + 1);
  }
  return startDate.toISOString().slice(0, 10);
}

