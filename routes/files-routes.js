const express = require('express');
const FilesController = require('../controller/files-controller')
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/avatar', FilesController.avatarUploading );


module.exports = router;