'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Product = require('./modelos/product')
const _ = require("underscore");
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/hola', (req, res) => {

    res.status(200).send({ message: "Bienvenido" })

})

app.get('/api/product', (req, res) => {

    Product.find()
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Product.count((err, countProduct) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: countProduct
                })
            });


        })

})

app.get('/api/product/:productId', (req, res) => {

    let ProductId = req.params.productId
    Product.findById(ProductId, (err, product) => {
        if (err) return res.status(500).send({ message: 'error al realizar peticion' })
        if (!product) return res.status(404).send({ message: 'Erro el producto no existe' })

        res.status(200).send({ product })

    })


})

app.post('/api/product', (req, res) => {

    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.picture
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description

    product.save((err, productStore) => {

        if (err) res.status(500).send(`Error base de datos> ${err}`)

        res.status(200).send({ product: productStore })

    })



})

//peticion put para actualizar los registrso de usuario
app.put("/api/product/:productId", (req, res) => {

    let ProductId = req.params.productId;
    let body = _.pick(req.body, ["name", "picture", "price", "category", "description"]); // esto en caso de que hubiera algo que no quiero actulizar, solo selecciono lo que quiero



    Product.findByIdAndUpdate(ProductId, body, (err, product) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                message: "El id ingresado no existe"
            })
        }

        res.json({
            ok: true,
            product,
            message: "Producto Actualizado"
        })
    })



})

//peticion de delete;
app.delete("/api/product/:productId", (req, res) => {

    let ProductId = req.params.productId;


    //============================================
    //Borra el usuario fisicamente
    //============================================
    Product.findByIdAndRemove(ProductId, (err, productBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                message: "El id ingresado no existe"
            })
        }

        if (!productBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Producto no encontrado"
                }
            })
        }
        res.json({
            ok: true,
            product: productBorrado,
            message: "Producto Borrado"
        });

    })

})


mongoose.connect('mongodb+srv://Jano:fARyKmwqPU32cL6a@cluster0-rzqhl.mongodb.net/test?retryWrites=true&w=majority', (err, res) => {

    if (err) throw err
    console.log('Conexion establecida')

    app.listen(3000, () => {

        console.log("Esta corriendo en puerto 3000")
    })

})