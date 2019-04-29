socket = io()

// socket.on('mensaje',(informacion) =>{
//     console.log(informacion)
// })

// socket.emit('mensaje','Estoy conectado')

// socket.emit('contador')

// socket.on('contador',(contador)=>{
//     console.log(contador)
// })

var param = new URLSearchParams(window.location.search);
var usuario = param.get('usuario')
var rol = param.get('rol')

socket.on("connect",()=>{
    console.log(usuario)
    socket.emit('usuarioNuevo',usuario,rol)
})

socket.on('nuevoUsuario',(texto)=>{
    console.log(texto)
    chat.innerHTML = chat.innerHTML +texto+ '<br>'
})

socket.on('usuarioDesconectado',(texto)=>{
    console.log(texto)
    chat.innerHTML = chat.innerHTML +texto+ '<br>'
})

const formulario = document.querySelector("#formulario")
const mensaje = formulario.querySelector("#texto")
const chat = document.querySelector("#chat")

formulario.addEventListener('submit',(datos) =>{
    datos.preventDefault()
    socket.emit('texto',mensaje.value,()=>{
            
            mensaje.value = ''
            mensaje.focus()

        })
})

socket.on('texto',(txt)=>{
    console.log(txt)
    chat.innerHTML = chat.innerHTML + `<li class="list-group-item">` +txt+ `</li>`
})

const formularioPrivado = document.querySelector("#formularioPrivado")
const mensajePrivado = formularioPrivado.querySelector("#textoPrivado")
const destinatario = formularioPrivado.querySelector("#destinatario")
const chatPrivado = document.querySelector("#chatPrivado")

formularioPrivado.addEventListener('submit',(datos) =>{
    datos.preventDefault()
    socket.emit('textoPrivado',{
        destinatario : destinatario.value,
        mensajePrivado: mensajePrivado.value
    },()=>{
        chatPrivado.innerHTML = chatPrivado.innerHTML +usuario+ ':' +mensajePrivado.value +'<br>'            
        mensajePrivado.value = ''
        mensajePrivado.focus()
        })
})

socket.on('textoPrivado',(txt)=>{
    console.log(txt)
    chat.innerHTML = chat.innerHTML + `<li class="list-group-item">` +txt+ `</li>`
})