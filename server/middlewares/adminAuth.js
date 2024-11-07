const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    try {
        if (decodedData) {
            req.userId = decodedData.userId;
            next();
        }
        else {
            res.status(401).json({
                message: "Unauthorized user"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    adminAuth
}