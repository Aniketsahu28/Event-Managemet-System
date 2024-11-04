const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

const organizerSchema = new mongoose.Schema({
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
    facultyDetails: {
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
    },
    eventIds: [
        {
            eventId: { type: ObjectId }
        }
    ]
})

const organizerModel = mongoose.model('organizer', organizerSchema);
export default organizerModel;