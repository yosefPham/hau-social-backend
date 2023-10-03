const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
    },
    followers: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    followings: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    nickname: {
        type: String,
    },
    tick: {
        type: String,
    },
    likes: {
        type: Number,
    },
    status: {
        type: String,
    }


},
{ timestamps: {} })

const User = mongoose.model('User', UserSchema)

module.exports = User