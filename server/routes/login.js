const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Las credenciales son incorrectas'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Las credenciales son incorrectas'
                }
            })
        }

        let token = jwt.sign({ usuarioDB }, process.env.TOKEN_SEED, { expiresIn: 60 * 10 })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })

})

module.exports = app;