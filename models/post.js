const mongoose = require('mongoose')

const postSchma = new mongoose.Schema({
    content: {
        type: String,
        required: [true, '貼文內容未填寫']
    },
    name: {
        type: String,
        required: [true, '貼文姓名未填寫']
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    likes: {
        type:Number,
        default:0
    },
    comments:{
        type: Number,
        default: 0
    }
})
const Post = mongoose.model('Post', postSchma)
module.exports = Post