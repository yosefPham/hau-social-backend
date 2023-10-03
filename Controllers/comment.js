const { updateOne } = require('../Models/Comment.model');
const Comment = require('../Models/Comment.model')
const Post = require('../Models/Post.model')

const { generateRandomString, checkFl } = require('../Services/user.service')


const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const postId = req.query.postId

        const skip = (page - 1) * limit; 
        const result = await Comment.find({postId: postId })
            .skip(skip)
            .limit(limit)
            .populate('userId', ['nickname', '_id', 'fullname', 'bio', 'avatar', 'tick'])
            .sort({updatedAt: -1})
        console.log('result', result, req.query.postId)
        return res.status(200).json({
            result: result,
            status: 200,
            currentPage: page
        });
        
    } catch (err) {
        console.log('err', err);
        return res.status(500).json({
            error: 'Internal Server Error',
            status: 500
        });
    }
};

const newComment = async (req, res, next) => {
    try {
        const query = req.body
        const postId = req.body.postId
        const newComment =  new Comment(req.body)
        await newComment.save()
        const updatePost = await Post.updateOne(
            { _id: postId },
            { $inc: { commentsCount: 1 } }
        )
        return res.status(201).json({
            result: newComment,
            status: 201
        })
        
    } catch (err) {
        console.log('err', err)
    }
}


module.exports = {
    index,
    newComment
}