const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStragegy = require('passport-google-oauth20').Strategy
const GithubStrategy = require('passport-github2').Strategy
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

passport.serializeUser((user, done)=>{
    done(null, user._id)
})

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null, user)
    })
})

passport.use(
    new GoogleStragegy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done)=>{
        // it will execute before redirect 
        User.findOne({googleId: profile.id}).then((currUser)=>{
            if(currUser){
                done(null, currUser)
            }
        })
        User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        }).then((user) => {
            console.log(user)
            done(null, user)
        })
}))


passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/github/redirect'
}, (accessToken, refreshToken, profile, done)=>{
    // it will execute before redirect 
    console.log(profile)
}))
