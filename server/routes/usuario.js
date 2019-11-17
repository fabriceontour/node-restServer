//Recuperation de express.
const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken, verificaAdmin_role} = require('../middlewares/autenticacion');

//*************************************************************************** 
//La petition get est pour lire des donnees. Meme si pas obligatoire
app.get('/usuario', verificaToken, function (req, res) {
    // Cela permet de decider le nombre d'enreg que on retourne et a partir du quel
    // Ces deux paramètres ne sont pas obligatoire. Il se mettent dans l'url
    // ..../usuario?desde=4&limite=7       C'est query qui les recupère
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 2;
    limite = Number(limite);

    //La ligne ci dessous permet de selectionner les champs que on prend
    //Usuario.find({}, 'nombre email')  => Cela selectionne les colonnes
    // Mettre l'objet estado: true  => Mette cet objet remplace le where
    Usuario.find({estado: true})
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                
                Usuario.countDocuments({estado: true}, (err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        })
                    }

                    res.json({
                        ok: true,
                        cuantos: conteo,
                        usuarios
                    });
                })
            })
})
   
  //post est pour creer un enregistrement
app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });
      
})
  
  //put est pour actualiser un enregistrement. Il y a un parametre
app.put('/usuario/:id', [verificaToken, verificaAdmin_role], function (req, res) {
      //Recuperation du parametre
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

      })
})
  
  //post est pour eliminer un enregistrement
app.delete('/usuario/:id', [verificaToken, verificaAdmin_role], function (req, res) {
    let id = req.params.id;
    //Cela elimine physiquement un document ce qui correspond a un enregistrement
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    // Cette ligne n'efface pas physiquement un objet, mais met l'etat à true
    let cambioEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambioEstado, {new: true}, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            }) 
        }
        
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
        
    })
})



module.exports = app;