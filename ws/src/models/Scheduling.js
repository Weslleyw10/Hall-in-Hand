const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Scheduling = Schema({
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

    employee: {
        type: mongoose.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    service: {
        type: mongoose.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    dateScheduling: {
        type: Date,
        required: true
    },

    
    value: {
        type: Number,
        required: true
    },

    commission: {
        type: Number,
        required: true
    },

    transactionId: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
    },

})

module.exports = mongoose.model('Scheduling', Scheduling)