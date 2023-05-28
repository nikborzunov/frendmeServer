const UserService = require('../service/user-service');
const TokenModel = require('../models/token-model');
const SignUpModel = require('../models/signup');
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
app.use(cookieParser());

class UserController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            const regValidationError = errors.array();

            let result = regValidationError.map(item => JSON.stringify(item));

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error while validation ' + result))
            }
            const { email, password } = req.body;
            const userData = await UserService.registration(email, password);

            res.cookie('tokens', userData, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {

        try {
            const { login, password } = req.body;
            const userData = await UserService.login(login, password);
            res.cookie('tokens', userData, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json('LOGGED IN');


        } catch (e) {
            next(e);

        }
    }

    async getAuth(req, res, next) {

        try {
            const userData = await UserService.getAuth(req);
            return res.json(userData);
        } catch (e) {
            next(e);
        }

    }


    async getProfile(req, res, next) {
        try {
            const userId = req.params.id;
            let id = new mongoose.Types.ObjectId(userId);
            const userData = await UserService.getProfile(id);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }


    async getStatus(req, res, next) {
        try {
            const userId = req.params.id;
            let id = new mongoose.Types.ObjectId(userId);
            const userData = await UserService.getStatus(id);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async updateStatus(req, res, next) {

        try {
            const cookiesArray = req.cookies;
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await TokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user;
            const user = await SignUpModel.findOne(userId)
            
            user.status = req.body.status;
            await user.save();

            return res.json({ message: "Status is updated" });

        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Upload avatar error' })
        }
    }

    async updateProfileInfo(req, res, next) {

        try {
            const cookiesArray = req.cookies;
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await TokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user;
            const user = await SignUpModel.findOne(userId)

            if(req.body.name){
                user.name = req.body.name;
            }
            if(req.body.dob){
                user.dob = req.body.dob;
            }
            if(req.body.city){
                user.city = req.body.city;
            }
            if(req.body.education){
                user.education = req.body.education;
            }
            if(req.body.website){
                user.website = req.body.website;
            }
            if(req.body.aboutMe){
                user.aboutMe = req.body.aboutMe;
            }

            await user.save();

            return res.json({ message: "Profile Info is updated" });

        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Upload avatar error' })
        }
    }
    


    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.tokens.refreshToken

            const token = await UserService.logout(refreshToken);
            res.clearCookie('tokens');
            return res.json(token);

        } catch (e) {
            next(e);

        }
    }
    async activate(req, res, next) {

        try {
            const activationLink = req.params.link;
            await UserService.active(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.tokens.refreshToken
            const userData = await UserService.refresh(refreshToken);
            res.cookie('tokens', userData, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json('REFRESHED');

        } catch (e) {
            next(e);

        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers(req);
            return res.json(users);

        } catch (e) {
            next(e);

        }
    }

}

module.exports = new UserController();