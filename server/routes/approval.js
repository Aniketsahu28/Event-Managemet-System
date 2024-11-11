const { Router } = require('express');
const approvalRouter = Router();
const { organizerAuth } = require('../middlewares/organizerAuth')
const { userAuth } = require('../middlewares/userAuth')
const { ApprovalModel } = require('../models/approval')
const { OrganizerModel } = require('../models/organizer')

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

approvalRouter.get('/organizerapprovals', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    try {
        const organizerApprovals = await ApprovalModel.find({ 'organizerDetails.organizerId': organizerId })
        if (organizerApprovals.length > 0) {
            res.status(200).json({
                organizerApprovals
            })
        } else {
            res.status(404).json({
                message: "No approvals found"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

approvalRouter.post('/addapproval', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { title, document, approvers } = req.body;
    const date = new Date();

    try {
        const organizer = await OrganizerModel.findOne({ organizerId });
        console.log(approvers[0].approverDetails)
        await ApprovalModel.create({
            title,
            document,
            date: `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`,
            organizerDetails: {
                organizerId: organizer.organizerId,
                organizerName: organizer.organizerName,
                department: organizer.department
            },
            approvers: approvers.map(approver => ({
                approverTitle: approver.approverTitle,
                approverDetails: {
                    userId: approver.approverDetails.userId,
                    userType: approver.approverDetails.userType,
                    username: approver.approverDetails.username,
                },
            }))
        })

        res.status(200).json({
            message: "Approval sent successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

approvalRouter.get('/facultyapprovals', userAuth, async (req, res) => {
    const userId = req.userId;
    try {
        const facultyapprovals = await ApprovalModel.find({ 'approvers.approverDetails.userId': userId })
        if (facultyapprovals.length > 0) {
            res.status(200).json({
                facultyapprovals
            })
        }
        else {
            res.status(404).json({
                message: "No approvals found"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

//edit approval endpoint

//delete approval endpoint

//validate approval endpoint

//Think upon : how to approval requests will be sent to faculties one after the other (it should not go simultaneously to everyone in the approvers list)

module.exports = {
    approvalRouter
}