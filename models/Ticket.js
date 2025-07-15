const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title for the ticket'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
  },
  status: {
    type: String,
    enum: ['New', 'Open', 'Processing', 'Resolved'],
    default: 'New',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This creates the relationship
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Ticket', TicketSchema);