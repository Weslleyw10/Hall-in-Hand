const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Hall = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },

    photo: {
        type: String
    },

    cover: {
        type: String
    },

    email: {
        type: String,
        required: [true, 'Email is required.']
    },

    password: {
        type: String,
        default: null
    },

    phone: {
        type: String
    },

    address: {
        city: String,
        state: String,
        zipCode: String,
        number: Number,
        country: String
    },

    geo: {
        tipo: String,
        coordinates: [Number]
    },

    recipientId: {
        type: String
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

Hall.index({ geo: '2dsphere' })

module.exports = mongoose.model('Hall', Hall)