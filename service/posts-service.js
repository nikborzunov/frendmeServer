const postsModel = require('../models/postsModel');
const TokenModel = require('../models/token-model');
const photoModel = require('../models/photos');


class PostsService {
    async uploadPost(req, post, wallId) {

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user.valueOf();
        var today = new Date();
        var time = today.toLocaleString();

        const postInfo = await postsModel.create({
            userIdSender: userId,
            userIdWallReviever: wallId,
            post: post,
            time: time,
        })

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

            addPhotoToGeneralDb.map((t) => {
                t.userId === userIdSender ? postsWithPhotos[i].avatarPhoto = t.avatarPhoto : null
            })

            i = i + 1;
        }))

        return postsWithPhotos
    }
}

module.exports = new PostsService();