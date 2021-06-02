const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HallAndCustomer = Schema({
    hall: {
        type: mongoose.Types.ObjectId,
        ref: 'Hall',
        required: true
    },

    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
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

module.exports = mongoose.model('HallAndCustomer', HallAndCustomer)