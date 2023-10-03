const express = require('express');
const route = express.Router();
const UserController = require('../../Controllers/user')

route.route('/login')
.get(UserController.logIn)


route.route('/follow/:id')
.put(UserController.followingUser)


route.route('/')
.get(UserController.index)
.post(UserController.newUser)

route.route('/:id')
.get(UserController.getUserById)
.put(UserController.updateUser)
.delete(UserController.deleteUser)

module.exports = route