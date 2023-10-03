const express = require('express');
const route = express.Router();
const PostController = require('../../Controllers/post')


route.route('/')
.get(PostController.index)
.post(PostController.newPost)

route.route('/:id')
.put(PostController.updatePost)

module.exports = route