const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const authenticateUser = require('../middlewares/authentication')
const getAllUsers = async(req, res) =>{
    console.log(req.user);
    const users = await User.find({role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async(req, res) =>{
    res.send('get user')
}

const showCurrUser = async(req, res) =>{
    res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = async(req, res) =>{
    res.send(req.body);
}

const updateUserPwd = async(req, res) =>{
    res.send(req.body);
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrUser,
    updateUser,
    updateUserPwd
}