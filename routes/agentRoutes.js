// In routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const { getAllTickets, updateTicketStatus, addComment } = require('../controllers/agentController');
const { protectAgent } = require('../middleware/agentMiddleware');

// Apply the 'protectAgent' middleware to all routes in this file
router.use(protectAgent);

// Define the routes
router.get('/tickets', getAllTickets);
router.put('/tickets/:id', updateTicketStatus);
router.post('/tickets/:id/comments', addComment);

module.exports = router;