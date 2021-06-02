const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employee = new Schema({
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
    cover: {
        type: String,
    },
    birthDate: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    bankAccount: {
        owner: {
            type: String,
            required: true
        },
        document: {
            type: String,
            required: true
        },
        bank: {
            type: String,
            required: true
        },
        accountType: {
            type: String,
            required: true
        },
        bankAgency: {
            type: String,
            required: true
        },
        numberAccount: {
            type: String,
            required: true
        },
        digit: {
            type: Number,
            required: true
        },
    },
    recipientId: {
        type: String,
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

module.exports = mongoose.model('Employee', Employee)