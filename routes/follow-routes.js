const express = require('express');
const {
    getFollow,
    postFollow,
    deleteFollow,
} = require('../controller/follow-controller')

const router = express.Router();

router.get('/follow/', getFollow );
router.post('/follow/', postFollow );
router.delete('/follow/:id', deleteFollow );


module.exports = router;