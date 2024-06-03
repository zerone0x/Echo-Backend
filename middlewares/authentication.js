const CustomError = require('../errors')
const {isTokenValid} = require('../utils')
const authenticateUser = async(req,res, next)=>{
    const token = req.signedCookies.token
    if(!token){
        throw new CustomError.UnauthenticatedError('Auth failed')
    }
    try {
        const {name, email, role, userId}  = isTokenValid(token)
        req.user = {name, email, role, userId}
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Auth failed')
    }
}
const authorizePermission = (...roles)=> {
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthenticatedError('Can\'t be able have access to this route')
        }
        next()
    }
}


module.exports = {
    authenticateUser,
    authorizePermission
}