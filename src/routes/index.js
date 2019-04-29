const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');


//Importar modelos
const Estudiante = require('./../models/estudiante');
const Usuario = require('./../models/usuario');
const Curso = require('./../models/curso');
const Inscripcion = require('./../models/inscripcion');

//Paths
const directoriopartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views');

//Bcrypt
const bcrypt = require('bcrypt');

//Para los correos
const  sgMail  =  require ( '@sendgrid/mail' );
sgMail . setApiKey ( process . env . SENDGRID_API_KEY );

//Multer
const multer = require('multer') 

require('./../helpers/helpers'); 

app.set ('view engine', 'hbs');
app.set ('views', dirViews);
hbs.registerPartials(directoriopartials);

//Para el chat
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
app.get('/chat',(req,res) => {
    res.render('chat',{
        titulo: 'Chat TdeA'
    });
});


app.get('/',(req,res) => {
    res.render('index',{
        titulo: 'Inicio'
    });
});


//En caso de que se quiera guardar en el servidor
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//     //   cb(null, file.fieldname + '-' + Date.now())
//       cb(null, 'avatar' + req.body.nombre + path.extname(file.originalname) )
//     }
//   })
   
// var upload = multer({ storage: storage })

var upload = multer({
    limits: {
        fileSize : 10000000
    },
    fileFilter (req, file, cb) {   
        if(!file.originalname.match(/\.(jpg|png|jpeg|JPEG|JPG)$/)) {
            return cb(new Error('No es un archivo validado')) 
        }         
        // To accept the file pass `true`, like so:
        cb(null, true)           
       
      }

 })


app.post('/',upload.single('archivo'),(req,res) => {
    
    if(req.file === undefined){
        
        let usuario = new Usuario ({
            nombre : req.body.nombre,
            password : bcrypt.hashSync(req.body.password, 10),
            id : req.body.id,
            correo : req.body.correo,
            telefono : req.body.telefono,
            rol : req.body.rol,
        })
        usuario.save((err,resultado)=>{
            if(err){
                res.render('indexpost',{
                    titulo: 'Error',
                    mostrarNombre : err
                })
            }else{
                //Para enviar correos
                const msg = {
                    to: req.body.correo,
                    from: 'deescobarc@unal.edu.co',
                    subject: 'Bienvenido',
                    text: 'Bienvenido a la página de Node.JS',
                    html: ' <strong> El usuario fue registrado </strong> ' 
                };   
                //sgMail.send(msg);
                res.render('indexpost',{
                    titulo: 'El usuario fue creado correctamente',
                    mostrarNombre : resultado.nombre
                })
            }
            
        })
    }else{
        
        let usuario = new Usuario ({
            nombre : req.body.nombre,
            password : bcrypt.hashSync(req.body.password, 10),
            id : req.body.id,
            correo : req.body.correo,
            telefono : req.body.telefono,
            rol : req.body.rol,
            avatar : req.file.buffer
        })
        usuario.save((err,resultado)=>{
            if(err){
                res.render('indexpost',{
                    titulo: 'Error',
                    mostrarNombre : err
                })
            }else{
                //Para enviar correos
                const msg = {
                    to: req.body.correo,
                    from: 'deescobarc@unal.edu.co',
                    subject: 'Bienvenido',
                    text: 'Bienvenido a la página de Node.JS',
                    html: ' <strong> El usuario fue registrado </strong> ' 
                };   
                //sgMail.send(msg);
                res.render('indexpost',{
                    titulo: 'El usuario fue creado correctamente',
                    mostrarNombre : resultado.nombre
                })
            }
            
        })
    }


    // let estudiante = new Estudiante ({
    //     nombre : req.body.nombre,
    //     matematicas : req.body.matematicas,
    //     ingles : req.body.ingles,
    //     programacion : req.body.programacion,
    //     password : bcrypt.hashSync(req.body.password, 10),
    // })

    // estudiante.save((err,resultado)=>{
    //     if(err){
    //         res.render('indexpost',{
    //             titulo: 'Error',
    //             mostrarNombre : err
    //         })
    //     }else{
    //         res.render('indexpost',{
    //             titulo: 'Guardado',
    //             mostrarNombre : resultado.nombre
    //         })
    //     }
        
    // })

    
});

