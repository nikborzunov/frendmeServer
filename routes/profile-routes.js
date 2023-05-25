const express = require('express');
const {
    getProfiles,
    getProfile,
    deleteProfile,
    postProfile,
    patchProfile, } = require('../controller/profile-controller')

const router = express.Router();


router.get('/profiles/', getProfiles );

router.get('/profiles/:id', getProfile );

router.delete('/profiles/:id', deleteProfile );

router.post('/profiles/', postProfile );

router.patch('/profiles/:id', patchProfile );

module.exports = router;