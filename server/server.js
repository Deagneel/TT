import express, { response } from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import axios from "axios";
import XLSX from "xlsx";

const salt = 10;
const app = express();

app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret", //llave secreta para cifrar la cookie de la sesión
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 100 * 60 * 60 * 24,
    }, //propiedades de la cookie
  })
);

//DB Online
/*
const db = mysql.createConnection({
  host: "bccdb0knkukccxehxrur-mysql.services.clever-cloud.com",
  user: "u0umkw3bjydys9qe",
  password: "jS9hYCGfJdgbZ4wHnbyg",
  database: 'bccdb0knkukccxehxrur'
});
*/

//DB Local Gsus

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistemarentas"
});


//DB Local atr
/*
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "tt-db",
});
*/
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    throw err;
  }
  console.log("Conexión a la base de datos establecida");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json({ url: req.file.filename });
});

app.get("/geocode", async (req, res) => {
  try {
    const address = req.query.address;
    const apiKey = "AIzaSyArrTAZutsOGQ0qEXumdsKfqz6sryLq3bw"; // Reemplaza con tu clave API de Google Maps
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error en el proxy de geocodificación:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/", (req, res) => {
  if (req.session.user && req.session.user.nombre) {
    return res.json({ valid: true, nombre: req.session.user.correo });
  } else {
    return res.json({ valid: false });
  }
});

app.get("/perfil", (req, res) => {
  const id_usuario = req.session.user ? req.session.user.id : null;

  if (id_usuario) {
    db.query(
      "SELECT id_usuario, nombre, primer_apellido, segundo_apellido, correo FROM usuario WHERE id_usuario = ?",
      [id_usuario],
      (err, result) => {
        if (err) {
          console.error("Error al obtener datos de la tabla usuario:", err);
          res.status(500).json({ error: "Error interno del servidor" });
        } else {
          // Verifica si hay al menos un resultado
          const perfil = result.length > 0 ? result[0] : null;
          res.json(perfil);
        }
      }
    );
  } else {
    res
      .status(401)
      .json({ error: "No se proporcionó un usuario válido en la sesión." });
  }
});

app.get("/verificarSolicitud", (req, res) => {
  const idUsuario = req.session.user ? req.session.user.id : null;
  const idInmueble = req.query.idInmueble;

  if (idUsuario && idInmueble) {
    db.query(
      "SELECT * FROM rentados WHERE id_usuario = ? AND id_inmueble = ?",
      [idUsuario, idInmueble],
      (err, result) => {
        if (err) {
          console.error("Error al verificar en la tabla rentados:", err);
          res.status(500).json({ error: "Error interno del servidor" });
        } else {
          // Verifica si el usuario ya ha hecho una solicitud para el inmueble
          if (result.length > 0) {
            res.json({ solicitudExistente: true });
          } else {
            res.json({ solicitudExistente: false });
          }
        }
      }
    );
  } else {
    res
      .status(400)
      .json({
        error:
          "Faltan datos necesarios para la consulta (idUsuario o idInmueble).",
      });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // manejar el error
    } else {
      res.clearCookie("nombreDeTuCookie");
      return res.json({ Status: "Success" });
    }
  });
});

// Ruta para manejar la solicitud POST de registro de usuarios
app.post("/signup", (req, res) => {
  const sql =
    "INSERT INTO usuario (nombre, primer_apellido, segundo_apellido, correo, contrasena, tipo_de_usuario) VALUES (?, ?, ?, ?, ?, ?)";

  bcrypt.hash(req.body.contrasena, salt, async (err, hash) => {
    if (err) {
      console.log(err);
      return res.json("Error hashing password");
    }

    const values = [
      req.body.nombre,
      req.body.primer_apellido,
      req.body.segundo_apellido,
      req.body.correo,
      hash,
      req.body.tipo_de_usuario,
    ];

    // Imprimir la contraseña en la consola (Solo para propósitos de depuración)
    console.log("Contraseña:", req.body.contrasena);

    db.query(sql, values, async (err, data) => {
      if (err) {
        console.log(err);
        return res.json("Error inserting into database");
      }

      // Imprimir en la consola información relevante incluyendo la contraseña
      console.log("Nuevo usuario registrado:", {
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        tipo_de_usuario: req.body.tipo_de_usuario,
        id: data.insertId,
      });

      return res.json(data);
    });
  });
});

// Ruta para manejar la solicitud POST de inicio de sesión
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM usuario WHERE correo = ?";
  console.log("Correo proporcionado:", req.body.correo);

  db.query(sql, [req.body.correo], (err, data) => {
    if (err) {
      console.error("Error en la consulta a la base de datos:", err);
      return res.json("Error");
    }

    if (data.length > 0) {
      console.log("Datos de la base de datos:", data);

      // Imprimir las contraseñas antes de la comparación
      console.log(
        "Contraseña proporcionada en la solicitud:",
        req.body.contrasena
      );
      console.log(
        "Contraseña almacenada en la base de datos:",
        data[0].contrasena
      );

      bcrypt.compare(
        req.body.contrasena.toString(),
        data[0].contrasena,
        (err, response) => {
          if (err) {
            console.error("Error al comparar contraseñas:", err);
            return res.json("Error: Contraseña incorrecta");
          }

          console.log("Resultado de la comparación de contraseñas:", response);

          if (response) {
            req.session.user = {
              id: data[0].id_usuario,
              nombre: data[0].nombre,
              correo: data[0].correo,
            };
            console.log(req.session.user);
            return res.json({
              Login: true,
              tipo_de_usuario: data[0].tipo_de_usuario,
            });
          }
          return res.json({ Login: false });
        }
      );
    } else {
      console.log("No se encontró ningún usuario con ese correo.");
      return res.json("Fail: No coincide correo");
    }
  });
});

