// Question Document Schema

var mongoose = require('mongoose')

const QuestionSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            maxLength: 100
        },
        summary: {
            type: String,
            required: true,
            maxLength: 140
        },
        text:{
            type: String,
            required: true
        },
        tags:{
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            ref: 'Tags'
        },
        answers:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Answers'

        },
        comments:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comments'
        },
        asked_by:{
            type: String,
            required: true,
            default: 'Anonymous'
        },
        ask_date_time:{
            type: Date,
            default: Date.now
        },
        asker:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User'
        },
        views:{
            type: Number,
            default: 0
        },
        upvotes:{
            type: Number,
            default: 0
        }

    }
)

QuestionSchema.virtual('url').get(function() {

    return '/posts/question/' + this._id

});

module.exports = mongoose.model('Question', QuestionSchema);