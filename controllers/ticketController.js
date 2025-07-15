const Ticket = require("../models/Ticket");

// @desc    Create a new ticket
// @route   POST /api/tickets
async function createTicket(res, req) {
  const { title, description } = req.body;
  try {
    const ticket = await Ticket.create({
      title,
      description,
      user: req.user.id, 
      status: "New", 
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
}

// @desc    Get tickets for the logged-in user
// @route   GET /api/tickets
async function getMyTickets = async (req, res) => {
  try {
    // Find tickets where the 'user' field matches the logged-in user's ID
    const tickets = await Ticket.find({ user: req.user.id });

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createTicket,
  getMyTickets
};