// Ruta para manejar la solicitud POST de registro de usuarios
app.post("/registroinmueble", (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql =
    "INSERT INTO inmueble (titulo, direccion, asentamiento, cp, alcaldia, latitud, longitud, precio, periodo_de_renta, no_habitaciones, reglamento, caracteristicas, foto, id_usuario, id_escuela, tipo_de_habitacion, activo) VALUES (?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
  const values = [
    req.body.title,
    req.body.address,
    req.body.asentamiento,
    req.body.cp,
    req.body.alcaldia,
    req.body.latitud,
    req.body.longitud,
    req.body.price,
    req.body.period,
    req.body.numRooms,
    req.body.regulations,
    req.body.caracteristicas,
    req.body.images,
    req.session.user.id,
    req.body.idEscuela,
    req.body.Tvivienda,
    req.body.activo,
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
app.get("/", (req, res) => {
  const sql = "SELECT * FROM escuela";
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "Error inside server" });
    return res.json(result);
  });
});

// Ruta para verificar si el usuario tiene tratos pendientes
app.get("/tratopendiente", (req, res) => {
  const id_usuario = req.session.user.id;

  const query = `
    SELECT rentados.* FROM rentados
    JOIN inmueble ON rentados.id_inmueble = inmueble.id_inmueble
    WHERE inmueble.id_usuario = ? AND rentados.estado = 0
  `;

  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al obtener tratos pendientes: ", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      if (result.length > 0) {
        res.status(200).send("OK");
      } else {
        res
          .status(404)
          .json({ mensaje: "No se encontraron tratos pendientes" });
      }
    }
  });
});

// Ruta para obtener datos de la tabla "escuela"
app.get("/obtenerEscuelas", (req, res) => {
  const sql = "SELECT * FROM escuela"; // Selecciona solo el campo "nombre" de la tabla
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener datos de escuela:", err);
      return res.json({ message: "Error al obtener datos de escuela" });
    }
    return res.json(result);
  });
});

// Ruta para obtener datos de una escuela específica según su ID
app.get("/escuela/:id_escuela", (req, res) => {
  const id_escuela = req.params.id_escuela;
  const sql = "SELECT * FROM escuela WHERE id_escuela = ?"; // Filtra por el ID de la escuela
  db.query(sql, [id_escuela], (err, result) => {
    if (err) {
      console.error("Error al obtener datos de escuela:", err);
      return res.json({ message: "Error al obtener datos de escuela" });
    }
    return res.json(result);
  });
});

// Ruta para obtener datos de la tabla "inmueble"
app.get("/inmuebles", (req, res) => {
  // Obtiene el valor del parámetro id_usuario de la solicitud
  const id_usuario = req.session.user.id;

  // Realiza la consulta a tu base de datos para obtener los datos de la tabla inmueble
  db.query(
    "SELECT * FROM inmueble WHERE id_usuario = ?",
    [id_usuario],
    (err, result) => {
      if (err) {
        console.error("Error al obtener datos de la tabla inmueble:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json(result);
      }
    }
  );
});

app.get("/inmueblesRenta", (req, res) => {
  const id_usuario = req.session.user.id;

  // Consulta SQL que involucra una unión entre las tablas inmueble, rentados y usuario
  const sql = `
    SELECT i.*, u.nombre, u.primer_apellido, u.segundo_apellido FROM inmueble i
    INNER JOIN rentados r ON i.id_inmueble = r.id_inmueble
    INNER JOIN usuario u ON r.id_usuario = u.id_usuario
    WHERE i.id_usuario = ? AND r.estado = 1
  `;

  db.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al obtener datos de la tabla inmueble:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result);
    }
  });
});

// Ruta para obtener información de un inmueble por ID
app.get("/infoinmuebles/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;

  // Consulta SQL para obtener la información del inmueble
  const sql = `SELECT * FROM inmueble WHERE id_inmueble = ?`;

  db.query(sql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al obtener el inmueble:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      if (result.length > 0) {
        // Si se encuentra el inmueble, envía la información al cliente
        res.json(result[0]);
      } else {
        // Si no se encuentra el inmueble, devuelve un mensaje de error
        res.status(404).send("Inmueble no encontrado");
      }
    }
  });
});

app.put("/newName/:id", (req, res) => {
  const userId = req.params.id;
  const nuevoNombre = req.body.nombre; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nuevoNombre) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql = "UPDATE usuario SET nombre = ? WHERE id_usuario = ?";
  db.query(sql, [nuevoNombre, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el nombre: " + err.message);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({ mensaje: "Nombre de usuario actualizado exitosamente." });
  });
});

app.put("/newApe/:id", (req, res) => {
  const userId = req.params.id;
  const nuevoNombre = req.body.primer_apellido; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nuevoNombre) {
    return res.status(400).json({ error: 'El campo "apellido" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql = "UPDATE usuario SET primer_apellido = ? WHERE id_usuario = ?";
  db.query(sql, [nuevoNombre, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el primer apellido: " + err.message);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({ mensaje: "Nombre de usuario actualizado exitosamente." });
  });
});

app.put("/newApe2/:id", (req, res) => {
  const userId = req.params.id;
  const nuevoNombre = req.body.segundo_apellido; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nuevoNombre) {
    return res.status(400).json({ error: 'El campo "apellido" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql = "UPDATE usuario SET segundo_apellido = ? WHERE id_usuario = ?";
  db.query(sql, [nuevoNombre, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el primer apellido: " + err.message);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({ mensaje: "Nombre de usuario actualizado exitosamente." });
  });
});

app.put("/newMail/:id", (req, res) => {
  const userId = req.params.id;
  const nuevoCorreo = req.body.correo; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nuevoCorreo) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql = "UPDATE usuario SET correo = ? WHERE id_usuario = ?";
  db.query(sql, [nuevoCorreo, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el nombre: " + err.message);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({ mensaje: "Correo de usuario actualizado exitosamente." });
  });
});

app.put("/newIne/:id", (req, res) => {
  const userId = req.params.id;
  const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nueva) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql =
    "UPDATE usuario SET identificacion_oficial = ? WHERE id_usuario = ?";
  db.query(sql, [nueva, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar INE: " + err.message);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({ mensaje: "Correo de usuario actualizado exitosamente." });
  });
});

app.put("/newCredencial/:id", (req, res) => {
  const userId = req.params.id;
  const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nueva) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql =
    "UPDATE usuario SET credencial_de_estudiante = ? WHERE id_usuario = ?";
  db.query(sql, [nueva, userId], (err, result) => {
    if (err) {
      console.error(
        "Error al actualizar Credencial de Estudiante: " + err.message
      );
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({
      mensaje: "Credenecial de Estudiante actualizada exitosamente.",
    });
  });
});

app.put("/newComprobante/:id", (req, res) => {
  const userId = req.params.id;
  const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nueva) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql =
    "UPDATE usuario SET comprobante_de_inscripcion = ? WHERE id_usuario = ?";
  db.query(sql, [nueva, userId], (err, result) => {
    if (err) {
      console.error(
        "Error al actualizar Credencial de Estudiante: " + err.message
      );
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({
      mensaje: "Comprobante de innscipción actualizado exitosamente.",
    });
  });
});

app.put("/newComprobanteD/:id", (req, res) => {
  const userId = req.params.id;
  const nueva = req.body.correo; // Obtén el nombre del cuerpo de la solicitud

  // Verificar si el nombre está presente en la solicitud
  if (!nueva) {
    return res.status(400).json({ error: 'El campo "nombre" es requerido.' });
  }

  // Realizar la consulta SQL para actualizar el nombre del usuario
  const sql =
    "UPDATE usuario SET comprobante_de_domicilio = ? WHERE id_usuario = ?";
  db.query(sql, [nueva, userId], (err, result) => {
    if (err) {
      console.error(
        "Error al actualizar comprobante de domicilio: " + err.message
      );
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Enviar una respuesta de éxito
    res.json({ mensaje: "Comprobante de domiclio actualizado exitosamente." });
  });
});

// Actualizar información de un inmueble por ID
app.put("/infoinmuebles/:id_inmueble", upload.none(), (req, res) => {
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
      console.error("Error al actualizar el inmueble:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      if (result.affectedRows > 0) {
        // Si se actualiza el inmueble correctamente, devuelve un mensaje de éxito
        res.status(200).send("Inmueble actualizado correctamente");
      } else {
        // Si no se encuentra el inmueble, devuelve un mensaje de error
        res.status(404).send("Inmueble no encontrado");
      }
    }
  });
});

