const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dialogsSchema = new Schema({
    chatId: String
});

const dialog = mongoose.model('dialog', dialogsSchema);
module.exports = dialog;