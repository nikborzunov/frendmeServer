const express = require('express');
const MessengerController = require('../controller/messenger-controller')
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/messenger/:id',authMiddleware, MessengerController.getDialogs);
router.get('/messenger/chat/:id',authMiddleware, MessengerController.getChatMessages);
router.post('/messenger/:id', authMiddleware, MessengerController.postMessage);

// router.get('/messenger/id',authMiddleware, MessengerController.getChat);
// router.post('/update/profile/info', authMiddleware, MessengerController.updateProfileInfo);

module.exports = router;