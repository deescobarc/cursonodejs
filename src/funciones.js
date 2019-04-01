const fs = require ('fs');
listaEstudiantes = [];

const crear = (estudiante) => {
    listar();
    let est = {
        nombre: estudiante.nombre,
        matematicas: estudiante.matematicas,
        ingles: estudiante.ingles,
        programacion: estudiante.programacion
    };
    let duplicado = listaEstudiantes.find(nom => nom.nombre == estudiante.nombre)
    if (!duplicado){
        listaEstudiantes.push(est);
        console.log(listaEstudiantes);
        guardar();
    }
    else{
        console.log('Ya existe un estudiante con ese nombre');
    }
    
}

const listar = () => {
    //Para que cree la lista en caso de que no exista
    try {
        //Si se maneja como constante
        listaEstudiantes = require('./listado.json');
        //Sincronica
        //listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'))
    }catch(error){
        listaEstudiantes = [];
    }
}

const guardar = () =>{
    let datos = JSON.stringify(listaEstudiantes);
    fs.writeFile('listado.json', datos, (err)=>{
        if (err) trow (err);
        console.log('Archivo creado con éxito');
    })
}

const mostrar = () =>{
    listar();
    console.log('Nostas de los estudiantes')
    listaEstudiantes.forEach(estudiante => {
        console.log (estudiante.nombre);
        console.log('notas ');
        console.log(' matemáticas '+ estudiante.matematicas)
        console.log(' inglés  '+ estudiante.ingles)
        console.log(' programación '+ estudiante.programacion + '\n')
    });
}

const mostrarest = (nom) => {
    listar();
    //Busca estudiante y lo retorna
    let est = listaEstudiantes.find(buscar => buscar.nombre == nom)
    if (!est){
        console.log('No existe este estudiante');
    }
    else{
        console.log (est.nombre);
        console.log('notas ');
        console.log(' matemáticas '+ est.matematicas)
        console.log(' inglés  '+ est.ingles)
        console.log(' programación '+ est.programacion + '\n')
    }
}

const mostrarmat = () =>{
    listar();
    let ganan = listaEstudiantes.filter(mat => mat.matematicas >= 3);
    if(ganan.length == 0){
        console.log('Ningún estudiante va ganando');
    }
    else{
        ganan.forEach(estudiante => {
            console.log (estudiante.nombre);
            console.log('notas ');
            console.log(' matemáticas '+ estudiante.matematicas)
        }); 
    }
}

const promedio = (nom) =>{
    listar();
    //Busca estudiante y lo retorna
    let est = listaEstudiantes.find(buscar => buscar.nombre == nom)
    if (!est){
        console.log('No existe este estudiante');
    }
    else{
        let prom = (est.matematicas + est.ingles + est.programacion)/3;
        console.log ('El estudiante '+ est.nombre +  ' tiene un promedio de: ' + prom);
    }
}

const prom3 = () =>{
    listar();
    let bandera = false;
    let promedio3 = listaEstudiantes.map(function(est){
        if ((est.matematicas + est.ingles + est.programacion)/3 >= 3){
            console.log (est.nombre);
            bandera = true;
            return est;
        }
    });
    if(!bandera){
        console.log('No hay estudiantes con nota mayor a 3');
    }
}

const actualizar = (nombre, asignatura, calificacion) =>{
    //Traigo lo que hay en el json
    listar();
    let encontrado = listaEstudiantes.find(buscar => buscar.nombre == nombre)
    if (!encontrado){
        console.log('Estudiante no existe')
    }
    else{
        //Le modfico la clasificación especifica de la asignatura que me pasan
        encontrado[asignatura] = calificacion;
        guardar();
    }
}

const eliminar = (nom) =>{
    listar();
    let nuevo = listaEstudiantes.filter(est => est.nombre != nom);
    if(nuevo.length == listaEstudiantes.length){
        console.log('Ningún estudiante tiene el nombre indicado');
    }
    else{
        listaEstudiantes = nuevo;
        guardar();        
    }
}

module.exports = {
    crear,
    mostrar,
    mostrarest,
    mostrarmat,
    promedio,
    prom3,
    actualizar,
    eliminar
}