//Recuperation de express.
const express = require('express');
let Categoria = require('../models/categoria');
let app = express();

let {verificaToken, verificaAdmin_role} = require('../middlewares/autenticacion');

//Recuperer toutes les categories
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })
        })
});

//Recuperer une categoria par id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id non encontrado'
                }
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
});

//Crea una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    //La middleware verif token recupere les donnees de usuario. Et cree une nouvelle donnee dans objet req
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save( (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
});

//Actualizar una nueva categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    
    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

//Supprimer una nueva categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no ha sido encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

module.exports = app;