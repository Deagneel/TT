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
    methods: ["POST", "GET", "PUT"],
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
        return res.json({valid: true, nombre: req.session.user.nombre})
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
    
    bcrypt.hash(req.body.contrasena, salt, (err, hash) => {
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

        db.query(sql, values, (err, data) => {
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
                        nombre: data[0].nombre
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

    const sql = "INSERT INTO inmueble (titulo, direccion, coordenadas, precio, periodo_de_renta, no_habitaciones, reglamento, foto, id_usuario, id_escuela, tipo_de_habitacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
    const values = [
        req.body.title,
        req.body.address,
        req.body.coordinates,
        req.body.price,
        req.body.period,
        req.body.numRooms,
        req.body.regulations,
        req.body.images,
        req.session.user.id,
        req.body.idEscuela,
        req.body.Tvivienda
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
        coordenadas: req.body.coordinates,
        precio: req.body.price,
        periodo_de_renta: req.body.period,
        no_habitaciones: req.body.numRooms,
        reglamento: req.body.regulations,
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

  // Ruta para obtener datos de la tabla reporte
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
  