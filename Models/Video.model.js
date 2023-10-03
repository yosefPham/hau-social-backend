const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = Schema({
    description: {
        type: String,
    },
    music: {
        type: String,
    },
    fileUrl: {
        type: String,
    },
    likesCount: {
        type: Number,
    }

},
{ timestamps: {} })

const Video = mongoose.model('Video', VideoSchema)

module.exports = Video