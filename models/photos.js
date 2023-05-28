const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema({
    userId: String,
    avatarPhoto: String,
});

const photos = mongoose.model('photos', photoSchema);
module.exports = photos;