app.put("/editarinmueble/:id_inmueble", upload.none(), (req, res) => {
  // Obtén el ID del inmueble de los parámetros de la URL
  const id_inmueble = req.params.id_inmueble;

  // Verifica si el usuario está autenticado
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // Datos actualizados del inmueble
  const updatedData = {
    titulo: req.body.title,
    direccion: req.body.address,
    asentamiento: req.body.asentamiento,
    cp: req.body.cp,
    alcaldia: req.body.alcaldia,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    precio: req.body.price,
    periodo_de_renta: req.body.period,
    no_habitaciones: req.body.numRooms,
    reglamento: req.body.regulations,
    caracteristicas: req.body.caracteristicas,
    tipo_de_habitacion: req.body.Tvivienda,
    activo_usuario: req.body.activo,
    foto: req.body.foto,
  };

  // Consulta SQL para actualizar la información del inmueble
  const updateSql = `UPDATE inmueble SET ? WHERE id_inmueble = ?;`;

  // Ejecuta la consulta SQL
  db.query(updateSql, [updatedData, id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al actualizar el inmueble:", err);
      return res.status(500).json("Error interno del servidor");
    } else {
      if (result.affectedRows > 0) {
        // Si se actualiza el inmueble correctamente, devuelve un mensaje de éxito
        return res.status(200).json("Inmueble actualizado correctamente");
      } else {
        // Si no se encuentra el inmueble, devuelve un mensaje de error
        return res.status(404).json("Inmueble no encontrado");
      }
    }
  });
});

app.delete("/eliminarinmueble/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;

  const deleteSql = `DELETE FROM inmueble WHERE id_inmueble = ?`;

  db.query(deleteSql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al eliminar el inmueble:", err);
      return res.status(500).json("Error interno del servidor");
    } else {
      if (result.affectedRows > 0) {
        // Si se elimina el inmueble correctamente, devuelve un mensaje de éxito
        return res.status(200).json("Inmueble eliminado correctamente");
      } else {
        // Si no se encuentra el inmueble, devuelve un mensaje de error
        return res.status(404).json("Inmueble no encontrado");
      }
    }
  });
});

