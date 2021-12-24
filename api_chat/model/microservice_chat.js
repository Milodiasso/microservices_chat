const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    user_id: {
        type: [Number],
        required: true,
    },
    name_chat: {
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 255
    },
    type : {
        type: Boolean,
        default: false,
    }

});

module.exports = mongoose.model('channel', msgSchema);