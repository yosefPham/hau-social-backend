const Post = require('../Models/Post.model')

const { generateRandomString, checkLikePost } = require('../Services/user.service')


const index = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.userId
        const result = await Post.find({_id: { $ne: userId }})
            .limit(limit)
            .populate('userId', ['nickname', '_id', 'fullname', 'bio', 'avatar', 'tick'])
            .sort({createdAt: -1})
        const totalCount = await Post.countDocuments();
        const resCheckLike = await checkLikePost(userId, result)
        return res.status(200).json({
            result: resCheckLike,
            status: 200,
            total: totalCount
        });
        
    } catch (err) {
        console.log('err', err);
        return res.status(500).json({
            error: 'Internal Server Error',
            status: 500
        });
    }
};

const getPostUser = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.userId
        const result = await Post.find({ userId: userId })
            .limit(limit)
            .populate('userId', ['nickname', '_id', 'fullname', 'bio', 'avatar', 'tick'])
            .sort({createdAt: -1})
        const totalCount = await Post.countDocuments();
        const resCheckLike = await checkLikePost(userId, result)
        return res.status(200).json({
            result: resCheckLike,
            status: 200,
            total: totalCount
        });
        
    } catch (err) {
        console.log('err', err);
        return res.status(500).json({
            error: 'Internal Server Error',
            status: 500
        });
    }
};

const newPost = async (req, res, next) => {
    try {
        const query = req.body
        const newPost =  new Post(req.body)
        await newPost.save()
        return res.status(201).json({
            result: newPost,
            status: 201
        })
        
    } catch (err) {
        console.log('err', err)
    }
}

const getPostOne = async (req, res) => {
    try {
        const postId = req.params.id; 
        const userId = req.query.userId
        let post = await Post.findById({_id: postId})
            .populate('userId', ['nickname', '_id', 'fullname', 'bio', 'avatar'])
            
        const resCheckLike = await checkLikePost(userId, [post])
        if (!post) {
            return res.status(404).json({
            message: 'User not found',
            status: 404
            });
        } else {
            return res.status(200).json({
                result: resCheckLike,
                status: 200
            });
        }
    
    } catch (err) {
        console.log('Error:', err);
        return res.status(500).json({
            message: 'Internal server error',
            status: 500
        });
    }
}

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const body = req.body;

        const isExists = await Post.findOne({
            _id: postId, 
            likes: { $elemMatch: { userId: body?.likes?.userId } },
        });
        let updatedUserLike
        if (isExists && !body?.likes.type.isLike) {
            updatedUserLike = await Post.updateOne(
                { _id: postId },
                {
                    $pull: {
                        ...body?.likes?.userId  && { likes: { userId: body?.likes?.userId }}
                    },
                }
            );
            // await User.updateOne()
        } else if (isExists) {
            return res.status(404).json({ error: 'Người dùng đã tồn tại' });
        } else if (!isExists && body?.likes.type.isLike) {
            if (body?.likes.type) {
                updatedUserLike = await Post.updateOne(
                    { _id: postId },
                    {
                        $push: {
                            ...body?.likes?.userId  && { likes: { userId: body?.likes?.userId }}
                        },
                    }
                );
            }
        } else {
            return res.status(404).json({ error: 'Bài viết này này bạn chưa like' });
        }
        if (updatedUserLike?.modifiedCount === 1) {
            const result = await Post.findOne({_id: postId})
            return res.status(200).json({
                status: 200,
                result: result,
            });
        } else {
            console.log('Post not found', updatedUserLike)
        }
        
    } catch (err) {
        console.log('Lỗi khi cập nhật người dùng', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật người dùng' });
    }
};

module.exports = {
    index,
    newPost,
    getPostOne,
    updatePost,
    getPostUser
}