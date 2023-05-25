const Profile = require('../models/profile');

const handleError = (res, error) => {
    res.status(500).json({error});
}

const getProfiles = (req, res) => {
    Profile

        .find() //cursor
        .then((profile) => {
            res
                .status(200)
                .json(profile);
        })
        .catch((err) => handleError(res, err))
};

const getProfile = (req, res) => {
    Profile
        .findById( req.params.id ) //cursor
        .then((profile) => {
            res
                .status(200)
                .json(profile);
        })
        .catch((err) => handleError(res, err))
};

const deleteProfile = (req, res) => {
    Profile
        .findByIdAndDelete( req.params.id ) //cursor
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err))
};

const postProfile = (req, res) => {
    const profile = new Profile(req.body);

    profile
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch((err) => handleError(res, err))
};

const patchProfile = (req, res) => {
    Profile
        .findByIdAndUpdate(req.params.id, req.body) //cursor
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err))
};


module.exports = {
    getProfiles: getProfiles,
    getProfile: getProfile,
    deleteProfile: deleteProfile,
    postProfile: postProfile,
    patchProfile: patchProfile,
}