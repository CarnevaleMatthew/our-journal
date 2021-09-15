const mongoose = require('mongoose');

const connectToDB = (url) => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = connectToDB;