const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Cargamos las configuraciones del servidor
require('./config/config')

// Cada vez que se use app.use, significa que estamos utilizando middlewares
// Los middlewares son funciones que se ejecutan en cada petición (app.get,post,put,delete,etc)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hi')
})

app.post('/usuario', (req, res) => {
    let body = req.body; // Devuelve los datos procesados del bodyParser que haya enviado mediante un payload

    res.json({
        persona: body
    })
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
        id
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}...`);
})