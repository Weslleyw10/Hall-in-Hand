const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Media = new Schema({
    refId: {
        type: Schema.Types.ObjectId,
        refPath: 'model'
    },

    model: {
        type: String,
        required: true,
        enum: ['Service', 'Hall']
    },

    path:{
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

module.exports = mongoose.model('Media', Media)