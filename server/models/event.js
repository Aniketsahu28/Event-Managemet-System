const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    organizerDetails: {
        organizerId: {
            type: String,
        },
        facultyId: {
            type: String,
        },
        organizerName: {
            type: String,
            require: true
        },
        department: {
            type: String,
            require: true
        },
        email: {
            type: String,
        },
        phone: {
            type: String
        },
        facultyReview: {
            type: String,
            default: ""
        }
    },
    acceptingParticipation: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    banner: {
        type: String,
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
    eventForDepts: [
        { type: String }
    ],
    outsideStudentsAllowed: {
        type: Boolean,
        default: false
    },
    minTeamSize: {
        type: Number,
        default: 1
    },
    maxTeamSize: {
        type: Number,
        default: 1
    },
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
        default: 100000
    },
    seatsFilled: {
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
    isPriceVariation: {
        type: Boolean,
        default: false,
    },
    eventFee: {
        type: Number,
        default: 0
    },
    eventFeeForClubMember: {
        type: Number,
        default: 0
    },
    paymentQR: {
        type: String,
        default: ''
    },
    UPI_ID: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true })

const EventModel = mongoose.model('events', eventSchema);
module.exports = {
    EventModel
}