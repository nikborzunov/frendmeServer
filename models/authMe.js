const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authMeSchema = new Schema({
    userId: Number,
    login: String,
    password: String,
    rememberMe: Boolean,
    isAuth: Boolean,
});

const authMe = mongoose.model('authMe', authMeSchema);
module.exports = authMe;