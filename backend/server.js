const express = require("express");

const mysql = require('mysql');

const cors = require('cors');

const { check, validationResult } = require('express-validator');


const app = express();app.use(cors());app.use(express.json());
const db = mysql.createConnection({    
    host: "localhost",    
    user: "root",    
    password: "",    
    database: "sistemarentas"})
    
app.post('/signup', (req, res) => {    
    const sql = "INSERT INTO usuario (nombre,correo,contrasena,tipo_de_usuario,perfil_completado,nombre_usuario) VALUES (?)";    
    const values = [        
        req.body.nombre,        
        req.body.correo,        
        req.body.contrasena,    
        req.body.tipo_de_usuario,
        req.body.perfil_completado,
        req.body.nombre_usuario
    ]    
    db.query(sql, [values], (err, data) => {        
        if(err) {            
            return res.json("Error");        
        }        
        return res.json(data);    
    })})
app.post('/login',[    
    check('correo', "Error en el tamaño de correo").isEmail().isLength({min: 15, max:50}),    
    check('contrasena', "Contraseña debe ser entre 8 y 15 caracteres").isLength({min: 8, max: 15})], (req, res) => {    
        const sql = "SELECT * FROM usuario WHERE correo = ? AND contrasena = ?";    
        db.query(sql, [req.body.correo,req.body.contrasena ], (err, data) => {
        const errors = validationResult(req);        
        if(!errors.isEmpty()) {            
            return res.json(errors);        
        } else {            
            if(err) {                
                return res.json("Error");            
            }            
            if(data.length > 0) {                
                return res.json("Success");            
            } else {                
                return res.json("Faile");            
            }        
        }            
    })})

app.listen(8081, ()=> {    
    console.log("listening");
})