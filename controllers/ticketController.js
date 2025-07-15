const Ticket = require('../models/Ticket');

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Private
 */
exports.createTicket = async (req, res) => {
  // Ensure title and description are present in the request body
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ msg: 'Please provide a title and description' });
  }

  try {
    const ticket = await Ticket.create({
      title,
      description,
      user: req.user.id, // Comes from the protect middleware
      status: 'New',     // Default status
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

/**
 * @desc    Get tickets for the logged-in user
 * @route   GET /api/tickets
 * @access  Private
 */
exports.getMyTickets = async (req, res) => {
  try {
    // Find tickets where the 'user' field matches the logged-in user's ID
    const tickets = await Ticket.find({ user: req.user.id });

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};
