// Tag Document Schema

const mongoose = require('mongoose');

const TagsSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        creator:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User'
        }

    }
)

TagsSchema.virtual('url').get(function() {

    return '/posts/tag/' + this._id

});

module.exports = mongoose.model('Tag', TagsSchema);