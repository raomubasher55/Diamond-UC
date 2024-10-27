const jwt = require('jsonwebtoken');

const isLogined = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1]; // Assuming 'Bearer token' format
        const decoded = jwt.verify(bearerToken, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        next(); // Pass control to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};


const isAdmin = async (req, res, next) => {
    if (req.user && req.user.user.role === 1) { // Access the role property correctly
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Only admin can access'
        });
    }
}


module.exports ={ isLogined , isAdmin};
