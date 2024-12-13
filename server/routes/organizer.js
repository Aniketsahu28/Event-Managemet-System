const { Router } = require('express')
const organizerRouter = Router();
const { adminAuth } = require('../middlewares/adminAuth')
const { OrganizerModel } = require('../models/organizer');
const { UserModel } = require('../models/user');
const { organizerAuth } = require('../middlewares/organizerAuth');
const jwt = require('jsonwebtoken');
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;

organizerRouter.post('/login', async (req, res) => {
    const { organizerId, password } = req.body;
    try {
        const user = await OrganizerModel.findOne({ organizerId, password });
        if (user) {
            const token = jwt.sign({ organizerId: user.organizerId }, JWT_USER_SECRET);
            res.json({ token, user });
        } else {
            res.status(401).json({
                message: "Invalid userId or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

organizerRouter.get('/allorganizers', async (req, res) => {
    try {
        const organizers = await OrganizerModel.find({})
        res.status(200).json({
            organizers
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

organizerRouter.get('/organizerdetails', async (req, res) => {
    const { organizerId } = req.query;
    try {
        const organizer = await OrganizerModel.findOne({ "_id": organizerId });
        if (organizer) {
            res.status(200).json({
                organizer
            })
        } else {
            res.status(404).json({
                message: "Organizer not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

organizerRouter.post('/createorganizer', adminAuth, async (req, res) => {
    const { organizerId, organizerName, department, facultyId, organizerType } = req.body;
    try {
        const faculty = await UserModel.findOne({ userId: facultyId })
        await OrganizerModel.create({
            organizerId: organizerId,
            password: organizerId,
            organizerName: organizerName,
            department: department,
            organizerType: organizerType,
            facultyDetails: {
                userId: faculty.userId,
                userType: faculty.userType,
                username: faculty.username,
            },
            eventIds: []
        });
        res.status(201).json({
            message: `Organizer added successfully`
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
})

organizerRouter.delete('/deleteorganizer', adminAuth, async (req, res) => {
    const { organizerId } = req.body;
    try {
        const organizer = await OrganizerModel.findOne({ organizerId: organizerId });
        if (organizer) {
            await OrganizerModel.deleteOne({ organizerId: organizerId })
            res.status(200).json({
                message: "Organizer deleted successfully"
            })
        } else {
            res.status(404).json({
                message: "Organizer not found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

organizerRouter.patch('/editorganizerdetails', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { organizerName, organizerProfile, facultyId } = req.body;
    try {
        const organizer = await OrganizerModel.findOne({ organizerId });
        if (organizer) {
            const faculty = await UserModel.findOne({ userId: facultyId })
            organizer.organizerName = organizerName;
            organizer.organizerProfile = organizerProfile;
            organizer.facultyDetails.userId = faculty.userId;
            organizer.facultyDetails.username = faculty.username;

            await OrganizerModel.updateOne({ organizerId }, organizer);
            res.status(200).json({
                message: "Organizer information updated successfully"
            })

        } else {
            res.status(404).json({
                message: "Organizer not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

organizerRouter.patch('/changepassword', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { password, newPassword } = req.body;
    try {
        const organizer = await OrganizerModel.findOne({ organizerId });
        if (organizer.password !== password) {
            res.status(401).json({
                message: "Incorret old password"
            })
        } else {
            await OrganizerModel.updateOne({ organizerId }, { $set: { password: newPassword } });
            res.status(200).json({
                message: "Pasword changed successfully"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

organizerRouter.patch('/editprofilePicture', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { profilePicture } = req.body;
    try {
        const organizer = await OrganizerModel.findOne({ organizerId });
        organizer.organizerProfile = profilePicture;

        await OrganizerModel.updateOne({ organizerId }, organizer);

        res.status(200).json({
            message: "Profile picture updated"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

organizerRouter.patch('/editUsername', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { username } = req.body;
    try {
        const organizer = await OrganizerModel.findOne({ organizerId });
        organizer.organizerName = username;

        await OrganizerModel.updateOne({ organizerId }, organizer);

        res.status(200).json({
            message: "Username updated"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

module.exports = {
    organizerRouter
};