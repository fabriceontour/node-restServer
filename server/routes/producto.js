const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


app.get('/producto', verificaToken, (req, res) => {
    Producto.find({})
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})

//Le paramètre est obligatoire. Si il n'y a pas, cela met que la route n'est pas trouvé
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID del producto non encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
})


// Pour faire flexibles dans la base de donnee
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    // C'est une expression reguliere de Javascript pour selectionner les enregs dont
    // le champ a en partie le termino. Cela ne distingue pas minuscule majuscule
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec ( (err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
})



//Creer une produit
//Il faut creer un objet producto pour valoriser les champs
//Le save fait la validation des champs automatiquement avec le model
//Par exemple pour categoria: le id valorise doit etre un id de la collection categoria
//    Sinon, cela sort une erreur de Cast Object. Teste
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save ( (err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        })
    })
})

app.put('/producto/:id', verificaToken, (req, res) => {
    // Cette solution ci dessus fonctionne
    //  On peut aussi faire un findById(id) qui rendra l'enregistrement si trouve
    //   Apres, on peut modifier les membres de l'objet directement. productoDB.precioUni = body.precioUni
    //   Et ensuite, faire un productoDB.save()
    let id = req.params.id;
    let body = req.body;

    let modifProducto = {
        precioUni: body.precioUni,
        descripcion: body.descripcion
    }

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators:true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID del producto non encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })


})

// Ceci fait le delete physiquement de l'enregistrement dans la table
// Dans certains, on modifie juste un etat de l'enreg a false. Il reste mais plus valide
// Par contre, les lectures et update doivent avoir la condition etat a true
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID del producto non encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

module.exports = app;