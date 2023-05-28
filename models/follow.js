const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const followMeSchema = new Schema({
    senderId: String,
    recieverId: String,
    isAccepted: Boolean,
});

const follow = mongoose.model('follow', followMeSchema);
module.exports = follow;