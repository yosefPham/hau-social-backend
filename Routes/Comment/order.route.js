const express = require('express');
const route = express.Router();
const CommentController = require('../../Controllers/comment')


route.route('/')
.get(CommentController.index)
.post(CommentController.newComment);

module.exports = route