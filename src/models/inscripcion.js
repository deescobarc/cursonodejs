const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const inscripcionSchema = new Schema({
    nombre : {
        type : String,
        require : true,
        trim : true,
        //enum : {values : ['maria','jesus','pedro','david'], message : 'El nombre no es valido'}
    },
    id : {
        type : String,
        require : true
    },
    correo : {
        type: String,
        required : true
    },
    telefono : {
        type: Number,
        required : true
    },
    curso : {
        type: String,
        required : true
    }
});

inscripcionSchema.plugin(uniqueValidator);

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

module.exports = Inscripcion;
