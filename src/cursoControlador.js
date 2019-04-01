const fs = require ('fs');
listaCursos = [];

const crear = (curso) => {
    listar();
    let cur = {
        nombre: curso.nombre,
        id: curso.id,
        descripcion: curso.descripcion,
        valor: curso.valor,
        modalidad: curso.modalidad,
        intensidad: curso.intensidad,
        estado: "disponible"
    };
    let duplicado = listaCursos.find(c => c.id == curso.id)
    if (!duplicado){
        listaCursos.push(cur);
        guardar();
        return cur;
        //console.log(listaCursos);
    }
    else{
        console.log('Ya existe un curso con ese nombre');
        return false;
    }  
    mostrar();  
}

const listar = () => {
    //Para que cree la lista en caso de que no exista
    try {
        listaCursos = require('./listadoCursos.json');
    }catch(error){
        listaCursos = [];
    }
}

const guardar = () =>{
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('src/listadoCursos.json', datos, (err)=>{
        if (err) trow (err);
        console.log('Archivo creado o actualizado con éxito');
    })
}

const mostrar = () =>{
    listar();
    console.log('Cursos')
    listaCursos.forEach(curso => {
        console.log (curso.nombre+'y su id '+ curso.id);
    });
}

module.exports = {
    crear
}