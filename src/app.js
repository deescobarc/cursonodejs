const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers'); 

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../template/partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));
app.set ('view engine', 'hbs');

app.set ('views', path.join(__dirname,'../template/views'));

//Para que funcione boostrap
const dirNode_modules = path.join(__dirname , '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//Se llaman los controladores
const cursoControlador = require('./cursoControlador')
const inscripcionControlador = require('./inscripcionControlador')

app.get('/cursos',(req, res) =>{
    console.log(req.query);
    res.render('cursos',{
        titulo: 'Creación de un curso'  
    });
})

app.post('/cursoRegistrado', (req,res) => {
    console.log(req.body);
    curso = cursoControlador.crear(req.body);
    if(curso){
        console.log('esto pasó '+curso);
        res.render('cursoRegistrado',{
            titulo: 'Información del curso',
            curso: curso
        });
    }else{
        console.log('No pasó '+curso);
        res.render('cursos',{
            titulo: 'Curso ya existe vuelve a llenar los datos',
        });
    }
})

app.get('/vercursos',(req, res) =>{
    console.log(req.query);
    res.render('cursosLista',{
        titulo: 'Cursos Disponibles de Educación Continua'  
    });
})

app.get('/inscripcion',(req, res) =>{
    console.log(req.query);
    res.render('inscripcion',{
        titulo: 'Proceso de Inscripción a un Curso'  
    });
})

app.post('/inscripcionRealizada',(req, res) =>{
    console.log(req.body);
    inscripcion = inscripcionControlador.crear(req.body);
    if(inscripcion){
        console.log('esto pasó '+inscripcion);
        res.render('inscripcionRegistrada',{
            titulo: 'Información de la inscripción',
            id: parseInt(inscripcion[0].id),
            nombre: inscripcion[0].nombre,
            correo: inscripcion[0].correo,
            telefono: inscripcion[0].telefono,
            curso: inscripcion[2].nombre
        });
    }else{
        console.log('No pasó '+inscripcion);
        res.render('inscripcion',{
            titulo: 'El documento de identidad ya aparece inscrito en el curso',
        });
    }
})

app.get('/cursosInscripcion',(req, res) =>{
    console.log(req.query);
    res.render('inscripcionLista',{
        titulo: 'Cursos y aspirantes'  
    });
})

app.post('/cursosInscripcion',(req, res) =>{
    console.log('hhola' + req.bodyParser);
    //inscripcion = inscripcionControlador.actualizar(req.body);
    res.render('inscripcionLista',{
        titulo: 'Cursos y aspirantes'
    });
})


app.get('/',(req,res) => {
    res.render('index',{
        estudiante: 'Sebastian',
        titulo: 'Educación Continua'
    });
});

app.post('/calculos',(req, res) =>{
    console.log(req.query);
    res.render('calculos',{
        estudiante: req.body.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
})

app.get('/listado',(req, res) =>{

    console.log(req.query);
    res.render('listado',{
        titulo: 'Listado estudiantes'  
    });
})

app.get('*',(req,res) =>{
    res.render('error', {
        titulo: 'La página no existe',
        estudiante: 'error'
    });
})

app.post('*',(req,res) =>{
    res.render('error', {
        titulo: 'La página no existe',
        estudiante: 'error'
    });
})

app.listen(port, () => console.log(`listening on port ${port}!`))