const express = require('express');
const route = express.Router();
const PostController = require('../../Controllers/post')

route.route('/post-myuser')
.get(PostController.getPostUser)

route.route('/')
.get(PostController.index)
.post(PostController.newPost)

route.route('/:id')
.get(PostController.getPostOne)
.put(PostController.updatePost)


module.exports = route