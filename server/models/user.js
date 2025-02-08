const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
    },
    userType: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
        require: true,
    },
    department: {
        type: String,
        require: true
    },
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/dzkugyv7g/image/upload/v1703526486/UserImages/b6gahysyir4yywwjn086.webp"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const UserModel = mongoose.model('users', userSchema);
module.exports = {
    UserModel
}