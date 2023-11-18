import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json()); // Agrega esta línea para manejar datos JSON en las solicitudes

const db = mysql.createConnection({
    host: "bccdb0knkukccxehxrur-mysql.services.clever-cloud.com",
    user: "u0umkw3bjydys9qe",
    password: "jS9hYCGfJdgbZ4wHnbyg",
    database: 'bccdb0knkukccxehxrur'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body; // Recupera los datos del cuerpo de la solicitud

    // Realiza la lógica de autenticación aquí, consulta la base de datos, etc.

    const sql = "SELECT * FROM usuario WHERE correo = ? AND contrasena = ?";
    db.query(sql, [correo, contrasena], (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return res.json({ message: "Error inside server" });
        }

        console.log('Resultados de la consulta:', result);

        if (result.length > 0) {
            // Usuario autenticado con éxito
            return res.json({ status: 'Success' });
        } else {
            // Usuario no autenticado
            return res.json({ status: 'Failure', message: 'Invalid credentials' });
        }
    });
});



// Ruta existente para obtener datos de la tabla "escuela"
app.get('/', (req, res) => {
    const sql = "SELECT * FROM escuela";
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error inside server" });
        return res.json(result);
    });
});

app.listen(3031, () => {
    console.log("Listening");
});
