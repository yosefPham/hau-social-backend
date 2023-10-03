const express = require('express');
const route = express.Router();
const uploadController = require('../../Controllers/uploadVideo')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./image");
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
const upload = multer({storage: storage})

route.route('/')
.post(upload.single('myFiles'), uploadController.uploadVideo)

module.exports = route