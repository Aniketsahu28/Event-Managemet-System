const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

const ticketSchema = new mongoose.Schema({
    userDetails: {
        userId: {
            type: String,
        },
        username: {
            type: String,
            require: true
        },
        department: {
            type: String,
            require: true
        },
        profilePicture: {
            type: String,
            default: "https://res.cloudinary.com/dzkugyv7g/image/upload/v1703526486/UserImages/b6gahysyir4yywwjn086.webp"
        }
    },
    eventDetails: {
        eventId: {
            type: ObjectId,
        },
        title: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        eventFee: {
            type: Number,
            default: 0
        },
    },
    paymentImage: {
        type: String,
        default: "",
    }
}, { timestamps: true })

const TicketModel = mongoose.model('tickets', ticketSchema);
module.exports = {
    TicketModel
}