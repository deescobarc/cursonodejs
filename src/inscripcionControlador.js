const fs = require ('fs');
listaInscripcion = [];
listaUsuarios = [];
listaCursos = [];

const crear = (inscripcion) => {
    listar();
    let user = {
        id: inscripcion.id,
        nombre: inscripcion.nombre,
        correo: inscripcion.correo,
        telefono: inscripcion.telefono
    }
    let ins = {
        idUser: inscripcion.id,
        idCurso: inscripcion.curso
    };
    let duplicado = listaInscripcion.find(i => i.idUser == inscripcion.id && i.idCurso == inscripcion.curso)
    if (!duplicado){
        listaInscripcion.push(ins);
        duplicadoUser = listaUsuarios.find(u => u.id == inscripcion.id)
        if(!duplicadoUser){
            listaUsuarios.push(user);
            guardarUser();
        }
        guardar();
        curso = listaCursos.find(c => c.id == inscripcion.curso)
        return [user,ins,curso];
        //console.log(listaCursos);
    }
    else{
        console.log('El documento de identidad aparece inscrito en el curso');
        return false;
    }
}

const listar = () => {
    //Para que cree la lista en caso de que no exista
    try {
        listaInscripcion = require('./listadoInscripcion.json');
    }catch(error){
        listaInscripcion = [];
    }
    try {
        listaUsuarios = require('./listadoUsuarios.json');
    }catch(error){
        listaUsuarios = [];
    }
    try {
        listaCursos = require('./listadoCursos.json');
    }catch(error){
        listaCursos = [];
    }
}

const guardar = () =>{
    let datos = JSON.stringify(listaInscripcion);
    fs.writeFile('src/listadoInscripcion.json', datos, (err)=>{
        if (err) trow (err);
        console.log('Archivo inscripciones creado o actualizado con éxito');
    })
}

const guardarC = () =>{
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('src/listadoCursos.json', datos, (err)=>{
        if (err) trow (err);
        console.log('Archivo cursos creado o actualizado con éxito');
    })
}

const guardarUser = () =>{
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('src/listadoUsuarios.json', datos, (err)=>{
        if (err) trow (err);
        console.log('Archivo usuarios creado o actualizado con éxito');
    })
}

const mostrar = () =>{
    listar();
    console.log('Cursos')
    listaCursos.forEach(curso => {
        console.log (curso.nombre+'y su id '+ curso.id);
    });
}

const actualizar = (id) =>{
    //Traigo lo que hay en el json
    listar();
    let encontrado = listaCursos.find(buscar => buscar.id == id)
    if (!encontrado){
        console.log('No existe el curso');
        return 'No existe el curso';
    }
    else{
        //Le modifico el estado
        if(encontrado['estado'] == 'disponible'){
            encontrado['estado'] = 'cerrado';
        }else{
            encontrado['estado'] = 'disponible';
        }
        guardarC();
    }
}

const eliminar = (id) =>{
    listar();
    let nuevo = listaInscripcion.filter(bus => bus.idUser != id);
    let nuevoU = listaUsuarios.filter(bus => bus.id != id);
    if(nuevo.length == listaInscripcion.length){
        console.log('Ningún estudiante tiene el nombre indicado');
    }
    else{
        console.log('entré');
        listaInscripcion = nuevo;
        listaUsuarios = nuevoU;
        guardar();  
        guardarUser();      
    }
}


module.exports = {
    crear,
    actualizar,
    eliminar
}