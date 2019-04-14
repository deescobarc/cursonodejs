const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const estudianteSchema = new Schema({
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
    matematicas : {
        type: Number,
        default : 0,
        min : 0,
        max : [5, 'Ingrese un número menor en matemáticas']
    },
    ingles : {
        type: Number,
        default : 0,
        min : 0,
        max : 5
    },
    programacion : {
        type: Number,
        default : 0,
        min : 0,
        max : 5
    }
});

estudianteSchema.plugin(uniqueValidator);

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;
