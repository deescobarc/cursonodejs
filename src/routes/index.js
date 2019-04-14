const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');


//Importar modelos
const Estudiante = require('./../models/estudiante')

//Paths
const directoriopartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views');

//Bcrypt
const bcrypt = require('bcrypt');




require('./../helpers/helpers'); 

app.set ('view engine', 'hbs');
app.set ('views', dirViews);
hbs.registerPartials(directoriopartials);



app.get('/',(req,res) => {
    res.render('index',{
        titulo: 'Inicio'
    });
});

app.post('/',(req,res) => {

    let estudiante = new Estudiante ({
        nombre : req.body.nombre,
        matematicas : req.body.matematicas,
        ingles : req.body.ingles,
        programacion : req.body.programacion,
        password : bcrypt.hashSync(req.body.password, 10),
    })

    estudiante.save((err,resultado)=>{
        if(err){
            res.render('indexpost',{
                titulo: 'Error',
                mostrarNombre : err
            })
        }else{
            res.render('indexpost',{
                titulo: 'Guardado',
                mostrarNombre : resultado.nombre
            })
        }
        
    })

    
});

app.post('/ingresar', (req,res)=>{

    Estudiante.findOne({nombre : req.body.usuario}, (err,resultados)=>{
        if(err){
            return console.log(err)
        }

        if(!resultados){
            return res.render('ingresar',{
                mensaje : "Usuario no encontrado",
            })
        }

        if(!bcrypt.compareSync(req.body.password, resultados.password)){
            return res.render('ingresar',{
                mensaje : "Contraseña incorrecta",
            })
        }

        // //Para crear las variables de sesión
        // req.session.usuario = resultados._id
        // req.session.nombre = resultados.nombre
        //console.log(req.session)

        let token = jwt.sign({
                        usuario: resultados
                    }, 'tdea-virtual', { expiresIn: '1h' });
        
        
        console.log(token)            
        localStorage.setItem('token', token);
        
        res.render('ingresar',{
            mensaje : "Bienvenido "+ resultados.nombre,
            nombre : resultados.nombre,
            //nombre : req.session.nombre,
            //sesion : true,
        })
    })
    
})

app.get('/salir',(req,res) => {
    // req.session.destroy((err)=>{
    //     if(err) return console.log(err)
    // })
    localStorage.setItem('token', '');
    res.redirect('/')
});


app.get('/vernotas', (req,res)=>{
    Estudiante.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log(err)
        }

        res.render ('vernotas',{
            listado : respuesta
        })
    })
})

app.get('/actualizar', (req,res)=>{

    console.log(req.usuario)
    Estudiante.findById(req.usuario,(err, usuario) => {
        if(err){
            return console.log(err)
        }
        if(!usuario){
            return res.redirect('/')
        }
        res.render ('actualizar',{
            nombre : usuario.nombre,
            matematicas : usuario.matematicas,
            ingles : usuario.ingles,
            programacion : usuario.programacion
        })
    });

    // //En caso de trabajar con variables de sesión
    // Estudiante.findById(req.session.usuario,(err, usuario) => {
    //     if(err){
    //         return console.log(err)
    //     }
    //     res.render ('actualizar',{
    //         nombre : usuario.nombre,
    //         matematicas : usuario.matematicas,
    //         ingles : usuario.ingles,
    //         programacion : usuario.programacion
    //     })
    // });
    
})

app.post('/actualizar', (req,res)=>{
   
    Estudiante.findOneAndUpdate({nombre : req.body.nombre}, req.body,{new : true, runValidators: true, context: 'query'}, (err,resultados)=>{
        if(err){
            return console.log(err)
        }
        console.log(resultados)
        res.render('actualizar',{
            
            nombre : resultados.nombre,
            matematicas : resultados.matematicas,
            ingles : resultados.ingles,
            programacion : resultados.programacion
        })
    })
    
})

app.post('/eliminar', (req,res)=>{
   
    Estudiante.findOneAndDelete({nombre : req.body.nombre}, req.body, (err,resultados)=>{
        if(err){
            return console.log(err)
        }

        if(!resultados){
            res.render('eliminar',{
                nombre : "Nombre no encontrado",
            })
        }
        
        res.render('eliminar',{
            nombre : resultados.nombre,
        })
    })
    
})






//Se llaman los controladores
const cursoControlador = require('../cursoControlador')
const inscripcionControlador = require('../inscripcionControlador')

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
    console.log(req.body.curso);
    
    if(req.body.curso){
        inscripcion = inscripcionControlador.actualizar(req.body.curso);
    }else{
        console.log(req.body);
        inscripcion = inscripcionControlador.eliminar(req.body.idUser);
    }
    
    res.render('inscripcionLista',{
        titulo: 'Cursos y aspirantes'
    });
})




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

module.exports = app