const { Router } = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
const { UserModel } = require('../models/user');
const { userAuth } = require('../middlewares/userAuth')

userRouter.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await UserModel.findOne({ userId, password });
        if (user) {
            const secret = (user.userType === "student" || user.userType === "faculty") ? JWT_USER_SECRET : JWT_ADMIN_SECRET;
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

module.exports = {
    userRouter
};
