const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistemarentas"
});

app.post('/signup', (req, res) => {
    const correo = req.body.correo;
  
    const checkEmailQuery = "SELECT * FROM usuario WHERE correo = ?";
    db.query(checkEmailQuery, correo, (err, result) => {
      if (err) {
        console.error(err);
        return res.json("Error");
      }
  
      if (result.length > 0) {
        return res.json("El correo ya está registrado");
      } else {
        const insertQuery = "INSERT INTO usuario (nombre, correo, contrasena, tipo_de_usuario, perfil_completado, nombre_usuario) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [
          req.body.nombre,
          req.body.correo,
          req.body.contrasena,
          req.body.tipo_de_usuario,
          req.body.perfil_completado,
          req.body.nombre_usuario
        ];
  
        db.query(insertQuery, values, (err, data) => {
          if (err) {
            console.error(err);
            return res.json("Error");
          }
  
          return res.json(data);
        });
      }
    });
  });

app.post('/login', [
  check('correo', "Error en el tamaño de correo").isEmail().isLength({ min: 15, max: 50 }),
  check('contrasena', "Contraseña debe ser entre 8 y 15 caracteres").isLength({ min: 8, max: 15 })
], (req, res) => {
  const sql = "SELECT * FROM usuario WHERE correo = ? AND contrasena = ?";
  db.query(sql, [req.body.correo, req.body.contrasena], (err, data) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors);
    } else {
      if (err) {
        console.error(err);
        return res.json("Error");
      }

      if (data.length > 0) {
        return res.json("Success");
      } else {
        return res.json("Fail");
      }
    }
  });
});

app.get('/checkEmail', (req, res) => {
    const correo = req.query.correo;
  
    const checkEmailQuery = "SELECT * FROM usuario WHERE correo = ?";
    db.query(checkEmailQuery, correo, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ exists: false, error: "Error" });
      }
  
      if (result.length > 0) {
        return res.json({ exists: true, error: "El correo ya está registrado" });
      } else {
        return res.json({ exists: false, error: "" });
      }
    });
  });

app.listen(8081, () => {
  console.log("Listening on port 8081");
});