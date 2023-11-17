import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
//gg
const app = express();
app.use(cors());

const db = mysql.createConnection ({
    host: "viaduct.proxy.rlwy.net",
    user: "root",
    password: "HB45B21gFBag-H4G1E5cHAFe3gb3Cd5g",
    database: 'railway'
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM Escuela";
    db.query(sql, (err, result)=> {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.listen(3031, ()=> {
    console.log("Listening");
})