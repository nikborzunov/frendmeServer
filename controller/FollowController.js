const FollowModel = require('../models/follow');
const TokenModel = require('../models/token-model');

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
app.use(cookieParser());

class FollowController {

    async getFollow(req, res, next) {

        try {

            const cookiesArray = req.cookies;
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await TokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user.valueOf();
            const recieverId = req.params.id
            const allMyFollows = await FollowModel.find({ userId })

            console.log(allMyFollows)

            return res.json(allMyFollows);

        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Follow error' })
        }
    }

    async postFollow(req, res, next) {

        try {
            const cookiesArray = req.cookies;
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await TokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user.valueOf();
            const recieverId = req.params.id
            const isSenderInDb = await FollowModel.findOne({ senderId: userId, recieverId: recieverId })

            console.log(userId)
            console.log(isSenderInDb)

            console.log('\n')


            const isRecieverInDb = await FollowModel.findOne({ senderId: recieverId, recieverId: userId })

            
            console.log(recieverId)
            console.log(isRecieverInDb)

            

            if (isSenderInDb) {
                return res.json({ message: "This User is already followed" });
            } else {

                if (!isSenderInDb && isRecieverInDb) {

                    isRecieverInDb.isAccepted = true;
                    await isRecieverInDb.save();

                    const newFollow = await FollowModel.create({
                        senderId: userId,
                        recieverId: recieverId,
                        isAccepted: true,
                    })

                    return res.json({ message: "You are friends now!" });
                }

                const newFollow = await FollowModel.create({
                    senderId: userId,
                    recieverId: recieverId,
                    isAccepted: false,
                })
            }

            return res.json({ message: "Followed successfuly" });

        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Follow error' })
        }
    }

    async deleteFollow(req, res, next) {
        try {
            const cookiesArray = req.cookies;
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await TokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user.valueOf();
            const recieverId = req.params.id
            const isSenderInDb = await FollowModel.findOne({ senderId: userId, recieverId: recieverId })

            if (isSenderInDb) {
                const followData = await FollowModel.deleteOne({ senderId: userId, recieverId: recieverId });
            } else {
                return res.json({ message: "This User is already Unfollowed" });
            }

            return res.json({ message: "Unfollowed successfuly" });

        } catch (e) {
            console.log(e)

        }

    }
}

module.exports = new FollowController();