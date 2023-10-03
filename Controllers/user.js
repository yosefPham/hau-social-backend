const User = require('../Models/User.model')

const { generateRandomString, checkFl } = require('../Services/user.service')


const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.userId

        const skip = (page - 1) * limit; 
        const result = await User.find({_id: { $ne: userId }})
            .skip(skip)
            .limit(limit)
            .populate('followings.userId', ['nickname', '_id', 'fullname', 'bio'])
            .populate('followers.userId', ['nickname', '_id', 'fullname', 'bio'])
            .select('-username -password')

        
        const resCheckFl = await checkFl(userId, result)
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
const logIn = async (req, res) => {
    try {
        const query = req.query
        const result = await User.find({ username: query.username })

        if (result.length > 0) {
            if (result[0]?.password === query?.password) {
                return res.status(200).json({
                    result, 
                    message: "Correct password",
                    status: 200
                })
            } else {
                return res.status(200).json({
                    message: "Wrong password",
                    status: 200
                })
            }
        } else {
            return res.status(200).json({
                message: "Account does not exist",
                status: 200
            })
        }
    } catch (err) {
        console.log('err', err)
    }
}

const newUser = async (req, res, next) => {
    try {
        const query = req.body
        const user = await User.findOne({ username: query.username })
        console.log('body', user)
        if (user?.username) {
            return res.status(201).json({
                message: 'Account already exists',
                status: 201
            })
        } else {
            const newUser =  new User(req.body)
            const stringName = generateRandomString(newUser._id)
            newUser.fullname = stringName;
            newUser.nickname = stringName;
            await newUser.save()
            return res.status(201).json({
                result: newUser,
                status: 201
            })
        }
    } catch (err) {
        console.log('err', err)
    }
}

const getUserById = async (req, res) => {
    try {
        console.log('getUserById', req.query, req.params)
        const idSignIn = req.query.id
        const userId = req.params.id; 
        let user = await User.findById({_id: userId})
        .select('-username -password')
        .populate('followers.userId', ['nickname', '_id', 'fullname', 'bio'])
        .populate('followings.userId', ['nickname', '_id', 'fullname', 'bio'])

        if (!user) {
            return res.status(404).json({
            message: 'User not found',
            status: 404
            });
        }
    if (idSignIn !== userId) {
        const res = await checkFl(idSignIn, [user])
        user = res[0]
    }
        return res.status(200).json({
            result: user,
            status: 200
        });
    } catch (err) {
        console.log('Error:', err);
        return res.status(500).json({
            message: 'Internal server error',
            status: 500
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const body = req.body;

        const existingUser = await User.findById({_id: userId});
        if (!existingUser) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    fullname: body.fullname,
                    nickname: body.nickname,
                    password: body.password,
                    avatar: body.avatar,
                    bio: body.bio,
                    tick: body.tick,
                }
            }
        );
        return res.status(200).json({
            status: 200,
            result: updatedUser,
        });
    } catch (err) {
        console.log('Lỗi khi cập nhật người dùng', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật người dùng' });
    }
};


const followingUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const body = req.body;
        
        const isExists = await User.findOne({
            _id: userId, 
            followings: { $elemMatch: { userId: body?.followings?.userId } },
        });
        let updatedUserFollowing
        let updatedUserFollower
        if (isExists && body?.followings.type === 'Unfollow') {
            updatedUserFollowing = await User.updateOne(
                { _id: userId },
                {
                    $pull: {
                        ...body?.followings?.userId  && { followings: { userId: body?.followings?.userId }}
                    },
                }
            );
            updatedUserFollower = await User.updateOne(
                { _id: body?.followings?.userId },
                {
                    $pull: {
                        ...body?.followings?.userId  && { followers: { userId: userId } }
                    },
                }
            );
        } else if (isExists) {
            return res.status(404).json({ error: 'Người dùng đã tồn tại' });
        } 
        else if (!isExists && body?.followings.type === 'Follow') {
            if (body?.followings.type === 'Follow') {
                updatedUserFollowing = await User.updateOne(
                    { _id: userId },
                    {
                        $push: {
                            ...body?.followings?.userId  && { followings: { userId: body?.followings?.userId }}
                        },
                    }
                );
                updatedUserFollower = await User.updateOne(
                    { _id: body?.followings?.userId },
                    {
                        $push: {
                            ...body?.followings?.userId  && { followers: { userId: userId } }
                        },
                    }
                );
            }
        } else {
            return res.status(404).json({ error: 'Người dùng này bạn chưa follow' });
        }
        if (updatedUserFollowing.modifiedCount === 1 && updatedUserFollower.modifiedCount === 1 ) {
            const result = await User.findOne({_id: userId})
            return res.status(200).json({
                status: 200,
                result: result,
            });
        } else {
            console.log('User not found', updatedUserFollowing, updatedUserFollower)
        }
    } catch (e) {
        console.log('Lỗi khi fl user', e);
        return res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
}
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
    
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
  
        await existingUser.remove();
    
        return res.status(200).json({
            message: 'Xóa người dùng thành công',
        });
    } catch (err) {
        console.log('Lỗi khi xóa người dùng', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa người dùng' });
    }
};

module.exports = {
    index,
    newUser,
    logIn,
    getUserById,
    updateUser,
    deleteUser,
    followingUser
}