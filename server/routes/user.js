const { Router } = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
const { UserModel } = require('../models/user');
const { userAuth } = require('../middlewares/userAuth');
const { adminAuth } = require('../middlewares/adminAuth');
const { sendForgetPasswordEmail } = require('../utils/email');

userRouter.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await UserModel.findOne({ userId, password }, { password: 0 })
        if (user) {
            const secret = (user.userType === "student" || user.userType === "faculty") ? JWT_USER_SECRET : JWT_ADMIN_SECRET;
            const token = jwt.sign({ userId: user.userId }, secret);
            res.json({ token, user });
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
        const user = await UserModel.findOne({ userId }, { password: 0 })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

userRouter.get('/allstudents', async (req, res) => {
    try {
        const students = await UserModel.find({ "userType": "student" }, { password: 0 })
        if (students.length > 0) {
            res.status(200).json({ students });
        }
        else {
            res.status(404).json({
                message: "No students found"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

userRouter.get('/allfaculty', async (req, res) => {
    try {
        const faculties = await UserModel.find({ "userType": "faculty" }, { password: 0 })
        if (faculties.length > 0) {
            res.status(200).json({ faculties });
        }
        else {
            res.status(404).json({
                message: "No faculty found"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
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

userRouter.patch('/editprofilePicture', userAuth, async (req, res) => {
    const userId = req.userId;
    const { profilePicture } = req.body;
    try {
        const user = await UserModel.findOne({ userId }, { password: 0 });
        user.profilePicture = profilePicture;

        await UserModel.updateOne({ userId }, user);

        res.status(200).json({
            message: "Profile picture updated"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.patch('/editUserInfo', userAuth, async (req, res) => {
    const userId = req.userId;
    const { username, email, phone } = req.body;
    try {
        const user = await UserModel.findOne({ userId }, { password: 0 });
        user.username = username;
        user.email = email;
        user.phone = phone;

        await UserModel.updateOne({ userId }, user);

        res.status(200).json({
            message: "User info updated"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.get('/forgetpassword', async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await UserModel.findOne({ userId });
        if (user) {
            if (user.email) {
                await sendForgetPasswordEmail(user.email, user.password)
                res.status(200).json({
                    message: "Password sent on your email"
                })
            }
            else {
                res.status(400).json({
                    message: "You haven't added your email. Contact technical support."
                })
            }
        }
        else {
            res.status(404).json({
                message: "User with this Id does not exist"
            })
        }
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
            const student = await UserModel.findOne({ userId: rollno.toString() }, { password: 0 });
            if (!student) {
                newUsers.push({
                    userId: rollno.toString(),
                    userType: "student",
                    username: rollno.toString(),
                    password: rollno.toString(),
                    department: department,
                })
            }
        }
        if (newUsers.length > 0) {
            await UserModel.insertMany(newUsers);
            res.status(201).json({
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

userRouter.post('/signup', async (req, res) => {
    const { userId, username, password } = req.body;
    try {
        const user = await UserModel.findOne({ userId })
        if (!user) {
            await UserModel.create({
                userId: userId,
                userType: "student",
                username: username,
                password: password,
                department: "Outsider",
            });
            res.status(201).json({
                message: "Signup successful"
            })
        }
        else {
            res.status(200).json({
                message: "User with this userId already exists"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.post('/createfaculty', adminAuth, async (req, res) => {
    const { userId, department } = req.body;
    try {
        const faculty = await UserModel.findOne({ userId }, { password: 0 });
        if (faculty) {
            res.status(409).json({
                message: "User already exists"
            })
        } else {
            await UserModel.create({
                userId: userId,
                userType: "faculty",
                username: userId,
                password: userId,
                department: department,
            });
            res.status(201).json({
                message: `Faculty added successfully`
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

userRouter.delete('/deletefaculty', adminAuth, async (req, res) => {
    const { userId } = req.body;
    try {
        const faculty = await UserModel.findOne({ userId }, { password: 0 })
        if (faculty) {
            await UserModel.deleteOne({ userId })
            res.status(200).json({
                message: `Faculty deleted successfully`
            })
        }
        else {
            res.status(404).json({
                message: `Faculty not found with ${userId}`
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