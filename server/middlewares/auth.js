const jwt = require('jsonwebtoken');

// ========================
// Verificar token
// ========================

let verificarToken = (req, res, next) => {

    // Obtengo el token mediante la cabezera (headers) de la petición
    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuarioDB;

        next();

    })
}


// ========================
// Verificar admin
// ========================

let verificarAdmin = (req, res, next) => {
    let autor = req.usuario;

    if (autor.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: 'Usted no tiene permisos para realizar esta acción.'
        })
    }

    next();
}

module.exports = {
    verificarToken,
    verificarAdmin
};