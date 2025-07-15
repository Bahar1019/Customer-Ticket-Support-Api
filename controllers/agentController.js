// In controllers/agentController.js
const Ticket = require("../models/Ticket");
const Comment = require("../models/Comment");

// @desc    Get all tickets (for agents)
// @route   GET /api/agent/tickets
// @access  Private (Agent only)
exports.getAllTickets = async (req, res) => {
  try {
    // Allow filtering by status, e.g., /api/agent/tickets?status=Open
    const filter = req.query.status ? { status: req.query.status } : {};
    const tickets = await Ticket.find(filter).populate("user", "name email");
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a ticket's status
// @route   PUT /api/agent/tickets/:id
// @access  Private (Agent only)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Add a comment to a ticket
// @route   POST /api/agent/tickets/:id/comments
// @access  Private (Agent only)
exports.addComment = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    const newComment = new Comment({
      text: req.body.text,
      user: req.user.id, // Agent's ID from protectAgent middleware
      ticket: req.params.id,
    });

    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
