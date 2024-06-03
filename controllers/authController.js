const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse, createTokenUser} = require('../utils/index')
const passport = require('passport')


const register = async (req, res) => {
    const {email, name, password} = req.body
    const ifEmailExist = await User.findOne({email})
    if(ifEmailExist){
        throw new CustomError.BadRequestError('Email already exist')
    }
    const isFirstUser = (await User.countDocuments({})) === 0
    const role = isFirstUser ? 'admin' : 'user'
    const user = await User.create({email, name, password, role})
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.CREATED).json({user: user, tokenUser})
}

const login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials of useremail')
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        throw new CustomError.UnauthenticatedError('Invalid Credentials of password')
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.CREATED).json({user: user, tokenUser})
    
}

const logout = async(req, res) => {
    res.cookie('token', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 10),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
    res.status(StatusCodes.OK).json({msg: 'Logout successfully'})
}

const RedirectGoogle = async(req, res)=>{
    res.send(req.user)
}

const RedirectGithub = async(req, res)=>{
    res.send('redirect')
}

module.exports = {
    register,
    login,
    logout,
    RedirectGoogle,
    RedirectGithub
}