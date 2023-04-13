const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/mynotebook';

const connetToMongo = () => {
    mongoose.connect(connectionString, () => {
        console.log('connected to mongo');
    });
}

module.exports = connetToMongo;