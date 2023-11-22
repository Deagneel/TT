import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

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

    const sql = "INSERT INTO inmueble (titulo, direccion, coordenadas, precio, periodo_de_renta, no_habitaciones, reglamento, foto, id_usuario, id_escuela) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
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
        req.body.idEscuela
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