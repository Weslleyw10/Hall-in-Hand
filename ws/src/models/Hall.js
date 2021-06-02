const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Hall = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    photo: String,
    cover: String,
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        default: null
    },
    phone: String,
    address: {
        city: String,
        state: String,
        zipCode: String,
        number: Number,
        country: String
    },
    geo: {
        type: String,
        coordinates: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
})

Hall.index({ geo: '2dsphere' })

module.exports = mongoose.model('Hall', Hall)