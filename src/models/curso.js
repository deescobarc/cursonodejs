const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    nombre : {
        type : String,
        require : true,
        trim : true,
        //enum : {values : ['maria','jesus','pedro','david'], message : 'El nombre no es valido'},
        unique : true 
    },
    id : {
        type: Number,
        required : true,
        unique : true 
    },
    descripcion : {
        type: String,
        required : true
    },
    valor : {
        type: Number,
        required : true
    },
    modalidad : {
        type: String,
        enum : {values : ['','virtual','presencial'], message : 'La modalidad no es valida'}
    },
    intensidad : {
        type: Number
    },
    estado : {
        type: String,
        default : 'disponible'
    },
});

cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;
