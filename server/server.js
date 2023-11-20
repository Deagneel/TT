import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
const salt = 10;

const app = express();

app.use(cors());
app.use(express.json()); 

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
                    return res.json({ Login: true });
                }
                return res.json({ Login: false });                
            });
        } else {
            console.log('No se encontró ningún usuario con ese correo.');
            return res.json("Fail: No coincide correo");
        }
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

const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
