const SignUpModel = require('../models/signup');
const TokenModel = require('../models/token-model');
const photoModel = require('../models/photos');
const FollowModel = require('../models/follow');
const dialogModel = require('./../models/messengerModels/dialogs')
const chatAccessModel = require('../models/messengerModels/chatAccess')
const chatPostModel = require('../models/messengerModels/chatPost')



const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDtoOrig = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const { ObjectId } = require('mongodb');
const { now } = require('mongoose');


class MessengerService {

    async getDialogs(req, recieverId) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user;
        const userDataById = await SignUpModel.findOne(userId)
        let senderid = JSON.stringify(userDataById._id);
        senderid = senderid.split('\"')[1];
        const senderInDB = await chatAccessModel.find({ senderid })



        const recieverInDB = await chatAccessModel.find({ userId: recieverId })


        let chatId = '';
        let listOfDialogs = [];

        //if no chats with current User
        if (senderInDB.length === 0) {
            chatId = uuid.v4();
            await dialogModel.create({ chatId })
            await chatAccessModel.create({ chatId, userId: senderid })
            await chatAccessModel.create({ chatId, userId: recieverId })

            const currentReciever = await SignUpModel.findOne({ recieverId })
            listOfDialogs.push(currentReciever);

            return { listOfDialogs, currentChatId: recieverId };
        } else {
            //if current User has a chats

            if (recieverInDB.length === 0) {
                //if current User has NOT a chats with current RECIEVER

                chatId = uuid.v4();
                await dialogModel.create({ chatId })
                await chatAccessModel.create({ chatId, userId: senderid })
                await chatAccessModel.create({ chatId, userId: recieverId })

                const currentReciever = await SignUpModel.findOne({ recieverId })
                listOfDialogs.push(currentReciever);

            }

            const listOfChats = senderInDB
            const listOfChatId = [];

            listOfChats.map((i) => {
                listOfChatId.push(i.chatId)
            }
            )


            let listOfChatMembers = await chatAccessModel.find({
                'chatId': {
                    $in: listOfChatId
                }
            });

            let listOfChatMembersIds = [];

            listOfChatMembers.map((i) => {
                if (!listOfChatMembersIds.includes(i.userId)) {
                    listOfChatMembersIds.push(i.userId)
                }
            }
            )


            let listOfChatMembersInfo = await SignUpModel.find({
                '_id': {
                    $in: listOfChatMembersIds
                }
            });

            return { listOfDialogs: listOfChatMembersInfo, currentChatId: recieverId }

        }
    }

    async getDialogsAtStart(req) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user;
        const userDataById = await SignUpModel.findOne(userId)
        let senderid = JSON.stringify(userDataById._id);
        senderid = senderid.split('\"')[1];
        const senderInDB = await chatAccessModel.find({ senderid })

        let chatId = '';
        let listOfDialogs = [];

        //if no chats with current User
        if (senderInDB.length === 0) {
            return { listOfDialogs };
        } else {
            //if current User has a chats

            const listOfChats = senderInDB
            const listOfChatId = [];

            listOfChats.map((i) => {
                listOfChatId.push(i.chatId)
            }
            )


            let listOfChatMembers = await chatAccessModel.find({
                'chatId': {
                    $in: listOfChatId
                }
            });

            let listOfChatMembersIds = [];

            listOfChatMembers.map((i) => {
                if (!listOfChatMembersIds.includes(i.userId)) {
                    listOfChatMembersIds.push(i.userId)
                }
            }
            )


            let listOfChatMembersInfo = await SignUpModel.find({
                '_id': {
                    $in: listOfChatMembersIds
                }
            });

            return { listOfDialogs: listOfChatMembersInfo }

        }
    }

    async getChatMessages(req, recieverId) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user;
        const userDataById = await SignUpModel.findOne(userId)
        const recieverDataById = await SignUpModel.findOne({_id: recieverId})

        let senderid = JSON.stringify(userDataById._id);
        senderid = senderid.split('\"')[1];

        const recieverInDB = await chatAccessModel.find({ userId: recieverId })
        const senderInDB = await chatAccessModel.find({ userId: senderid })

        let currentChatId = '';
        let listOfDialogs = [];

        let chatMessageOfSender = []
        let chatMessageOfReciever = []


        //if no chats with current User
        if (senderInDB.length === 0 || recieverInDB.length === 0) {

            return { messagesOfCurrentChat: [] };
        } else {

            if ( recieverInDB.length === 0 ) {
                return { messagesOfCurrentChat: [] };
            }
                const listOfChatsSender = senderInDB
                const listOfChatsRecieveer = recieverInDB

                listOfChatsSender.map((i) => {

                    listOfChatsRecieveer.map((n) => {
                        if (i.chatId === n.chatId) {
                            currentChatId = i.chatId;
                        }
                    }
                    )
                }
                )

                const messagesOfCurrentChat = await chatPostModel.find({ chatId: currentChatId })

                return { messagesOfCurrentChat , users: {sender: userDataById, reciever: recieverDataById}}

        }
    }

    async postChatMessages(req, recieverId, text) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user;
        const userDataById = await SignUpModel.findOne(userId)
        let senderid = JSON.stringify(userDataById._id);
        senderid = senderid.split('\"')[1];

        const senderInDB = await chatAccessModel.find({ userId: senderid })

        const listOfChats = senderInDB
        const listOfChatId = [];

        var today = new Date();
        var time = today.toLocaleString();

        listOfChats.map((i) => {
            listOfChatId.push(i.chatId)
        }
        )

        let listOfChatMembers = await chatAccessModel.find({
            'chatId': {
                $in: listOfChatId
            }
        });

        let listOfChatMembersIds = [];
        let myChatId = ''

        listOfChatMembers.map((i) => {
            if (!listOfChatMembersIds.includes(i.userId)) {
                myChatId = i.chatId;
            }
        }
        )

        const chatMessageInfo = await chatPostModel.create({ chatId: myChatId, userId: senderid, message: text, messageTime: time, })

        return { chatMessageInfo, currentChatId: recieverId }

    }
}

module.exports = new MessengerService();