// Ruta para eliminar usuario
app.delete("/eliminarUsuario/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;

  const sql = "DELETE FROM usuario WHERE id_usuario = ?";

  db.query(sql, [idUsuario], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json({
        message: "Usuario y registros relacionados eliminados correctamente",
      });
    }
  });
});

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//Consulta en union de la tabla escuela e inmueble para HomeArrendatario
app.get("/inmueblearrendatario", (req, res) => {
  const sql = `
    SELECT i.*, e.nombre AS nombre_escuela, i.activo, i.activo_usuario
    FROM inmueble AS i 
    LEFT JOIN escuela AS e ON i.id_escuela = e.id_escuela
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener datos de la tabla inmueble:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result);
    }
  });
});

app.get("/obtenerReporteesp/:id_reporte", (req, res) => {
  const { id_reporte } = req.params;

  const sql = "SELECT * FROM reporte WHERE id_reporte = ?";

  db.query(sql, [id_reporte], (err, result) => {
    if (err) {
      console.error("Error al obtener el reporte:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Reporte no encontrado" });
      } else {
        res.json(result[0]);
      }
    }
  });
});

app.put("/actualizarEstadoReporte/:id_reporte", (req, res) => {
  const { id_reporte } = req.params;
  const { estado } = req.body;

  const sql = "UPDATE reporte SET estado = ? WHERE id_reporte = ?";

  db.query(sql, [estado, id_reporte], (err, result) => {
    if (err) {
      console.error("Error al actualizar el estado del reporte:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json({ mensaje: "Estado del reporte actualizado correctamente" });
    }
  });
});

app.put("/incrementarReportesUsuario/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;

  const sql =
    "UPDATE usuario SET no_reportes = no_reportes + 1 WHERE id_usuario = ?";

  db.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.error(
        "Error al incrementar el número de reportes del usuario:",
        err
      );
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json({
        mensaje: "Número de reportes del usuario incrementado correctamente",
      });
    }
  });
});

app.put("/pausarInmueble/:id_inmueble", (req, res) => {
  const { id_inmueble } = req.params;
  const { activo } = req.body;

  const sql = "UPDATE inmueble SET activo = ? WHERE id_inmueble = ?";

  db.query(sql, [activo, id_inmueble], (err, result) => {
    if (err) {
      console.error(
        "Error al cambiar el estado de la publicación del inmueble:",
        err
      );
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      let message =
        activo === "1"
          ? "Publicación del inmueble activada correctamente"
          : "Publicación del inmueble pausada correctamente";
      res.json({ message });
    }
  });
});

// Ruta para llenar los datos de la tabla reporte
app.post("/generarReporte", (req, res) => {
  const sqlInsert =
    "INSERT INTO reporte (asunto, descripción, fecha, id_usuario, id_inmueble) VALUES (?, ?, ?, ?, ?)";
  const valuesInsert = [
    req.body.aff,
    req.body.description,
    req.body.date,
    req.body.id_usuario,
    req.body.id_inmueble,
  ];

  const sqlSelect = "SELECT no_reportes FROM usuario WHERE id_usuario = ?";
  const sqlUpdate = "UPDATE usuario SET no_reportes = ? WHERE id_usuario = ?";

  db.query(sqlInsert, valuesInsert, (err, result) => {
    if (err) {
      console.error("Error al insertar en la base de datos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    // Obtener el número actual de reportes del usuario
    db.query(sqlSelect, [req.body.id_usuario], (err, rows) => {
      if (err) {
        console.error(
          "Error al obtener el número de reportes del usuario:",
          err
        );
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      // Incrementar el contador de reportes
      const currentNoReportes = rows[0].no_reportes;
      const newNoReportes = currentNoReportes;

      // Actualizar el número de reportes para el usuario correspondiente
      db.query(
        sqlUpdate,
        [newNoReportes, req.body.id_usuario],
        (err, result) => {
          if (err) {
            console.error(
              "Error al actualizar el número de reportes del usuario:",
              err
            );
            return res
              .status(500)
              .json({ error: "Error interno del servidor" });
          }

          return res.json({ message: "Datos insertados correctamente" });
        }
      );
    });
  });
});

// Realizar la consulta SQL para obtener los datos de la tabla "reporte"
app.get("/obtenerReportes", (req, res) => {
  const sql = "SELECT * FROM reporte";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener datos de reporte:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result);
    }
  });
});

app.get("/obtenerReportesPorUsuario/:parametroBusqueda", (req, res) => {
  const { parametroBusqueda } = req.params;
  const sql = `
    SELECT r.*, u.nombre AS nombre_usuario, u.primer_apellido AS p_apellido, u.segundo_apellido AS s_apellido, u.no_reportes AS asociados
    FROM reporte r 
    INNER JOIN usuario u ON r.id_usuario = u.id_usuario 
    WHERE r.id_usuario = ?
  `;

  const searchParam = `%${parametroBusqueda}%`; // Para buscar coincidencias parciales del nombre

  db.query(sql, [parametroBusqueda, searchParam], (err, result) => {
    if (err) {
      console.error("Error al obtener datos de reporte por usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result);
    }
  });
});

app.get("/obtenerReportesPorInmueble/:parametroBusqueda", (req, res) => {
  const { parametroBusqueda } = req.params;
  const sql = `
    SELECT r.*, u.titulo AS nombre_inmueble, u.activo AS inmueble_activo
    FROM reporte r 
    INNER JOIN inmueble u ON r.id_inmueble = u.id_inmueble
    WHERE r.id_inmueble = ?
  `;

  const searchParam = `%${parametroBusqueda}%`; // Para buscar coincidencias parciales del nombre

  db.query(sql, [parametroBusqueda, searchParam], (err, result) => {
    if (err) {
      console.error("Error al obtener datos de reporte por usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result);
    }
  });
});

app.get("/obtenerNoReportesUsuario/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;
  const sql = "SELECT no_reportes FROM usuario WHERE id_usuario = ?";

  db.query(sql, [idUsuario], (err, result) => {
    if (err) {
      console.error("Error al obtener el número de reportes del usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result[0]?.no_reportes || 0);
    }
  });
});

app.get("/obtenerNombreUsuario/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;
  const sql =
    "SELECT nombre, primer_apellido, segundo_apellido FROM usuario WHERE id_usuario = ?";

  db.query(sql, [idUsuario], (err, result) => {
    if (err) {
      console.error("Error al obtener el nombre del usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      // Devolver el objeto completo con los datos del usuario
      res.json(result[0] || { mensaje: "Usuario no encontrado" });
    }
  });
});

app.get("/obtenerTituloInmueble/:idInmueble", (req, res) => {
  const { idInmueble } = req.params;
  const sql = "SELECT titulo, activo FROM inmueble WHERE id_inmueble = ?";

  db.query(sql, [idInmueble], (err, result) => {
    if (err) {
      console.error("Error al obtener el título y estado del inmueble:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result[0] || { titulo: "Inmueble no encontrado", activo: 0 });
    }
  });
});

app.get("/obtenerCorreoUsuario/:id_usuario", (req, res) => {
  const id_usuario = req.params.id_usuario;
  const sql = "SELECT correo FROM usuario WHERE id_usuario = ?";
  db.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al obtener datos del usuario:", err);
      return res.json({ message: "Error al obtener datos del usuario" });
    }
    return res.json(result);
  });
});

// Ruta para obtener datos de la tabla "inmueble"
app.get("/obtenerInmuebleInfo/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;
  const sql = "SELECT * FROM inmueble WHERE id_inmueble = ?"; // Selecciona solo el campo "nombre" de la tabla
  db.query(sql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al obtener datos de inmueble:", err);
      return res.json({ message: "Error al obtener datos de inmueble" });
    }
    return res.json(result);
  });
});

// Ruta para manejar la solicitud de recuperación de contraseña
app.post("/recuperar-contrasena", (req, res) => {
  const { correo } = req.body;
  const sql = "SELECT * FROM usuario WHERE correo = ?";

  db.query(sql, [correo], (err, data) => {
    if (err) {
      console.error("Error al buscar el correo en la base de datos:", err);
      return res.json("Error interno del servidor");
    }

    if (data.length > 0) {
      // El correo existe, ahora se enviará un correo con un link para cambiar la contraseña
      const usuario = data[0];
      const link = `http://localhost:3000/nuevacontra/${usuario.id_usuario}`;

      enviarCorreoRecuperacion(usuario.correo, link)
        .then(() => {
          return res.json({
            message: "Se ha enviado un correo para restablecer la contraseña",
          });
        })
        .catch((error) => {
          console.error("Error al enviar el correo de recuperación:", error);
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
    service: "gmail",
    auth: {
      user: "inmueblesestudiante@gmail.com", // Cambiar al correo real
      pass: "zjqqojsupetjfwrg", // Cambiar a la contraseña real
    },
  });

  const mailOptions = {
    from: "inmueblesestudiante@gmail.com", // Cambiar al correo real
    to: correo,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${link}">${link}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de recuperación enviado a:", correo);
  } catch (error) {
    throw error;
  }
};

