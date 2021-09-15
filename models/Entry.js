const mongoose = require('mongoose');
const {Schema} = mongoose;

const EntrySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    CreatedOn: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Entry', EntrySchema);