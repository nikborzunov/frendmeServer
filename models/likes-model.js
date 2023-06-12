const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likesMeSchema = new Schema({
    likerId: String,
    postId: String,
});

const like = mongoose.model('like', likesMeSchema);
module.exports = like;