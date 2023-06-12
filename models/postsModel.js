const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postsSchema = new Schema({
    userIdSender: String,
    userIdWallReviever: String,
    post: String,
    time: String,
    postId: String,
});

const post = mongoose.model('post', postsSchema);
module.exports = post;