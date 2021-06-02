const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customer = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    cover: {
        type: String,
    },
    birthDate: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    document: {
        type: String,
        enum: ['cpf', 'cnpj'],
        document: Number
    },
    address: {
        city: String,
        state: String,
        zipCode: String,
        number: Number,
        country: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
})

module.exports = mongoose.model('Customer', Customer)