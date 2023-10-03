
function generateRandomString(existingChars) {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  existingChars = existingChars.toString();
  const cutString = existingChars?.slice(-4)
  
  randomString += cutString;
  
  for (let i = 0; i < 4; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
  }
  return randomString;
}


const checkFl = async (userId, listUser) => {
  const res =  listUser?.map((user) => {
    let isFollower = false;
    let isFollowing = false;
    user?.followings?.map((userFollowings) => {
      if (userFollowings?.userId?._id?.toString() === userId) {
        isFollower = true;
      }
    });
    
    user?.followers?.map((userFollowers) => {
      if (userFollowers?.userId?._id?.toString() === userId) {
        isFollowing = true;
      }
    });
    if (isFollower && isFollowing) {
      user.status = "isFriend";
    } else if (isFollower) {
      user.status = "isFollower";
    } else if (isFollowing) {
      user.status = "isFollowing";
    }
    return user
  });
  return res
}

const checkLikePost = async (userId, listUser) => {
  const res =  listUser?.map((user) => {
    let isFollower = false;
    let isFollowing = false;
    user?.followings?.map((userFollowings) => {
      if (userFollowings?.userId?._id?.toString() === userId) {
        isFollower = true;
      }
    });
    
    user?.followers?.map((userFollowers) => {
      if (userFollowers?.userId?._id?.toString() === userId) {
        isFollowing = true;
      }
    });
    if (isFollower && isFollowing) {
      user.status = "isFriend";
    } else if (isFollower) {
      user.status = "isFollower";
    } else if (isFollowing) {
      user.status = "isFollowing";
    }
    return user
  });
  return res
}

module.exports = { generateRandomString, checkFl, checkLikePost }