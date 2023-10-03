const path = require('path');

const uploadVideo = async (req, res) => {
    const url = `http://localhost:${process.env.PORT}/image/${req?.file?.filename}`;
    console.log('req?.file', req?.file)
    try {
        res.status(201).json({
            status: 201,
            result: url
        })
    } catch (e) {
        console.log('e', e)
    }
    
};

module.exports = { uploadVideo }