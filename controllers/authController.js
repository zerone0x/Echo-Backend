const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const jwt = require('jsonwebtoken')
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
    res.status(StatusCodes.CREATED).json({user})
}

const login = async(req, res) => {
    res.send('login')
}

const logout = async(req, res) => {
    res.send('logout')
}

const RedirectGoogle = async(req, res)=>{
    res.send('redirect')
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