// Answer Document Schema

const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema(
    {
        text:{
            type: String,
            required: true
        },
        ans_by:{
            type: String,
            required: true,
          
        },
        ans_date_time:{
            type: Date,
            default: Date.now
        },
        upvotes:{
            type: Number,
            default: 0
        },
        comments:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comments'
        },
        asker:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User'
        }
    }
)

AnswerSchema.virtual('url').get(function() {

    return '/posts/answer/' + this._id

});

module.exports = mongoose.model('Answer', AnswerSchema);