process.env.PORT = process.env.PORT || 3000;

//process.env.URLDB = 'mongodb://localhost:27017/asignaturas'

if(!process.env.URLDB){

    process.env.URLDB = 'mongodb://localhost:27017/asignaturas'
    
}
process.env.SENDGRID_API_KEY = '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'
