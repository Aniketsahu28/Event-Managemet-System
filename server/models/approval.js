const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
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
                    required: true
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
                type: String,
                default: ""
            },
            description: {
                type: String,
                default: ""
            }
        }
    ],
    organizerDetails: {
        organizerId: {
            type: String,
            required: true // Removed `unique: true` constraint
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
});

const ApprovalModel = mongoose.model('approvals', approvalSchema);
module.exports = {
    ApprovalModel
};
