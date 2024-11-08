const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

const approvalSchema = new mongoose.Schema({
    approvalId: {
        type: ObjectId,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    approvers: [
        {
            approverTitle: {
                type: String,
                required: true
            },
            approverDetails: {
                userId: {
                    type: String,
                    unique: true,
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
            approvalStatus: {
                type: Boolean,
                default: false
            },
            approvedDate: {
                type: Date
            },
            description: {
                type: String,
                required: false
            }
        }
    ],
    organizerDetails: {
        organizerId: {
            type: ObjectId,
            unique: true
        },
        organizerName: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
    }
})

const approvalModel = mongoose.model('approval', approvalSchema);
export default approvalModel;