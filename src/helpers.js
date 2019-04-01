const hbs = require('hbs');

hbs.registerHelper('obtenerPromedio', (nota1,nota2,nota3) =>{
    return (nota1+nota2+nota3)/3;
});

hbs.registerHelper('listar', () => {
    listaEstudiantes = require('./listado.json');
    let texto = "<table class='table table-striped table-hover'>" + 
                "<thead class='thead-dark'>" +
                "<th>Nombre</th>" +
                "<th>Matamaticas</th>" +
                "<th>Ingles</th>" +
                "<th>Programacion</th>" +     
                "</thead>" +
                "<tbody>";

    listaEstudiantes.forEach(estudiante => {
        texto = texto +
                '<tr>' + 
                '<td>'+ estudiante.nombre + '</td>' +
                '<td>' + estudiante.matematicas + '</td>'+
                '<td>' + estudiante.ingles + '</td>' +
                '<td>' + estudiante.programacion + '</td></tr>' 
        });
    texto = texto + '</tbody></table>';    
    return texto;
});

hbs.registerHelper('listar2', () => {
    listaEstudiantes = require('./listado.json');
    let texto = "<div class='accordion' id='accordionExample'>"
    i = 1;
    listaEstudiantes.forEach(estudiante => {
        texto = texto +
                `<div class="card">
                <div class="card-header" id="heading${i}">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                        ${estudiante.nombre}
                    </button>
                </h2>
                </div>
            
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                    Tiene una nota de matemáticas de ${estudiante.matematicas} <br>
                    Tiene una nota de programación de ${estudiante.programacion} <br>
                    Tiene una nota de ingles de ${estudiante.ingles} <br>
                </div>
                </div>
            </div>`; 
        i = i+1;
        });
    texto = texto + '</div>';    
    return texto;
});

hbs.registerHelper('verCursos', () => {
    listaCursos = require('./listadoCursos.json');
    let texto = "<div class='accordion' id='accordionExample'>"
    i = 1;
    listaCursos.forEach(curso => {
        if(curso.estado == 'disponible'){
            texto = texto +
            `<div class="card">
                <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i} style="text-align: center"">
                            <h4>${curso.nombre}</h4>  
                            ${curso.descripcion} <br>
                            <b>Valor: $</b> ${curso.valor}
                        </button>
                    </h2>
                </div>                
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        <b>Descripción: </b> ${curso.descripcion} <br>
                        <b>Modalidad: </b> ${curso.modalidad} <br>
                        <b>Intensidad Horaria: </b> ${curso.intesidad} <br>
                    </div>
                </div>
            </div>`; 
            i = i+1; 
        }       
        });
    texto = texto + '</div>';
    if(i==1){
        texto =   
        `   <h4>
                No hay cursos disponibles
            </h4>
        `          
    }    
    return texto;
});

hbs.registerHelper('listarCursos', () => {
    listaCursos = require('./listadoCursos.json');
    let texto = ""
    i = 1;
    listaCursos.forEach(curso => {
        if(curso.estado == 'disponible'){
            texto = texto +
            `<option value=${curso.id}>${curso.id} - ${curso.nombre}</option>`;
            i = i+1; 
        }       
        });
    if(i==1){
        texto =   
        `<option value=null>No hay cursos disponibles</option>`;   
    }    
    return texto;
});

hbs.registerHelper('verInscripciones', () => {
    listaCursos = require('./listadoCursos.json');
    listaInscripciones = require('./listadoInscripcion.json');
    listaUsuarios = require('./listadoUsuarios.json');
    let texto = "<div class='accordion' id='accordionExample'>"
    i = 1;
    listaCursos.forEach(curso => {
        if(curso.estado == 'disponible'){
            texto = texto +
            `<div class="card">
                <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <input type="text" value="prueba" name="prueba"  style="visibility:hidden">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i} style="text-align: center"">
                            <h4>${curso.id} - ${curso.nombre}</h4>  
                            <b>Número de Aspirantes: </b> ${countInscritosCurso(curso.id,listaInscripciones)} <br>
                            <button class="btn btn-success" type="submit">Disponible</button>
                        </button>   
                    </h2>                    
                </div>                
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        ${inscritosCurso(curso.id,listaInscripciones)}
                    </div>
                </div>
            </div>`; 
            i = i+1; 
        }else{
            `<div class="card">
                <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i} style="text-align: center"">
                            <h4>${curso.nombre}</h4>  
                            <b>Número de Aspirantes: $</b> ${countInscritosCurso(curso.id,listaInscripciones)}<br>
                            <a class="btn btn-danger" href="#" role="button">Cerrado</a>
                        </button>
                    </h2>
                </div>                
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        ${inscritosCurso(curso.id,listaInscripciones)}
                    </div>
                </div>
            </div>`; 
            i = i+1; 
        }
        });
    texto = texto + '</div>';
    if(i==1){
        texto =   
        `   <h4>
                No hay cursos disponibles
            </h4>
        `          
    }    
    return texto;
});

const countInscritosCurso = (id,listaInscripciones) => {
    lista = listaInscripciones.filter(i => i.idCurso == id);
    if (lista){
        return Object.keys(lista).length;
    }else{
        return 0;
    }
}

const inscritosCurso = (id,listaInscripciones) => {
    lista = listaInscripciones.filter(i => i.idCurso == id);
    listaUsuarios = require('./listadoUsuarios.json');
    let texto = "";
    if (lista){
        lista.forEach(i => {
            listaUsuarios.forEach(u =>{
                if(i.idUser == u.id){
                    texto = texto +
                    `<b>Nombre: </b>` + u.nombre+ `<b> ID: </b>` + u.id + `<br>`;
                } 
            });
        })
        return texto;
    }else{
        return "No hay Inscritos";
    }
}


hbs.registerHelper('listarInscritos', () => {
    listaUsers = require('./listadoCursos.json');
    let texto = ""
    i = 1;
    listaCursos.forEach(curso => {
        if(curso.estado == 'disponible'){
            texto = texto +
            `<option value=${curso.id}>${curso.id} - ${curso.nombre}</option>`;
            i = i+1; 
        }       
        });
    if(i==1){
        texto =   
        `<option value=null>No hay cursos disponibles</option>`;   
    }    
    return texto;
});