const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
    description: {
        type: String,
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
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
},
{ timestamps: {} })

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment