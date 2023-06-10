const TokenModel = require('../models/token-model');
const SignUpModel = require('../models/signup');
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const PostsService = require('../service/posts-service');
const app = express();
app.use(cookieParser());

class UserController {

    async postsUpload(req, res, next) {
        try {
            
            let post = req.body.post;
            let wallId = req.params.id;


            const postData = await PostsService.uploadPost(req, post, wallId);

            return res.json(postData);

        } catch (e) {
            next(e);
        }
    }



    async getPosts(req, res, next) {
        try {
            let wallId = req.params.id;
            const posts = await PostsService.getAllPosts( wallId );


            return res.json(posts);

        } catch (e) {
            next(e);

        }
    }
    
}

module.exports = new UserController();