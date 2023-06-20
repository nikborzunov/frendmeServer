const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatAccesSchema = new Schema({
    chatId: String,
    userId: String
});

const chatAccess = mongoose.model('chatAccess', chatAccesSchema);
module.exports = chatAccess;