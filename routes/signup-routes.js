const express = require('express');
const UserController = require('../controller/user-controller')
const router = express.Router();
const { body } = require('express-validator');
const userAuthMiddleware = require('../middlewares/userAuth-middleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/api/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', userAuthMiddleware, UserController.getUsers);
router.get('/authme', authMiddleware, UserController.getAuth);
router.get('/profile/:id', authMiddleware, UserController.getProfile);
router.get('/status/:id', authMiddleware, UserController.getStatus);
router.post('/status/update', authMiddleware, UserController.updateStatus);
router.post('/update/profile/info', authMiddleware, UserController.updateProfileInfo);




module.exports = router;