app.post('/ingresar', (req,res)=>{

    Usuario.findOne({correo : req.body.correo}, (err,resultados)=>{
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
        console.log(resultados.avatar)

        //Para crear las variables de sesión
        req.session.usuario = resultados._id
        req.session.nombre = resultados.nombre
        if(resultados.avatar === undefined){
            avatar = null
        }else{
            avatar = resultados.avatar.toString('base64')
        }
        

        if(resultados.rol == 'aspirante'){
            req.session.aspirante = true
            req.session.coordinador = false
        }

        if(resultados.rol == 'coordinador'){
            req.session.coordinador = true
            req.session.aspirante = false
        }

        // let token = jwt.sign({
        //                 usuario: resultados
        //             }, 'tdea-virtual', { expiresIn: '1h' });
        
        
        // console.log(token)            
        // localStorage.setItem('token', token);
        
        if(resultados.rol == 'aspirante'){
            return res.render('ingresar',{
                mensaje : "Bienvenido "+ resultados.nombre,
                //nombre : resultados.nombre,
                rol : resultados.rol,
                nombre : resultados.nombre,
                sesion : true,
                aspirante : true,
                avatar : avatar
            })
        }
        if(resultados.rol == 'coordinador'){
            return res.render('ingresar',{
                mensaje : "Bienvenido "+ resultados.nombre,
                //nombre : resultados.nombre,
                rol : resultados.rol,
                nombre : resultados.nombre,
                sesion : true,
                coordinador : true,
                avatar : avatar
            })
        }

        
    })

    // Estudiante.findOne({nombre : req.body.usuario}, (err,resultados)=>{
    //     if(err){
    //         return console.log(err)
    //     }

    //     if(!resultados){
    //         return res.render('ingresar',{
    //             mensaje : "Usuario no encontrado",
    //         })
    //     }

    //     if(!bcrypt.compareSync(req.body.password, resultados.password)){
    //         return res.render('ingresar',{
    //             mensaje : "Contraseña incorrecta",
    //         })
    //     }

    //     //Para crear las variables de sesión
    //     req.session.usuario = resultados._id
    //     req.session.nombre = resultados.nombre
    //     console.log(req.session)

    //     // let token = jwt.sign({
    //     //                 usuario: resultados
    //     //             }, 'tdea-virtual', { expiresIn: '1h' });
        
        
    //     // console.log(token)            
    //     // localStorage.setItem('token', token);
        
    //     res.render('ingresar',{
    //         mensaje : "Bienvenido "+ resultados.nombre,
    //         //nombre : resultados.nombre,
    //         nombre : req.session.nombre,
    //         sesion : true,
    //     })
    // })
    
})

app.get('/salir',(req,res) => {
    req.session.destroy((err)=>{
        if(err) return console.log(err)
    })
    // localStorage.setItem('token', '');
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

    // console.log(req.usuario)
    // Estudiante.findById(req.usuario,(err, usuario) => {
    //     if(err){
    //         return console.log(err)
    //     }
    //     if(!usuario){
    //         return res.redirect('/')
    //     }
    //     res.render ('actualizar',{
    //         nombre : usuario.nombre,
    //         matematicas : usuario.matematicas,
    //         ingles : usuario.ingles,
    //         programacion : usuario.programacion
    //     })
    // });

    //En caso de trabajar con variables de sesión
    Estudiante.findById(req.session.usuario,(err, usuario) => {
        if(err){
            return console.log(err)
        }
        res.render ('actualizar',{
            nombre : usuario.nombre,
            matematicas : usuario.matematicas,
            ingles : usuario.ingles,
            programacion : usuario.programacion
        })
    });
    
})

app.post('/actualizar', (req,res)=>{
   
    Estudiante.findOneAndUpdate({nombre : req.body.nombre}, req.body,{new : true, runValidators: true, context: 'query'}, (err,resultados)=>{
        if(err){
            return console.log(err)
        }
        //console.log(resultados)
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
    //console.log(req.body)
    let curso = new Curso ({
        nombre : req.body.nombre,
        id : req.body.id,
        descripcion : req.body.descripcion,
        valor : req.body.valor,
        modalidad : req.body.modalidad,
        intensidad : req.body.intensidad,
    })

    curso.save((err,resultado)=>{
        if(err){
            //console.log('No pasó '+curso);
            res.render('cursos',{
            titulo: 'No se pudo crear vuelva a intentar',
            Error : err
        });
        }else{
            res.render('cursoRegistrado',{
                titulo: 'Información del curso',
                curso: curso,
                mostrarNombre : resultado.nombre
            })
        }
        
    })

    // curso = cursoControlador.crear(req.body);
    // if(curso){
    //     console.log('esto pasó '+curso);
    //     res.render('cursoRegistrado',{
    //         titulo: 'Información del curso',
    //         curso: curso
    //     });
    // }else{
    //     console.log('No pasó '+curso);
    //     res.render('cursos',{
    //         titulo: 'Curso ya existe vuelve a llenar los datos',
    //     });
    // }
})

app.get('/vercursos',(req, res) =>{
    Curso.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log(err)
        }
        if(respuesta){
            return res.render ('cursosLista',{
                titulo: 'Cursos Disponibles de Educación Continua',
                listado : respuesta
            })
        }else{
            return res.redirect('/',{
                titulo: 'Nadie se ha inscrito a los cursos'
            })
        }

        
    })
    // console.log(req.query);
    // res.render('cursosLista',{
    //     titulo: 'Cursos Disponibles de Educación Continua'  
    // });
})

