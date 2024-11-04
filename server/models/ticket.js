const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: ObjectId,
        unique: true,
    },
    userDetails: {
        userId: {
            type: ObjectId,
        },
        username: {
            type: String,
            require: true
        },
        department: {
            type: String,
            require: true
        },
    },
    eventDetails: {
        eventid: {
            type: ObjectId,
        },
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
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
    }
}, { timestamps: true })

const ticketModel = mongoose.model('ticket', ticketSchema);
export default ticketModel;