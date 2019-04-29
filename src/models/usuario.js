const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre : {
        type : String,
        require : true,
        trim : true,
        //enum : {values : ['maria','jesus','pedro','david'], message : 'El nombre no es valido'},
        unique : true 
    },
    password :{
        type : String,
        required : true
    },
    id : {
        type: Number,
        required : true
    },
    correo : {
        type: String,
        required : true,
        unique : true,
        trim : true
    },
    telefono : {
        type: Number,
        required : true
    },
    rol : {
        type: String,
        required : true,
        enum : {values : ['aspirante','coordinador'], message : 'El rol no es valido'},
    },
    avatar : {
        type: Buffer
    },
});

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
