const express = require('express');
const PostsController = require('../controller/posts-controller')
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/posts/:id', PostsController.postsUpload );
router.delete('/posts/:id', PostsController.postsDelete );
router.get('/posts/:id', PostsController.getPosts );
router.post('/postslikes', PostsController.postLikeAdd );
router.get('/postslikes/:id', PostsController.getAllLikesPosts );




module.exports = router;