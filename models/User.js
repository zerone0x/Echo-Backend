const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate:{
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        }
    },
    password:{
        type: String,
        // required: [true, 'Please provide password'],
        minlength: 6,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    googleId:{
        type: String
    },
    githubId:{
        type: String
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    // Followers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    // Following: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    // LikedPosts: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // }],
    // LikedComments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
    // ProfilePic: {
    //     type: String,
    //     default: 'default.jpg'
    // },
    // Bio: {
    //     type: String,
    //     default: ''
    // }

});


UserSchema.pre('save', async function(){
    if(this.googleId || this.githubId){
        return
    }
    if(!this.isModified('password')){
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(Password){
    if(this.googleId || this.githubId){
        return
    }
    const isMatch = await bcrypt.compare(Password, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema);