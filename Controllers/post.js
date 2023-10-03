const Post = require('../Models/Post.model')

const { generateRandomString, checkLikePost } = require('../Services/user.service')


const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.userId

        const skip = (page - 1) * limit; 
        const result = await Post.find({_id: { $ne: userId }})
            .skip(skip)
            .limit(limit)
            .populate('userId', ['nickname', '_id', 'fullname', 'bio', 'avatar'])
            .sort({updatedAt: -1})

        
        const resCheckFl = await checkLikePost(userId, result)
        return res.status(200).json({
            result: resCheckFl,
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
        let updatedUserFollowing
        let updatedUserFollower
        if (isExists && body?.likes.type === 'Unlike') {
            updatedUserLike = await Post.updateOne(
                { _id: postId },
                {
                    $pull: {
                        ...body?.likes?.userId  && { likes: { userId: body?.likes?.userId }}
                    },
                }
            );
        } else if (isExists) {
            return res.status(404).json({ error: 'Người dùng đã tồn tại' });
        } 
        else if (!isExists && body?.followings.type === 'Like') {
            if (body?.likes.type === 'Like') {
                updatedUserFollowing = await Post.updateOne(
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
        if (updatedUserFollowing.modifiedCount === 1 && updatedUserFollower.modifiedCount === 1 ) {
            const result = await User.findOne({_id: postId})
            return res.status(200).json({
                status: 200,
                result: result,
            });
        } else {
            console.log('User not found', updatedUserFollowing, updatedUserFollower)
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
    updatePost
}