//Correo para los tratos
// Función para enviar correo con información al arrendador
const enviarCorreoArrendador = async (correoArrendador, tituloinmu) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inmueblesestudiante@gmail.com", // Cambiar al correo real
      pass: "zjqqojsupetjfwrg", // Cambiar a la contraseña real
    },
  });

  const mailOptions = {
    from: "inmueblesestudiante@gmail.com", // Cambiar al correo real
    to: correoArrendador, // Cambiar al correo del arrendador
    subject: "Solicitud de trato en inmueble",
    html: `<p>Ha recibido una solicitud para concretar un trato en el inmueble "${tituloinmu}".</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado al arrendador:", correoArrendador);
  } catch (error) {
    throw error;
  }
};

app.post("/enviarCorreoArrendador", (req, res) => {
  try {
    const { idUsuario, idInmueble, correoUsuario, tituloinmu } = req.body;
    const idSesion = req.session.user.id; // Aquí obtén el ID de sesión desde la sesión del usuario

    // Llamar a la función para enviar el correo al arrendador con el correo y el enlace generado
    enviarCorreoArrendador(correoUsuario, tituloinmu)
      .then(() => {
        res.json({ message: "Correo enviado al arrendador" });
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ error: "Error al enviar el correo" });
      });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Actualizar contraseña encriptada
// Ruta para actualizar la contraseña encriptada
app.put("/actualizar-contrasena/:id_usuario", async (req, res) => {
  const id_usuario = req.params.id_usuario;
  const nuevaContrasena = req.body.contrasena;

  try {
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10); // Hash de la nueva contraseña

    const updatePasswordSql =
      "UPDATE usuario SET contrasena = ? WHERE id_usuario = ?";
    db.query(updatePasswordSql, [hashedPassword, id_usuario], (err, result) => {
      if (err) {
        console.error("Error al actualizar la contraseña:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json({ message: "Contraseña actualizada exitosamente" });
      }
    });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/registrochat", async (req, res) => {
  // Desestructura directamente de req.body
  const { mail, name, last_name } = req.body;

  console.log("Nombre: ", name);
  console.log("Correo: ", mail);

  try {
    const r = await axios.put(
      "https://api.chatengine.io/users",
      { username: mail, secret: mail, first_name: name, last_name: last_name },
      { headers: { "private-key": "3b3f36ec-29d6-4a5e-9708-2fe359e5bc01" } }
    );
  } catch (e) {
    return res.status(500).json({ error: "Error desconocido" });
  }
});

app.post("/newchat/:idInmueble", async (req, res) => {
  const id_inmueble = req.params.idInmueble;

  // Consulta SQL para obtener id_usuario
  const sql1 = "SELECT id_usuario FROM inmueble WHERE id_inmueble = ?";
  db.query(sql1, [id_inmueble], (err, result1) => {
    if (err) {
      console.error("Error al obtener datos de inmueble:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener datos de inmueble" });
    }

    if (result1.length === 0) {
      console.error("Inmueble no encontrado");
      return res.status(404).json({ error: "Inmueble no encontrado" });
    }

    const id_usuario = result1[0].id_usuario;
    console.log("ID recibido: ", id_usuario);

    // Consulta SQL para obtener correo del usuario
    const sql2 = "SELECT correo FROM usuario WHERE id_usuario = ?";
    db.query(sql2, [id_usuario], async (err, result2) => {
      if (err) {
        console.error("Error al obtener datos de usuario:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener datos de usuario" });
      }

      if (result2.length === 0) {
        console.error("Usuario no encontrado");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const destinatario = result2[0].correo;
      console.log("Correo Recibido: ", destinatario);

      const mail = req.session.user.correo;
      console.log("Correo del remitente: ", mail);

      try {
        // Realizar la solicitud a la API de chat
        const response = await axios.put(
          "https://api.chatengine.io/chats/",
          {
            usernames: [destinatario],
            title: "Chat",
            is_direct_chat: true,
          },
          {
            headers: {
              "Project-ID": "6a22601b-69ce-4f51-b6ff-19957596e253",
              "User-Name": mail,
              "User-Secret": mail,
            },
          }
        );

        // Puedes hacer algo con la respuesta si es necesario
        console.log(response.data);

        return res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error en la solicitud a la API de chat:", error);
        return res
          .status(500)
          .json({ error: "Error en la solicitud a la API de chat" });
      }
    });
  });
});

// Función para realizar consultas de actualización
async function updateInmueble(id_inmueble, condiciones, servicios, seguridad) {
  const updateInmuebleQuery =
    "UPDATE inmueble SET condiciones = condiciones + ?, servicios = servicios + ?, seguridad = seguridad + ?, contador_evaluaciones = contador_evaluaciones + 1 WHERE id_inmueble = ?";
  const inmuebleValues = [condiciones, servicios, seguridad, id_inmueble];
  console.log("Updating inmueble with values:", inmuebleValues);
  await db.query(updateInmuebleQuery, inmuebleValues);
}

// Función para actualizar la tabla de usuarios
async function updateUsuario(id_usuario, comportamiento) {
  const updateUsuarioQuery =
    "UPDATE usuario SET comportamiento = comportamiento + ?, contador_evaluaciones = contador_evaluaciones + 1 WHERE id_usuario = ?";
  const usuarioValues = [comportamiento, id_usuario];
  console.log("Updating usuario with values:", usuarioValues);
  await db.query(updateUsuarioQuery, usuarioValues);
}

app.post("/evaluarinmueble", async (req, res) => {
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
    console.error("Error en el endpoint evaluarinmueble:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/infoinmueblesmap", (req, res) => {
  // Consulta SQL para obtener la información de todos los inmuebles
  const sql = "SELECT * FROM inmueble";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener los inmuebles:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(result);
    }
  });
});

app.post("/rentar/:id", async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const id_inmueble = req.params.id;

    // Simula la lógica de obtención de información del inmueble
    const sql = `SELECT * FROM inmueble WHERE id_inmueble = ?`;

    db.query(sql, [id_inmueble], (err, result) => {
      if (err) {
        console.error("Error al obtener el inmueble:", err);
        return res
          .status(500)
          .json({ error: "Error interno del servidor al obtener el inmueble" });
      }

      if (result.length > 0) {
        // Información del inmueble encontrada, continúa con la lógica
        const infoInmuebleResponse = result[0];

        if (!infoInmuebleResponse.periodo_de_renta) {
          console.error(
            "Error: no se encontró la propiedad data en el resultado de la consulta"
          );
          return res
            .status(500)
            .json({
              error:
                "Error interno del servidor: no se encontró la propiedad data en el resultado de la consulta",
            });
        }

        const fecha_inicio = new Date().toISOString().slice(0, 10);
        const fecha_fin = calcularFechaFin(
          fecha_inicio,
          infoInmuebleResponse.periodo_de_renta
        );

        console.log("Fecha de inicio:", fecha_inicio);
        console.log("Fecha de fin:", fecha_fin);

        const insertSql =
          "INSERT INTO rentados (fecha_inicio, fecha_fin, estado, id_usuario, id_inmueble) VALUES (?, ?, ?, ?, ?)";
        const insertValues = [
          fecha_inicio,
          fecha_fin,
          0,
          req.session.user.id,
          id_inmueble,
        ];

        // Continúa con la consulta a la base de datos para insertar en rentados
        db.query(insertSql, insertValues, (insertErr, insertData) => {
          if (insertErr) {
            console.error("Error al insertar en la base de datos:", insertErr);
            return res
              .status(500)
              .json({
                error:
                  "Error interno del servidor al insertar en la base de datos",
              });
          }
          return res.json(insertData);
        });
      } else {
        // Inmueble no encontrado
        return res.status(404).json({ error: "Inmueble no encontrado" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

function calcularFechaFin(fecha_inicio, periodo_de_renta) {
  const startDate = new Date(fecha_inicio);
  if (periodo_de_renta === "Mensual") {
    startDate.setDate(startDate.getDate() + 30);
  } else if (periodo_de_renta === "Cuatrimestral") {
    startDate.setMonth(startDate.getMonth() + 4);
  } else if (periodo_de_renta === "Semestral") {
    startDate.setMonth(startDate.getMonth() + 6);
  } else if (periodo_de_renta === "Anual") {
    startDate.setFullYear(startDate.getFullYear() + 1);
  }
  return startDate.toISOString().slice(0, 10);
}

// Ruta para obtener información de un usuario por ID
app.get("/obtenerUsuario/:id_usuario", (req, res) => {
  const id_usuario = req.params.id_usuario;
  const sql = "SELECT nombre FROM usuario WHERE id_usuario = ?";

  db.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      if (result.length > 0) {
        // Si se encuentra el usuario, envía la información al cliente
        res.json(result[0]);
      } else {
        // Si no se encuentra el usuario, devuelve un mensaje de error
        res.status(404).send("Usuario no encontrado");
      }
    }
  });
});

// Ruta para obtener información de un inmueble por ID
app.get("/obtenerInmueble/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;
  const sql = "SELECT * FROM inmueble WHERE id_inmueble = ?";

  db.query(sql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al obtener el inmueble:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      if (result.length > 0) {
        // Si se encuentra el inmueble, envía la información al cliente
        res.json(result[0]);
      } else {
        // Si no se encuentra el inmueble, devuelve un mensaje de error
        res.status(404).send("Inmueble no encontrado");
      }
    }
  });
});

// Ruta para actualizar el estado a 1 en la tabla "rentados"
app.put("/actualizarEstado/:id_renta", (req, res) => {
  const id_renta = req.params.id_renta;

  const updateRentadosSql = "UPDATE rentados SET estado = 1 WHERE id_renta = ?";
  db.query(updateRentadosSql, [id_renta], (err, result) => {
    if (err) {
      console.error("Error al actualizar el estado en rentados:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json({ message: "Estado actualizado a 1 en rentados" });
    }
  });
});

// Ruta para restar 1 a "no_habitaciones" en la tabla "inmueble"
app.put("/restarHabitacion/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;

  const updateInmuebleSql =
    "UPDATE inmueble SET no_habitaciones = no_habitaciones - 1 WHERE id_inmueble = ?";
  db.query(updateInmuebleSql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al restar una habitación en inmueble:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json({ message: "Se restó una habitación en inmueble" });
    }
  });
});

// Ruta para eliminar una fila de la tabla "rentados" por id_inmueble
app.delete("/eliminarRentado/:id_renta", (req, res) => {
  const id_renta = req.params.id_renta;

  const deleteRentadoSql = "DELETE FROM rentados WHERE id_renta = ?";
  db.query(deleteRentadoSql, [id_renta], (err, result) => {
    if (err) {
      console.error("Error al eliminar rentado:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json({ message: "Fila eliminada de rentados" });
    }
  });
});

// Ruta para obtener id_renta de rentados asociada a id_inmueble
app.get("/obtenerIdRenta/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;
  const sql = "SELECT id_renta FROM rentados WHERE id_inmueble = ?";

  db.query(sql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al obtener id_renta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      if (result.length > 0) {
        res.json(result[0]); // Envía el id_renta al cliente
      } else {
        res.status(404).send("Id_renta no encontrada");
      }
    }
  });
});

// Ruta para actualizar el estado del inmueble
app.put("/actualizarEstadoInmueble/:id_inmueble", (req, res) => {
  const id_inmueble = req.params.id_inmueble;

  const updateEstadoSql =
    "UPDATE inmueble SET activo_usuario = 1 WHERE id_inmueble = ? AND no_habitaciones = 0";
  db.query(updateEstadoSql, [id_inmueble], (err, result) => {
    if (err) {
      console.error("Error al actualizar estado del inmueble:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: "Estado del inmueble actualizado correctamente" });
      } else {
        // No se hace nada si la condición no se cumple
        // res.status(400).send('No se cumple la condición para actualizar el estado del inmueble');
        res.json({
          message:
            "No se cumple la condición para actualizar el estado del inmueble",
        });
      }
    }
  });
});

// En tu servidor, podrías agregar una nueva ruta para obtener el correo del usuario según su ID
app.get("/obtenerCorreoUsuario/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;
  const sql = `SELECT correo FROM usuario WHERE id_usuario = ${id_usuario}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener correo del usuario:", err);
      return res.json({ message: "Error al obtener correo del usuario" });
    }
    if (result.length > 0) {
      const correoUsuario = result[0].correo;
      return res.json({ correo: correoUsuario });
    } else {
      return res.json({ message: "Usuario no encontrado" });
    }
  });
});

