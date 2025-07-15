 const { protect } = require('./authMiddleware');

// Middleware to check for 'agent' role
exports.protectAgent = (req, res, next) => {
    // First, run the standard 'protect' middleware to ensure the user is authenticated
    protect(req, res, () => {
        // If authenticated, then check the user's role
        if (req.user && req.user.role === 'agent') {
            next(); // User is an agent, proceed to the next function
        } else {
            res.status(403).json({ msg: 'Forbidden: Access is restricted to agents' });
        }
    });
};