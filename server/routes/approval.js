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

        res.status(201).json({
            message: "Approval sent successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

approvalRouter.get('/facultyapprovals', userAuth, async (req, res) => {
    const userId = req.userId;
    try {
        const facultyapprovals = await ApprovalModel.find({
            $expr: {
                $eq: [{ $arrayElemAt: ["$approvers.approverDetails.userId", "$currentApprover"] }, userId]
            }
        });

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

approvalRouter.delete('/deleteapproval', organizerAuth, async (req, res) => {
    const { approvalId } = req.body;
    try {
        const approval = await ApprovalModel.findOne({ "_id": approvalId })
        if (approval) {
            await ApprovalModel.deleteOne({ "_id": approvalId });
            res.status(200).json({
                message: "Approval deleted successfully"
            })
        }
        else {
            res.status(404).json({
                message: "Approval not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

approvalRouter.patch('/editapproval', organizerAuth, async (req, res) => {
    const { approvalId, title, document } = req.body;
    try {
        const approvalDoc = await ApprovalModel.findById(approvalId);
        if (approvalDoc) {
            await ApprovalModel.updateOne({ "_id": approvalId },
                {
                    $set: {
                        title: title,
                        document: document,
                        [`approvers.${approvalDoc.currentApprover}.approvalStatus`]: "pending",
                        [`approvers.${approvalDoc.currentApprover}.approvedDate`]: "",
                        [`approvers.${approvalDoc.currentApprover}.description`]: "",
                    },
                })

            res.status(200).json({
                message: "Approval edited!"
            })
        }
        else {
            res.status(404).json({ message: "Approval not found" })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

approvalRouter.post('/validateapproval', userAuth, async (req, res) => {
    const { approvalId, status, description } = req.body;
    const date = new Date();
    try {
        const approvalDoc = await ApprovalModel.findOne({
            "_id": approvalId,
            $expr: {
                $eq: [{ $arrayElemAt: ["$approvers.approvalStatus", "$currentApprover"] }, "pending"]
            }
        });
        if (approvalDoc) {
            if (status === "approve") {
                const currentApproverIndex = approvalDoc.currentApprover;
                await ApprovalModel.updateOne(
                    { "_id": approvalId },
                    {
                        $set: {
                            [`approvers.${currentApproverIndex}.approvalStatus`]: "approved",
                            [`approvers.${currentApproverIndex}.approvedDate`]: `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`,
                            [`approvers.${currentApproverIndex}.description`]: description,
                        },
                        $inc: { currentApprover: 1 }
                    }
                );

                res.status(200).json({ message: "Approval granted!" });

            } else {
                // Handle rejection case
                const currentApproverIndex = approvalDoc.currentApprover;
                await ApprovalModel.updateOne(
                    { "_id": approvalId },
                    {
                        $set: {
                            [`approvers.${currentApproverIndex}.approvalStatus`]: "rejected",
                            [`approvers.${currentApproverIndex}.approvedDate`]: `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`,
                            [`approvers.${currentApproverIndex}.description`]: description,
                        }
                    }
                );

                res.status(200).json({ message: "Approval rejected!" });

            }
        }
        else {
            res.status(404).json({ message: "Approval already validated" });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = {
    approvalRouter
}