//Correo para los documentos con trato completo
const enviarCorreoDatos = async (correoV, documentosAdjuntos) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inmueblesestudiante@gmail.com", // Cambiar al correo real
      pass: "zjqqojsupetjfwrg", // Cambiar a la contraseña real
    },
  });

  const mailOptions = {
    from: "inmueblesestudiante@gmail.com",
    to: correoV,
    subject: "Solicitud de trato en inmueble",
    html: `<p>A continuación te facilitamos la documentación del usuario con el que cerraste el trato.</p>`,
    attachments: documentosAdjuntos, // Aquí se adjuntan los archivos
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado al arrendador:", correoV);
  } catch (error) {
    throw error;
  }
};

app.post("/enviarCorreoDocumentacion", async (req, res) => {
  try {
    const {
      correoV,
      identificacion_oficial,
      comprobante_de_domicilio,
      credencial_de_estudiante,
      comprobante_de_inscripcion,
    } = req.body;

    // Rutas de los archivos PDF en tu servidor
    const rutaIdentificacion = `public/images/${identificacion_oficial}`;
    const rutaComprobanteDomicilio = `public/images/${comprobante_de_domicilio}`;
    const rutaCredencialEstudiante = `public/images/${credencial_de_estudiante}`;
    const rutaComprobanteInscripcion = `public/images/${comprobante_de_inscripcion}`;

    // Array de documentos adjuntos para el correo
    const documentosAdjuntos = [
      { filename: identificacion_oficial, path: rutaIdentificacion },
      { filename: comprobante_de_domicilio, path: rutaComprobanteDomicilio },
      { filename: credencial_de_estudiante, path: rutaCredencialEstudiante },
      {
        filename: comprobante_de_inscripcion,
        path: rutaComprobanteInscripcion,
      },
    ];

    // Llamar a la función para enviar el correo al arrendador con los archivos adjuntos
    await enviarCorreoDatos(correoV, documentosAdjuntos);

    res.json({ message: "Correo enviado al arrendador" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/obtenerDocumentosUsuario/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;
  const sql = `SELECT identificacion_oficial, comprobante_de_domicilio, credencial_de_estudiante, comprobante_de_inscripcion FROM usuario WHERE id_usuario = ${id_usuario}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener documentos del usuario:", err);
      return res.json({ message: "Error al obtener documentos del usuario" });
    }
    if (result.length > 0) {
      const documentosUsuario = result[0];
      return res.json(documentosUsuario);
    } else {
      return res.json({ message: "Usuario no encontrado" });
    }
  });
});

//Enviar correo para reportar
const enviarCorreoReporte = async (
  correoV,
  link,
  usuarioNombre,
  inmuebleTitulo
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inmueblesestudiante@gmail.com", // Cambiar al correo real
      pass: "zjqqojsupetjfwrg", // Cambiar a la contraseña real
    },
  });

  const mailOptions = {
    from: "inmueblesestudiante@gmail.com", // Cambiar al correo real
    to: correoV, // Cambiar al correo del arrendador
    subject: "Consulta sobre contrato",
    html: `<p>Una vez finalizado el contrato con "${usuarioNombre}" en su inmueble "${inmuebleTitulo}" nos gustaría saber si tuvo algún problema con el usuario que le gustaría reportar. <br/> Puede realizar el reporte en el siguiente enlace, de otra forma ignore el correo <a href="${link}">aquí</a>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado al arrendador:", correoV);
  } catch (error) {
    throw error;
  }
};

app.post("/enviarCorreoReporte", (req, res) => {
  try {
    const { correoV, id_usuario, usuarioNombre, inmuebleTitulo } = req.body;
    const link = `http://localhost:3000/incidencia/${id_usuario}/${21}`; // Reemplaza con tu URL real

    // Llamar a la función para enviar el correo al arrendador con el correo y el enlace generado
    enviarCorreoReporte(correoV, link, usuarioNombre, inmuebleTitulo)
      .then(() => {
        res.json({ message: "Correo enviado al arrendador" });
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ error: "Error al enviar el correo" });
      });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Enviar correo para reseña
const enviarCorreoReseña = async (correoT, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inmueblesestudiante@gmail.com", // Cambiar al correo real
      pass: "zjqqojsupetjfwrg", // Cambiar a la contraseña real
    },
  });

  const mailOptions = {
    from: "inmueblesestudiante@gmail.com", // Cambiar al correo real
    to: correoT, // Cambiar al correo del arrendador
    subject: "Califica tu experiencia",
    html: `<p>Notamos que tu contrato ha terminado recienetemente, nos gustaría conocer tu experiencia. <br/> Puedes calificar tu experiencia en <a href="${link}">aquí</a>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado al arrendador:", correoT);
  } catch (error) {
    throw error;
  }
};

app.post("/enviarCorreoResena", (req, res) => {
  try {
    const { correoT, id_inmueble } = req.body;
    const link = `http://localhost:3000/calificaarrendatario?id_inmueble=${id_inmueble}`;

    enviarCorreoReseña(correoT, link)
      .then(() => {
        res.json({ message: "Correo enviado al arrendatario" });
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ error: "Error al enviar el correo" });
      });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/perfilCompletado", (req, res) => {
  const idSesion = req.session.user.id; // Obtén el ID de sesión desde la sesión del usuario

  const sql = "SELECT perfil_completado FROM usuario WHERE id_usuario = ?";
  db.query(sql, [idSesion], (err, result) => {
    if (err) {
      console.error("Error al obtener el perfil completado:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      if (result.length > 0) {
        const perfilCompletado = result[0].perfil_completado;
        res.json({ perfilCompletado });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    }
  });
});

