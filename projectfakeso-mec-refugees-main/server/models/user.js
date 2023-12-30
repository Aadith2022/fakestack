const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(

    {
        email:{
            type: String,
            required: [true, 'Please enter an email'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

        },
        username:{
            type: String,
            required: [true, 'Please enter a username']
        },
        passwordHash:{
            type: String,
            required: [true, 'Please enter a password']
        },
        reputation:{
            type: Number,
            required: true,
            default: 0
        },
        registryDate:{
            type: Date,
            default: Date.now()
        },
        isAdmin:{
            type: Boolean,
            default: false
        }
    }

)

module.exports = mongoose.model('User', UserSchema);