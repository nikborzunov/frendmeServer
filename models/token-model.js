const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenMeSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'signup'},
    refreshToken: {type: String, required: true},
});

const Token = mongoose.model('Token', TokenMeSchema);
module.exports = Token;