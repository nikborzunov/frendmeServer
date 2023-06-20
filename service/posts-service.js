const postsModel = require('../models/postsModel');
const TokenModel = require('../models/token-model');
const photoModel = require('../models/photos');
const SignUpModel = require('../models/signup');
const likesModel = require('../models/likes-model');

const mongoose = require('mongoose');
const uuid = require('uuid');




class PostsService {
    async uploadPost(req, post, wallId) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user.valueOf();
        var today = new Date();
        var time = today.toLocaleString();
        let postId = uuid.v4()


        const postInfo = await postsModel.create({
            userIdSender: userId,
            userIdWallReviever: wallId,
            post: post,
            time: time,
            postId: postId,
        })

        return {
            postInfo,
        }
    }

    async postsDelete(postId) {

        const postInfo = await postsModel.deleteOne({postId})

        return {
            postInfo,
        }
    }

    async getAllPosts(wallId) {
        const posts = await postsModel.find({ userIdWallReviever: wallId });

        const postsWithPhotos = JSON.parse(JSON.stringify(posts))

        let postsMap = await Promise.all(posts.map(async (p, i) => {

            let userIdSender = p.userIdSender;

            const addPhotoToGeneralDb = await photoModel.find({ userIdSender: userIdSender })

            let id = new mongoose.Types.ObjectId(userIdSender);

            const usersNames = await SignUpModel.find({ _id: id })

            addPhotoToGeneralDb.map((t) => {
                t.userId === userIdSender ? postsWithPhotos[i].avatarPhoto = t.avatarPhoto : null
                postsWithPhotos[i].name = usersNames[0].name
            })

            i = i + 1;
        }))

        return postsWithPhotos
    }


    async addLike(postId, req) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const likerId = refreshTokenResult.user;

        const isSomelikesInDB = await likesModel.findOne({ postId });

        if (isSomelikesInDB) {
            const isMylikesInDB = await likesModel.findOne({ likerId: likerId.toString(), postId: postId });

            if (isMylikesInDB) {
                const deleteMylikeFromDB = await likesModel.deleteOne({ likerId: likerId.toString(), postId: postId });
                const isSomelikesInDB = await likesModel.find({ postId });

                return { listOfLikesForThisPost: isSomelikesInDB }
            } else {
                const addMylikeFromDB = await likesModel.create({ likerId: likerId.toString(), postId: postId });
                const isSomelikesInDB = await likesModel.find({ postId });

                return { myLike: addMylikeFromDB, listOfLikesForThisPost: isSomelikesInDB }
            }
        } else {
            const addMylikeFromDB = await likesModel.create({ likerId: likerId.toString(), postId: postId });
            const isSomelikesInDB = await likesModel.find({ postId });

            return { myLike: addMylikeFromDB, listOfLikesForThisPost: isSomelikesInDB }
        }

        return { listOfLikesForThisPost: isSomelikesInDB }

    }



    async getAllLikesPostsService(userId, req) {


        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const likerId = refreshTokenResult.user;

        const isSomelikesInDB = await likesModel.find({ likerId });
        const allPostsWithLikes = await likesModel.find({ userId });

        let countOfLikesForGivenProfile = await likesModel.aggregate([
            {
                "$group": {
                    "_id": "$postId",
                    "Count": {
                        "$sum": 1
                    },

                }
            },
            {
                "$match": {
                    "Count": {
                        "$gt": 0
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "postId": "$_id",
                    "Count": 1
                }
            }
        ])

        return { listOfLikesForThisPost: isSomelikesInDB, countOfLikesForGivenProfile }
    }



}

module.exports = new PostsService();