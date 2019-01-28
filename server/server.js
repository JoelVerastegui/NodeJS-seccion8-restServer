const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Cargamos las configuraciones del servidor
require('./config/config')

// Cada vez que se use app.use, significa que estamos utilizando middlewares
// Los middlewares son funciones que se ejecutan en cada petición (app.get,post,put,delete,etc)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./routes/index'));

app.get('/', (req, res) => {
    res.send('Hi')
})

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}...`);
})