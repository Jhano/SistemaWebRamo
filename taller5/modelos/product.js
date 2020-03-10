'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema({
    name: String,
    picture: String,
    price: { type: Number },
    category: { type: String, enum: ['computadores', 'telefonos'] },
    description: String

})

module.exports = mongoose.model('Product', ProductSchema)