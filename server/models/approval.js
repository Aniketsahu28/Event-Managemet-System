const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

const approvalSchema = new mongoose.Schema({
    approvalId: {
        type: ObjectId,
        unique: true
    },
    title: {
        type: String,
        require: true
    },
    document: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    approvers: [
        {
            approverTitle: {
                type: String,
                require: true
            },
            approverDetails: {
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
            approvalStatus: {
                type: Boolean,
                default: false
            },
            approvedDate: {
                type: Date
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
            require: true
        },
        department: {
            type: String,
            require: true
        },
    }
})

const approvalModel = mongoose.model('approval', approvalSchema);
export default approvalModel;