const SignUpModel = require('../models/signup');
const TokenModel = require('../models/token-model');
const photoModel = require('../models/photos');
const FollowModel = require('../models/follow');


const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDtoOrig = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const { ObjectId } = require('mongodb');


class UserService {
    async registration(email, password) {
        const candidate = await SignUpModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`User with post index ${email} already created`)
        }
        const activationLink = uuid.v4();
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await SignUpModel.create({ email, password: hashPassword, name: '', aboutMe: '', status: '', activationLink: '', avatar: '' })

        // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const UserDto = new UserDtoOrig(user);
        const tokens = tokenService.generateTokens({ ...UserDto })
        await tokenService.saveToken(UserDto.id, tokens.refreshToken);

        return {
            ...tokens,
            // users: UserDto
        }
    }

    async active(activationLink) {

        const user = await SignUpModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation LINK')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {

        const user = await SignUpModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('User with this email is undefined')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Password is incorrect');
        }
        const UserDto = new UserDtoOrig(user);
        const tokens = tokenService.generateTokens({ ...UserDto })
        await tokenService.saveToken(UserDto.id, tokens.refreshToken);


        return {
            ...tokens,
            // users: UserDto
        }
    }

    async getAuth(req) {
        const cookiesArray = req.cookies;

        if (cookiesArray.tokens.refreshToken) {
            const refreshToken = cookiesArray.tokens.refreshToken;
            const refreshTokenResult = await TokenModel.findOne({ refreshToken })
            const userId = refreshTokenResult.user;
            const userDataById = await SignUpModel.findOne(userId)

            let email = userDataById.email;
            let name = userDataById.name;
            let id = JSON.stringify(userDataById._id);

            id = id.split('\"')[1];

            return { email, id, login: name }
        }
        return next(ApiError.UnauthorizedError());
    }

    async getProfile(userId) {
        if (userId) {
            const userDataById = await SignUpModel.findOne(userId)
            let avatar = userDataById.avatar;
            let fullName = userDataById.name;
            let dob = userDataById.dob;
            let city = userDataById.city;
            let education = userDataById.education;
            let website = userDataById.website;
            let aboutMe = userDataById.aboutMe;

            return { fullName, aboutMe, dob, city, education, website, avatar }
        }
        return next(ApiError.UnauthorizedError());
    }

    async getStatus(userId) {
        if (userId) {
            const userDataById = await SignUpModel.findOne(userId)
            let status = userDataById.status;
            return { status }
        }
        return next(ApiError.UnauthorizedError());
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await SignUpModel.findById(userData.id);
        const UserDto = new UserDtoOrig(user);
        const tokens = tokenService.generateTokens({ ...UserDto })
        await tokenService.saveToken(UserDto.id, tokens.refreshToken);

        return {
            ...tokens,
            // users: UserDto
        }
    }

    async getAllUsers(req) {
        const users = await SignUpModel.find();
        const photos = await photoModel.find();

        const cookiesArray = req.cookies;
        const refreshToken = cookiesArray.tokens.refreshToken;
        const refreshTokenResult = await TokenModel.findOne({ refreshToken })
        const userId = refreshTokenResult.user.valueOf();
        const recieverId = req.params.id
        const allMyFollows = await FollowModel.find({ senderId: userId })

        allMyFollows.map(u => {

            for (let i = 0; i < users.length; i++) {
                if (users[i]._id.valueOf() === u.recieverId) {
                    if (u.isAccepted) {
                        users[i]._doc.followed = true;
                        users[i]._doc.isAccepted = true;
                    } else {
                        users[i]._doc.followed = true;
                    }
                }
            }
        })

        return { users, photos };
    }
}

module.exports = new UserService();