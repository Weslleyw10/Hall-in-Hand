const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmployeeAndService = Schema({
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

module.exports = mongoose.model('EmployeeAndService', EmployeeAndService)