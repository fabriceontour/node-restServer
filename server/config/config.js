//=======LE PORT ============================================================
process.env.PORT = process.env.PORT || 3000;

//========= L'environement. Production ou local =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//========= Base de datos ===================================================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://fabriceontour:Z1IWyyIZfioyhFAD@cluster0-zsjhw.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

