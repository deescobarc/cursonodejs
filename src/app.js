//Requires
require('./config/config')
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
//const hbs = require('hbs');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

//Para usar las variables de sesión
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

//Paths
const directoriopublico = path.join(__dirname, '../public');
const dirNode_modules = path.join(__dirname , '../node_modules')
//const directoriopartials = path.join(__dirname, '../template/partials');

//Statics
app.use(express.static(directoriopublico));
app.use(bodyParser.urlencoded({extended: false}));

//Para que funcione boostrap

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//Para usar las variables de sesión
app.use(session({
    cookie: {maxAge: 86400000},
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))


//Iniciar sesión
app.use((req,res,next)=>{
    
    //En caso de usar variables de sesion
    if(req.session.usuario){
        res.locals.sesion = true
        res.locals.aspirante = req.session.aspirante
        res.locals.coordinador = req.session.coordinador
        res.locals.nombre = req.session.nombre
    }
    next()

    // let token = localStorage.getItem('token')
    // jwt.verify(token, 'tdea-virtual', (err, decoded) =>{
    //     if(err){
    //         //console.log(err)
    //         return next()
    //     }
    //     console.log(decoded) // bar
    //     res.locals.sesion = true
    //     res.locals.nombre = decoded.usuario.nombre
    //     req.usuario = decoded.usuario._id
    //     next()
    //   });
})

//Rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {useNewUrlParser: true},
(err,resultado)=>{
    if(err){
        return console.log(error)
    }
    console.log("conectado")
});


//Puerto
app.listen(process.env.PORT, () =>{
    console.log('Servidor en el puerto' + process.env.PORT)
})


