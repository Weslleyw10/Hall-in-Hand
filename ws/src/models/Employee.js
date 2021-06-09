const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employee = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
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
        type: String,
    },

    cover: {
        type: String,
        default: null
    },

    birthDate: {
        type: String,
        default: null
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
            enum: [
                'conta_corrente', 'conta_poupanca', 'conta_corrente_conjunta', 'conta_poupanca_conjunta'
            ],
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
        verifyingDigit: {
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
        default: null
    },
})

module.exports = mongoose.model('Employee', Employee)