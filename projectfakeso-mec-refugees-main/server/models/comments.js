const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(

    {
        text:{
            type: String,
            required: true,
            maxLength: 140
        },
        commenter:{
            type: String,
            required: true
        },
        upvotes: {
            type: Number,
            default: 0
        },
        commentDate: {
            type: Date,
            default: Date.now
        }

    }

)

module.exports = mongoose.model('Comment', CommentSchema);