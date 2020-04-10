const express = require('express');
const app = express();
const Categoria = require('../models/categoria');


const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')


// Mostrar todas las categorías
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}).sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        })

});

// Mostrar una categoría por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'El id no es valido'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    }).populate('usuario', 'nombre email');

});

// Crear nueva categoría
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

// Crear nueva categoría
app.put('/categoria/:id', verificaToken, (req, res) => {
    //Actualizar el nombre de la categoría
    let id = req.params.id;
    let body = req.body;

    let nomCategoria = {
        nombre: body.nombre
    }

    Categoria.findByIdAndUpdate(id, nomCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// Borrar una categoría
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo puede hacerlo un administrador
    // Tiene que eliminarla no cambiar el estado

    let id = req.params.id;

    // Borrar usuario completo
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    });
});

module.exports = app;