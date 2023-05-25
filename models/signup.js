const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signupMeSchema = new Schema({
    email: String,
    password: String,
    name: String,
    aboutMe: String,
    dob: String,
    city: String,
    education: String,
    website: String,
    status: String,
    isActivated: Boolean,
    activationLink: String,
    avatar: String
});

const signup = mongoose.model('signup', signupMeSchema);
module.exports = signup;