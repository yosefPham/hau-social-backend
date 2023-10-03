const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    description: {
        type: String,
    },
    type: {
        type: String,
    },
    fileList: {
        type: Array,
    },
    likesCount: {
        type: Number,
    },
    likes: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentsCount: {
        type: Number,
    },
},
{ timestamps: {} })

const Post = mongoose.model('Post', PostSchema)

module.exports = Post