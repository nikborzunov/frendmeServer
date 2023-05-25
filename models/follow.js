const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const followMeSchema = new Schema({
    userId: Number,
    friendId: Number,
    isAccepted: Boolean,
});

const follow = mongoose.model('follow', followMeSchema);
module.exports = follow;