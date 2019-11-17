const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

//Je dois importer le schema de usuario et producto pour pouvoir avoir acces
const Usuario = require ('../models/usuario');
const Producto = require ('../models/producto');


app.put('/upload/:tipo/:id', (req, res) => {
    let id = req.params.id;
    let tipo = req.params.tipo;
    //Validation du tipo qui doit etre producto ou usuario
    tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: true,
            err: {
                message: "Le type doit etre un des suivants: " + tiposValidos.join(', ')
            } 
        })
    }

    // Cela verifie que un file fut selectionne. Qu'il y a un fichier à monter
    if (!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ninguno archivo selectionnado'
            }
        })
    }

    //Dans le Postman, le fichier sera mis la.
    let archivo = req.files.archivo;

    //Cela recupere l'extension du fichier
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Les extensions acceptees sont mises dans un array
    let extensionesValidas = ['png', 'gif', 'jpg', 'jpeg'];

    //Cette commande cherche si extension est un element de l'array extensionesValidas
    //  Et retourne seulement l'index de la position. Si inferieur a 0, pas trouve
    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: true,
            err: {
                message: 'Le fichier doit etre une image. De type: ' + extensionesValidas.join(', ')
            }
        })
    }

    let nombreArchivo = `${id}-${new Date().getTime()}.${extension}`;
    // Les validation sont OK. Et le nom de la nouvelle image est cree
    // Actualisation de l'image en base de donnees et dans le repertoire
    actualizarImagen (id, res, nombreArchivo, archivo, tipo)
    
})


function actualizarImagen (id, res, nombreArchivo, archivo, tipo){
    let Tabla;
    if (tipo === 'usuarios'){
        Tabla = Usuario
    }else{
        Tabla = Producto
    };
    
    Tabla.findById(id, (err, enregDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })        
        }

        if (!enregDB) {
            return res.status(400).json({
                ok:false,
                err: {
                    message : `EL ID del ${tipo} no encontrado`
                }
            })        
        }

        archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Problema subir la imagen'
                    }
                })
            }
    
            let nombreImagenEx = enregDB.img;

            enregDB.img = nombreArchivo;

            enregDB.save( (err, enregGuardado) => {
                if (err) {
                    borrarArchivo (nombreArchivo, 'usuarios')
                    return res.status(500).json({
                        ok:false,
                        err: {
                            message: 'Probleme pour sauvegarder le nom de la nouvelle image dans la base'
                        }
                    })
                }


                borrarArchivo (nombreImagenEx, tipo)
                res.json({
                    ok:true,
                    enreg: enregGuardado,
                    img: nombreArchivo
                })
            })
        })
    })
}


function borrarArchivo (nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
