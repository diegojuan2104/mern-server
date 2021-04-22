const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear el servidor 
const app = express();

//Conectar la db
conectarDB();

//Habilitar cors 
app.use(cors());


//Habilitar el uso de express.json
app.use(express.json({ extended: true}));

//Puerto del app
const port = process.env.PORT || 4000;

//Importar rutas 
app.use('/api/usuarios', require("./routes/usuarios"));
app.use('/api/auth', require("./routes/auth"));
app.use('/api/proyectos', require("./routes/proyectos"));
app.use('/api/tareas', require("./routes/tareas"));

app.get('/', (req, res) => {
    res.send("Hola mundo")
})

//Runs the app
app.listen(port, '0.0.0.0', ()=> {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
})