app.get('/inscripcion',(req, res) =>{
    Curso.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log(err)
        }

        Usuario.findById(req.session.usuario,(err, usuario) => {
            if(err){
                return console.log(err)
            }
            res.render ('inscripcion',{
                titulo: 'Proceso de Inscripción a un Curso',
                id : usuario.id,
                nombre : usuario.nombre,
                correo : usuario.correo,
                telefono : usuario.telefono,
                listado : respuesta
            })
        })
    })
    
    // console.log(req.query);
    // res.render('inscripcion',{
    //     titulo: 'Proceso de Inscripción a un Curso'  
    // });
})

app.post('/inscripcionRealizada',(req, res) =>{

    Inscripcion.findOne({id : req.body.id, curso: req.body.curso},(err, inscrip) => {
        if(err){
            return console.log(err)
        }
        if(inscrip){
            Curso.find({}).exec((err,respuesta)=>{
                if(err){
                    return console.log(err)
                }
        
                Usuario.findById(req.session.usuario,(err, usuario) => {
                    if(err){
                        return console.log(err)
                    }
                    return res.render ('inscripcion',{
                        titulo: 'El documento de identidad ya aparece inscrito en el curso',
                        id : usuario.id,
                        nombre : usuario.nombre,
                        correo : usuario.correo,
                        telefono : usuario.telefono,
                        listado : respuesta
                    })
                })
            })
        }else{
            let inscripcion = new Inscripcion ({
                id : req.body.id,
                nombre : req.body.nombre,
                correo : req.body.correo,
                telefono : req.body.telefono,
                curso : req.body.curso
            })
        
            inscripcion.save((err,resultado)=>{
                if(err){
                    //console.log('No pasó '+curso);
                    Usuario.findById(req.session.usuario,(err, usuario) => {
                        if(err){
                            return console.log(err)
                        }
                        return res.render ('inscripcion',{
                            titulo: 'No se pudo hacer la inscripcion',
                            id : usuario.id,
                            nombre : usuario.nombre,
                            correo : usuario.correo,
                            telefono : usuario.telefono,
                            listado : respuesta
                        })
                    })
                }else{
                    //Para enviar correos
                    
                    Curso.findOne({id : req.body.curso},(err, curso) => {
                        if(err){
                            return console.log(err)
                        }
                                                
                        const msg = {
                            to: req.body.correo,
                            from: 'deescobarc@unal.edu.co',
                            subject: 'Incripción al curso de '+curso.nombre+ 'En el TdeA',
                            text: 'Bienvenido al Tecnológico de Antioquia',
                            html: `<p>Su inscripción fue realizada correctamente, la información del curso es:</p>
                                    <br>
                                    <b>Nombre: </b>${curso.nombre} <br>  
                                    <b>Valor: $</b> ${curso.valor}
                                    <b>Descripción: </b> ${curso.descripcion} <br>
                                    <b>Modalidad: </b> ${curso.modalidad} <br>
                                    <b>Intensidad Horaria: </b> ${curso.intensidad} <br>
                                    <p>Lo estaremos contactando en la mayor brevedad posible para darle indicaciones acerca del comienzo del curso</p>`
                        };   
                        sgMail.send(msg);
                    });
                    
                    res.render('inscripcionRegistrada',{
                        titulo: 'Información de la inscripción',
                        id: resultado.id,
                        nombre: resultado.nombre,
                        correo: resultado.correo,
                        telefono: resultado.telefono,
                        curso : resultado.curso
                    })
                }
                
            })
        }

        

        
    })

    


    // console.log(req.body);
    // inscripcion = inscripcionControlador.crear(req.body);
    // if(inscripcion){
    //     console.log('esto pasó '+inscripcion);
    //     res.render('inscripcionRegistrada',{
    //         titulo: 'Información de la inscripción',
    //         id: parseInt(inscripcion[0].id),
    //         nombre: inscripcion[0].nombre,
    //         correo: inscripcion[0].correo,
    //         telefono: inscripcion[0].telefono,
    //         curso: inscripcion[2].nombre
    //     });
    // }else{
    //     console.log('No pasó '+inscripcion);
    //     res.render('inscripcion',{
    //         titulo: 'El documento de identidad ya aparece inscrito en el curso',
    //     });
    // }
})

