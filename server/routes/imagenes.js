const express = require('express');
const fs = require('fs');

//Ce paquet sert pour faire un path absolu, c'est avec le nom du serveur
const path = require('path');

let app = express();


app.get ('/imagen/:tipo/:img', (req, res) => {
    let tipo = req.params.tipo;
    let img  = req.params.img;

    let imagenPath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    //Cette commande renvoie un boolean. true si le fichier existe.
    //La deuxieme renvoie le fichier dans res
    if (fs.existsSync(imagenPath)) {
        res.sendFile(imagenPath);
    }
})





module.exports = app;