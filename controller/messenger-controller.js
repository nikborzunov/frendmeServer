const MessengerService = require('../service/messenger-service');
const TokenModel = require('../models/token-model');
const SignUpModel = require('../models/signup');
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
app.use(cookieParser());

class MessengerController {

    async getDialogs(req, res, next) {
        try {

            let recieverId = req.params.id;

            let dialogsData = {}

            if (recieverId === '1') {
                dialogsData = await MessengerService.getDialogsAtStart(req);
            } else {
                dialogsData = await MessengerService.getDialogs(req, recieverId);
            }


            return res.json({ dialogsData });
        } catch (e) {
            next(e);
        }
    }

    async getChatMessages(req, res, next) {
        try {

            let recieverId = req.params.id;

            const dialogsData = await MessengerService.getChatMessages(req, recieverId);


            return res.json({ dialogsData });
        } catch (e) {
            next(e);
        }
    }

    async postMessage(req, res, next) {
        try {

            let recieverId = req.params.id;
            let text = req.body.text;

            const chatsData = await MessengerService.postChatMessages(req, recieverId, text);

            return res.json({ chatsData });

        } catch (e) {
            next(e);
        }
    }


}

module.exports = new MessengerController();