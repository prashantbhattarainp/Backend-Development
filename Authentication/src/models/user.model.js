const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(   
{
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type:String,
       
    },

    isVerified:{
        type: Boolean,
        default: false,
        required: true
    },
    verificationToken:{
        type: String
    },
    resetTokenExpiry:{
        type: Date
    },
    resetToken:{
        type: String
    },
    role:{
        type: String,
        enum : ["user", "admin"],
        default: 'user'
    },
    googleId:{
        type: String
    }

},
{
    timestamps: true
}
)

const User = mongoose.model("User", userSchema);

module.exports = User;