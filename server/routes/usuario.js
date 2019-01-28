const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const underscore = require('underscore');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');


// El segundo parámetro del app.get es el middleware
// que se usará al realizar esa petición.
// Se importa el contenido de middlewares/auth.js en vez
// de ejecutar la función, es por ello que no se usa '()'
// El código importado se ejecutará al realizar la petición get.
// El middleware se ejecutará antes de realizar el callback

app.get('/usuario', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ /*nombre: 'Jorge', estado: true*/ }, 'nombre email google estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ /*nombre: 'Jorge', estado: true*/ }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: count,
                    autor: req.usuario.nombre
                })
            })
        })
})

app.post('/usuario', [verificarToken, verificarAdmin], (req, res) => {

    let autor = req.usuario;

    let body = req.body; // Devuelve los datos procesados del bodyParser que haya enviado mediante un payload

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    // Este método guardará todo el objeto en la bd de mongo
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            autor: autor.nombre
        })

    })
})

app.put('/usuario/:id', [verificarToken, verificarAdmin], (req, res) => {

    let autor = req.usuario;

    let id = req.params.id;

    let body = underscore.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            autor: autor.nombre
        })

    })
})

app.delete('/usuario/:id', [verificarToken, verificarAdmin], (req, res) => {

    let autor = req.usuario;

    let id = req.params.id;
    /*
    Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario ingresado no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioEliminado
        })
    })
    */

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioActualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioActualizado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario ingresado no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioActualizado,
            autor: autor.nombre
        })
    })
})

module.exports = app