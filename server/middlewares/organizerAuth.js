const jwt = require('jsonwebtoken');

const organizerAuth = async (req, res, next) => {
    const token = req.headers.token;
    try {
        const decodedData = jwt.verify(token, process.env.JWT_USER_SECRET);
        if (decodedData) {
            req.organizerId = decodedData.organizerId;
            next();
        }
        else {
            res.status(401).json({
                message: "Unauthorized Organizer"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    organizerAuth
}