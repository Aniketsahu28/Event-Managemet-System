const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

const eventSchema = mongoose.Schema({
    eventId: {
        type: ObjectId,
        unique: true
    },
    organizerDetails: {
        organizerId: {
            type: ObjectId,
            unique: true
        },
        organizerName: {
            type: String,
            require: true
        },
        department: {
            type: String,
            require: true
        },
    },
    participantsIds: [
        {
            participantId: { type: ObjectId }
        }
    ],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    banner: {
        type: URL,
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
    eventForDepts: [
        { type: String }
    ],
    speakers: [
        { type: String }
    ],
    isLimitedSeats: {
        type: Boolean,
        default: false,
        require: true
    },
    maxSeats: {
        type: Number,
        default: 0
    },
    prizes: [
        { type: String }
    ],
    isEventFree: {
        type: Boolean,
        default: true,
        require: true
    },
    eventFee: {
        type: Number,
        default: 0
    },
    paymentQR: {
        type: URL,
        default: ''
    },
    UPI_ID: {
        type: String,
        default: ''
    }
})

const eventModel = mongoose.model('event', eventSchema);
export default eventModel;