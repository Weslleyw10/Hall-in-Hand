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

    password: {
        type: String,
        required: [true, 'Password is required.']
    },

    cover: {
        type: String,
        default: null,
    },

    birthdate: {
        type: String,
        default: null,
    },

    gender: {
        type: String,
        enum: ['M', 'F']
    },

    document: {
        document: Number,
        documentType: {
            type: String,
            enum: ['cpf', 'cnpj'],
        },
    },

    address: {
        address: String,
        city: String,
        state: String,
        zipcode: String,
        number: Number,
        country: String
    },

    externalId: {
        type: String,
        default: null
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
        default: null
    },
})

module.exports = mongoose.model('Customer', Customer)