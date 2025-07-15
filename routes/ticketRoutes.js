// In routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
router.route('/')
  .post(protect, createTicket)
  .get(protect, getMyTickets);

module.exports = router;