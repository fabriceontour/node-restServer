//=======LE PORT ============================================================
process.env.PORT = process.env.PORT || 3000;

//========= L'environement. Production ou local =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//========= Vencimiento del token
//======  segundos, minutos, horas, dias
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60; 

//========= SEED del token
process.env.SEED = process.env.SEED || 'este-es-clave-secreta';

//========= Base de datos ===================================================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

