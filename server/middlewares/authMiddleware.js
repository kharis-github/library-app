// middleware untuk menjalankan proses autentikasi

const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, 'secret_key');
            req.userId = decoded.userId;
            req.role = decoded.role
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
    },
    authorize: (roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.role)) {
                return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
            }
            next();
        }
    }
};
