const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

const organizerSchema = new mongoose.Schema({
    organizerId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    organizerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    organizerProfile: {
        type: String,
        default: "https://res.cloudinary.com/dzkugyv7g/image/upload/v1703526486/UserImages/b6gahysyir4yywwjn086.webp"
    },
    department: {
        type: String,
        required: true
    },
    organizerType: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: "organizer"
    },
    facultyDetails: {
        userId: {
            type: String,
        },
        userType: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
    },
})

const OrganizerModel = mongoose.model('organizers', organizerSchema);
module.exports = {
    OrganizerModel
}