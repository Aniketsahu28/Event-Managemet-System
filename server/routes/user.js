const { Router } = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
const { UserModel } = require('../models/user');
const { userAuth } = require('../middlewares/userAuth');
const { adminAuth } = require('../middlewares/adminAuth');

userRouter.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await UserModel.findOne({ userId, password });
        if (user) {
            const secret = (user.userType === "student" || user.userType === "faculty" || user.userType === "organizer") ? JWT_USER_SECRET : JWT_ADMIN_SECRET;
            const token = jwt.sign({ userId: user.userId }, secret);
            res.json({ token });
        } else {
            res.status(401).json({
                message: "Invalid userId or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

userRouter.get('/userinfo', userAuth, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await UserModel.findOne({ userId });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

userRouter.patch('/changepassword', userAuth, async (req, res) => {
    const userId = req.userId;
    const { password, newPassword } = req.body;
    try {
        const user = await UserModel.findOne({ userId });
        if (user.password !== password) {
            res.status(401).json({
                message: "Incorret old password"
            })
        } else {
            await UserModel.updateOne({ userId }, { $set: { password: newPassword } });
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

userRouter.patch('/editprofile', userAuth, async (req, res) => {
    const userId = req.userId;
    const { username, profilePicture } = req.body;
    try {
        const user = await UserModel.findOne({ userId });
        user.username = username;
        user.profilePicture = profilePicture;

        await UserModel.updateOne({ userId }, user);

        res.status(200).json({
            message: "Profile updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.get('/forgetpassword', userAuth, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await UserModel.findOne({ userId });
        res.status(200).json({
            password: user.password
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

userRouter.post('/createstudent', adminAuth, async (req, res) => {
    const { fromRollno, toRollno, department } = req.body;
    try {
        const newUsers = [];
        for (let rollno = fromRollno; rollno <= toRollno; rollno++) {
            const student = await UserModel.findOne({ userId: rollno.toString() });
            if (!student) {
                newUsers.push({
                    userId: rollno.toString(),
                    userType: "student",
                    username: rollno.toString(),
                    password: rollno.toString(),
                    department: department,
                    ticketIds: []
                })
            }
        }
        if (newUsers.length > 0) {
            await UserModel.insertMany(newUsers);
            res.status(200).json({
                message: `User added from ${fromRollno} to ${toRollno} successfully`
            })
        }
        else {
            res.status(200).json({
                message: `No user to add`
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.delete('/deletestudent', adminAuth, async (req, res) => {
    const { fromRollno, toRollno } = req.body;
    try {
        const usersToDelete = [];
        for (let rollno = fromRollno; rollno <= toRollno; rollno++) {
            usersToDelete.push(rollno)
        }
        if (usersToDelete.length > 0) {
            await UserModel.deleteMany({ userId: { $in: usersToDelete } })
            res.status(200).json({
                message: `Users deleted from ${fromRollno} to ${toRollno} successfully`
            })
        }
        else {
            res.status(200).json({
                message: "No users to delete"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

module.exports = {
    userRouter
};