app.get("/actualizarPerfilCompletado", async (req, res) => {
  try {
    // Obtener el ID de usuario de la sesión
    const idUsuario = req.session.user.id;

    // Realizar la consulta para comprobar si los campos están completos
    const sql = `
      UPDATE usuario
      SET perfil_completado = 
        CASE
          WHEN comprobante_de_inscripcion IS NOT NULL 
               AND credencial_de_estudiante IS NOT NULL 
               AND comprobante_de_domicilio IS NOT NULL 
               AND identificacion_oficial IS NOT NULL 
            THEN 1
          ELSE perfil_completado
        END
      WHERE id_usuario = ?`;

    db.query(sql, [idUsuario], (err, result) => {
      if (err) {
        console.error("Error al actualizar perfil completado:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json({ message: "Perfil completado actualizado correctamente" });
      }
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/actualizarPerfilCompletadoArrendador", async (req, res) => {
  try {
    // Obtener el ID de usuario de la sesión
    const idUsuario = req.session.user.id;

    // Realizar la consulta para comprobar si los campos están completos
    const sql = `
      UPDATE usuario
      SET perfil_completado = 
        CASE
          WHEN identificacion_oficial IS NOT NULL 
            THEN 1
          ELSE perfil_completado
        END
      WHERE id_usuario = ?`;

    db.query(sql, [idUsuario], (err, result) => {
      if (err) {
        console.error("Error al actualizar perfil completado:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json({ message: "Perfil completado actualizado correctamente" });
      }
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/verificarEstadoRentados", async (req, res) => {
  try {
    // Obtener el ID de usuario de la sesión
    const idUsuario = req.session.user.id;

    // Realizar la consulta para verificar el estado de rentados
    const sql = `
      SELECT CASE
        WHEN EXISTS (
          SELECT 1 FROM rentados
          WHERE id_usuario = ? AND estado = 1
        ) THEN 0
        ELSE 1
      END AS resultado`;

    db.query(sql, [idUsuario], (err, result) => {
      if (err) {
        console.error("Error al verificar estado de rentados:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json({ resultado: result[0].resultado });
      }
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/checkRentados", async (req, res) => {
  try {
    const idUsuario = req.session.user.id;

    const sql = `
      SELECT CASE
        WHEN EXISTS (
          SELECT 1
          FROM inmueble
          WHERE id_usuario = ? AND id_inmueble IN (
            SELECT id_inmueble
            FROM rentados
            WHERE id_inmueble = inmueble.id_inmueble AND estado = 1
          )
        ) THEN 0
        ELSE 1
      END AS tieneEstadoActivo`;

    db.query(sql, [idUsuario], (err, result) => {
      if (err) {
        console.error("Error al verificar estado de inmuebles rentados:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json({ tieneEstadoActivo: result[0].tieneEstadoActivo });
      }
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/validateCP", (req, res) => {
  const cpValue = req.query.cp;
  const excelFilePath = "CodigosPostales.xlsx"; // Ruta al archivo Excel
  let alcaldiaValue = null;

  // Leer el archivo Excel y realizar la validación
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  // Realizar la búsqueda del código postal en el archivo Excel
  let asentamientoValue = null;

  for (let cell in worksheet) {
    if (cell.toString()[0] === "A" && cell !== "A1") {
      const cpFromExcel = worksheet[cell].v.toString();

      if (cpFromExcel === cpValue) {
        // Encuentra el código postal, obtén el valor de la columna F
        asentamientoValue = worksheet[`F${cell.substring(1)}`].v;
        alcaldiaValue = worksheet[`C${cell.substring(1)}`].v;
        break; // Termina el bucle una vez que se encuentra el código postal
      }
    }
  }

  // Enviar los resultados al navegador
  if (asentamientoValue !== null && alcaldiaValue !== null) {
    res.json({ asentamiento: asentamientoValue, alcaldia: alcaldiaValue });
  } else {
    res.status(404).json({ error: "Código postal no encontrado" });
  }
});

app.get("/obtenerDatosUsuario/:idUsuario", (req, res) => {
  const idUsuario = req.params.idUsuario;

  db.query(
    "SELECT comportamiento, contador_evaluaciones FROM usuario WHERE id_usuario = ?",
    [idUsuario],
    (err, result) => {
      if (err) {
        console.error("Error al obtener datos del usuario:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        // Enviar los datos de comportamiento y contador_evaluaciones
        res.json(result.length > 0 ? result[0] : {});
      }
    }
  );
});

app.get("/solicitudesPendientes", (req, res) => {
  const id_usuario = req.session.user.id;

  const sql = `
    SELECT i.*, r.id_usuario as idSolicitante, r.id_inmueble, u.nombre, u.primer_apellido, u.segundo_apellido 
    FROM inmueble i
    LEFT JOIN rentados r ON i.id_inmueble = r.id_inmueble AND r.estado = 0
    LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
    WHERE i.id_usuario = ? AND r.id_inmueble IS NOT NULL
  `;

  db.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al obtener solicitudes pendientes:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(result);
    }
  });
});

// Funciones para calcular distancia
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Endpoint para calcular la distancia
app.get("/escuelaCercana", (req, res) => {
  const { lat, lon } = req.query; // O req.body si estás usando POST

  if (!lat || !lon) {
    return res.status(400).send("Se requieren latitud y longitud");
  }

  const query = "SELECT id_escuela, latitud, longitud FROM escuela";
  db.query(query, (error, escuelas) => {
    if (error) {
      return res.status(500).send("Error al consultar la base de datos");
    }

    let menorDistancia = Infinity;
    let idEscuelaCercana = 0;

    escuelas.forEach((escuela) => {
      const distancia = getDistanceFromLatLonInKm(
        lat,
        lon,
        parseFloat(escuela.latitud),
        parseFloat(escuela.longitud)
      );
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        idEscuelaCercana = escuela.id_escuela;
      }
    });

    res.json({
      idEscuelaMasCercana: idEscuelaCercana,
      distancia: menorDistancia,
    });
  });
});
