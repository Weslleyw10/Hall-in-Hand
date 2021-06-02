const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HallAndEmployee = Schema({
    hall: {
        type: mongoose.Types.ObjectId,
        ref: 'Hall',
        required: true
    },

    employee: {
        type: mongoose.Types.ObjectId,
        ref: 'Employee',
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

module.exports = mongoose.model('HallAndEmployee', HallAndEmployee)