const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myuser'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: 'general'
    }
});

module.exports = mongoose.model('myNote', noteSchema);