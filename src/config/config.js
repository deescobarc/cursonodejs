process.env.PORT = process.env.PORT || 3000;

//process.env.URLDB = 'mongodb://localhost:27017/asignaturas'

if(!process.env.URLDB){

    process.env.URLDB = 'mongodb://localhost:27017/asignaturas'
    
}

