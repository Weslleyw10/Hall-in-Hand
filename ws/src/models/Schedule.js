const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Schedule = Schema({
    hall: {
        type: mongoose.Types.ObjectId,
        ref: 'Hall',
        required: true
    },
    
    specialties: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Service',
            required: true
        }
    ],

    employees: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Employee',
            required: true
        }
    ],

    days: {
        type: [Number],
        required: true
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
    },
})

module.exports = mongoose.model('Schedule', Schedule)