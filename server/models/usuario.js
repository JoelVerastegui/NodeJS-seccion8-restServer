const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Ingrese un nombre válido']
    },
    email: {
        type: String,
        required: [true, 'Ingrese un correo válido'],
        unique: true // Si es true, no permitirá crear usuarios con emails iguales ni modificar el email del mismo
    },
    password: {
        type: String,
        required: [true, 'Ingrese una contraseña válida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['USER_ROLE', 'ADMIN_ROLE'],
            message: '{VALUE} no es un rol válido'
        }
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Método para ocultar la contraseña encriptada
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Validación de campos únicos
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} es un dato único y no puede ser repetido' })

module.exports = mongoose.model('Usuario', usuarioSchema)