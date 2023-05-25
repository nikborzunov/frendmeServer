const follow = require('../models/follow');
const handleError = (res, error) => {
    res.status(500).json({error});
}

const getFollow = (req, res) => {
    follow

        .find() //cursor
        .then((follow) => {
            res
                .status(200)
                .json(follow);
        })
        .catch((err) => handleError(res, err))
};

const postFollow = (req, res) => {
    const follow = new Follow(req.body);

    follow
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch((err) => handleError(res, err))
};

const deleteFollow = (req, res) => {
    follow
        .findByIdAndDelete( req.params.id ) //cursor
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err))
};

module.exports = {
    getFollow: getFollow,
    postFollow: postFollow,
    deleteFollow: deleteFollow,

}