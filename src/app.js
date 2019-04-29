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

//Puerto para trabajar sólo con express
// app.listen(process.env.PORT, () =>{
//     console.log('Servidor en el puerto' + process.env.PORT)
// })

//Para los sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//let contador = 0

const { Usuarios } = require('./models/usuarios');
const usuarios = new Usuarios();

io.on('connection', client => {
    console.log("Un usuario se conectó")

    // client.emit('mensaje','Bienvenido a mi página')

    // client.on('mensaje',(informacion) =>{
    //     console.log(informacion)
    // })

    // client.on('contador', () =>{
    //     contador ++
    //     console.log(contador)
    //     //Lo emite a un sólo cliente
    //     //client.emit('contador',contador)
    //     //Lo emite a todos
    //     io.emit('contador',contador)
    // })

    client.on('usuarioNuevo',(usuario,rol)=>{
        
        let listado = usuarios.agregarUsuario(client.id, usuario)
        console.log(listado)
        let texto = `Se ha conectado ${usuario} con rol ${rol}`
        io.emit('nuevoUsuario',texto)
    })

    client.on('disconnect',()=>{
        let usuarioBorrado = usuarios.borrarUsuario(client.id)
        let texto = `Se ha desconectado ${usuarioBorrado.nombre}`
        io.emit('usuarioDesconectado',texto)
    })

    client.on('texto', (txt,callback) =>{
        let usuario = usuarios.getUsuario(client.id)
        let texto = `${usuario.nombre} : ${txt}`
        io.emit('texto',(texto))
        callback()

    })

    client.on('textoPrivado', (txt,callback) =>{
        let usuario = usuarios.getUsuario(client.id)
        let texto = `${usuario.nombre} : ${txt.mensajePrivado}`
        let destinatario = usuarios.getDestinatario(txt.destinatario)
        //Se envía a todas las personas menos a mi
        //client.broadcast.emit('textoPrivado',(texto))

        //Se envía a un usuario en especídifico
        client.broadcast.to(destinatario.id).emit('textoPrivado',(texto))
        callback()

    })

  });

//Puerto con server para sockets
server.listen(process.env.PORT, (err) =>{
    console.log('Servidor en el puerto server ' + process.env.PORT)
})


