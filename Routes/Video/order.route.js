const express = require('express');
const route = express.Router();

route.get('/user', (req, res, next) => {
    res.json({
        status: 200,
        element: [{}]
    })
})

module.exports = route