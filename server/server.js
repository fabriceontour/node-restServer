// Recupere le port dans le fichier cree
require('./config/config');
//Recuperation des paquets necessaires. Le npm install a ete fait
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Le app.use est une sorte de middleware. Il s'execute a chaque que une petition est faite
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use( require('./routes/usuario'));

//Connection à la base de données. Mais attention, il faut peut etre rajouter une option
mongoose.connect(process.env.URLDB, 
    {useNewUrlParser: true, useCreateIndex: true},
    (err, res) => {
    if (err)  throw err;

    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado', process.env.PORT);
})