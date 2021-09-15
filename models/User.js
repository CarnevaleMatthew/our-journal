const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
    },
    createdOn: {
        type: Date,
        dafault: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema);