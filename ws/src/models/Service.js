const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Service = new Schema({
    hall: {
        type: mongoose.Types.ObjectId,
        ref: 'Hall',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: { // Duração em minutos
        type: Date,
        required: true
    },
    commission: { // % de comissão sobre o preço
        type: Number,
        required: true
    },
    recurrence: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
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

module.exports = mongoose.model('Service', Service)