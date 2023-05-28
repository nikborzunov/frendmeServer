const express = require('express');
const {
    getFollow,
    postFollow,
    deleteFollow,
} = require('../controller/FollowController')

const router = express.Router();

router.get('/follow/', getFollow );
router.post('/follow/:id', postFollow );
router.delete('/follow/:id', deleteFollow );


module.exports = router;