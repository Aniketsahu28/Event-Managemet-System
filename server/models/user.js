const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

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
    password: {
        type: String,
        require: true
    },
    department: {
        type: String,
        require: true
    },
    ticketIds: [
        {
            ticketId: { type: ObjectId }
        }
    ]
})

const UserModel = mongoose.model('users', userSchema);
module.exports = {
    UserModel
}