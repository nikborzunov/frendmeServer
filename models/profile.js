const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({

    aboutMe: String,
    fullName: String,
    userId: Number,
    photos: {
        small: String,
        large: String
    }
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;