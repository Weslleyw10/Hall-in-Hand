const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Scheduling = Schema({
    hallId: {
        type: mongoose.Types.ObjectId,
        ref: 'Hall',
        required: true
    },

    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    employeeId: {
        type: mongoose.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    serviceId: {
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

    status: {
        type: String,
        enum: ['confirmed', 'canceled'],
        default: 'confirmed'
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