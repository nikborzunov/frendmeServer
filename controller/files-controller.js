// const UserService = require('../service/user-service');
const SignUpModel = require('../models/signup');
const tokenModel = require('../models/token-model');
const photoSchema = require('../models/photos');

const Uuid = require('uuid');

const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
app.use(cookieParser());

class FilesController {

    async allowedExtensions(req, res, next) {

        try {
            const extensions = process.env.allowedExtensions.split(',');
            const maxSizeOfFileLoad = process.env.maxSizeOfFileLoad;

            return res.json({ extensions, maxSizeOfFileLoad });
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Upload avatar error' })
        }
    }


    async avatarUploading(req, res, next) {
        try {
            const file = req.files.file;
            const cookiesArray = req.cookies;
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await tokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user;
            const user = await SignUpModel.findOne(userId)
            const avatarName = Uuid.v4() + ".jpg"

            file.mv(process.env.staticPath + '\\' + avatarName)
            let avaUrl = `${process.env.API_URL}/${avatarName}`
            user.avatar = avaUrl;
            await user.save();

            const addPhotoToGeneralDb = await photoSchema.create({
                userId: userId.valueOf(),
                avatarPhoto: avaUrl,
            })

            return res.json({ message: "Avatar was uploaded" });

        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Upload avatar error' })
        }
    }

}

module.exports = new FilesController();