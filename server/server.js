// Recupere le port dans le fichier cree
require('./config/config');
//Recuperation des paquets necessaires. Le npm install a ete fait
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// Le app.use est une sorte de middleware. Il s'execute a chaque que une petition est faite
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//*************************************************************************** 
//La petition get est pour lire des donnees. Meme si pas obligatoire
app.get('/usuario', function (req, res) {
  res.json('get usuario')
})
 
//post est pour creer un enregistrement
app.post('/usuario', function (req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    }else{
        res.json({
            personna: body
        })
    }
    
})

//put est pour actualiser un enregistrement. Il y a un parametre
app.put('/usuario/:id', function (req, res) {
    //Recuperation du parametre
    let id = req.params.id;
    res.json({
        id
    })
})

//post est pour eliminer un enregistrement
app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
})

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado', process.env.PORT);
})