//Recuperation de express. et des librairies necessaires
const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();

//Definition de cette route pour le login
app.post('/login', (req, res) => {
    //Recuperation du body pour recuper le email et password
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        // Cette erreur est un probleme de serveur, de base de données
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //L'utilisateur n'a pas ete trouve
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario non encontrado'
                }
            });
        }

        // Verif du password
        if (!bcrypt.compareSync (body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Contraseña non correcta'
                }
            }); 
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })


});








module.exports = app;