app.get('/cursosInscripcion',(req, res) =>{

    Inscripcion.find({}).exec((err,inscripciones)=>{
        if(err){
            return console.log(err)
        }
        if(!inscripciones){
            return res.redirect('/',{
                titulo: 'Nadie se ha inscrito a los cursos'
            })
        }
        Curso.find({}).exec((err,cursos)=>{
            if(err){
                return console.log(err)
            }
            Usuario.find({}).exec((err,usuarios)=>{
                if(err){
                    return console.log(err)
                }
                res.render ('inscripcionLista',{
                    titulo: 'Cursos Disponibles con sus aspirantes de Educación Continua',
                    inscripciones : inscripciones,
                    cursos : cursos,
                    usuarios : usuarios
                })
            })
        })

    })

    // console.log(req.query);
    // res.render('inscripcionLista',{
    //     titulo: 'Cursos y aspirantes'  
    // });
})

app.post('/cursosInscripcion',(req, res) =>{

    if(req.body.curso){
        Curso.findOne({id : req.body.curso},(err, cursoE) => {
            if(err){
                return console.log(err)
            }
            if(cursoE.estado == 'cerrado'){
                return Curso.findOneAndUpdate({id : req.body.curso}, {$set:{estado:'disponible'}},{new : true, runValidators: true, context: 'query'}, (err,resultados)=>{
                    if(err){
                        return console.log(err)
                    }
                    Inscripcion.find({}).exec((err,inscripciones)=>{
                        if(err){
                            return console.log(err)
                        }
                        if(!inscripciones){
                            return res.redirect('/',{
                                titulo: 'Nadie se ha inscrito a los cursos'
                            })
                        }
                        Curso.find({}).exec((err,cursos)=>{
                            if(err){
                                return console.log(err)
                            }
                            Usuario.find({}).exec((err,usuarios)=>{
                                if(err){
                                    return console.log(err)
                                }
                                return res.render ('inscripcionLista',{
                                    titulo: 'Cursos Disponibles con sus aspirantes de Educación Continua',
                                    inscripciones : inscripciones,
                                    cursos : cursos,
                                    usuarios : usuarios
                                })
                            })
                        })
                
                    })
                })
            }
            
            if(cursoE.estado == 'disponible'){
                return Curso.findOneAndUpdate({id : req.body.curso}, {$set:{estado:'cerrado'}},{new : true, runValidators: true, context: 'query'}, (err,resultados)=>{
                    if(err){
                        return console.log(err)
                    }
                    
                    Inscripcion.find({}).exec((err,inscripciones)=>{
                        if(err){
                            return console.log(err)
                        }
                        if(!inscripciones){
                            return res.redirect('/',{
                                titulo: 'Nadie se ha inscrito a los cursos'
                            })
                        }
                        Curso.find({}).exec((err,cursos)=>{
                            if(err){
                                return console.log(err)
                            }
                            Usuario.find({}).exec((err,usuarios)=>{
                                if(err){
                                    return console.log(err)
                                }
                                return res.render ('inscripcionLista',{
                                    titulo: 'Cursos Disponibles con sus aspirantes de Educación Continua',
                                    inscripciones : inscripciones,
                                    cursos : cursos,
                                    usuarios : usuarios
                                })
                            })
                        })
                
                    })
                })
            }
        })
    }else{
        Inscripcion.findOneAndDelete({id : req.body.idUser, curso : req.body.idCurso}, req.body, (err,resultados)=>{
            if(err){
                return console.log(err)
            }
    
            if(!resultados){
                return res.render('/',{
                    nombre : "No se pudo eliminar la inscripción",
                })
            }
            Inscripcion.find({}).exec((err,inscripciones)=>{
                if(err){
                    return console.log(err)
                }
                if(!inscripciones){
                    return res.redirect('/',{
                        titulo: 'Nadie se ha inscrito a los cursos'
                    })
                }
                Curso.find({}).exec((err,cursos)=>{
                    if(err){
                        return console.log(err)
                    }
                    Usuario.find({}).exec((err,usuarios)=>{
                        if(err){
                            return console.log(err)
                        }
                        return res.render ('inscripcionLista',{
                            titulo: 'Cursos Disponibles con sus aspirantes de Educación Continua',
                            inscripciones : inscripciones,
                            cursos : cursos,
                            usuarios : usuarios
                        })
                    })
                })
        
            })

            
        })
    }
    

    

    // console.log(req.body.curso);
    
    // if(req.body.curso){
    //     inscripcion = inscripcionControlador.actualizar(req.body.curso);
    // }else{
    //     console.log(req.body);
    //     inscripcion = inscripcionControlador.eliminar(req.body.idUser);
    // }
    
    // res.render('inscripcionLista',{
    //     titulo: 'Cursos y aspirantes'
    // });
})




app.post('/calculos',(req, res) =>{
    //console.log(req.query);
    res.render('calculos',{
        estudiante: req.body.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
})

app.get('/listado',(req, res) =>{

    //console.log(req.query);
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