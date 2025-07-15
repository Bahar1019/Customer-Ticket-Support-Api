const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/agent', require('./routes/agentRoutes'));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('AI Ticketing System API is running!');
});

// Define the port
const PORT = process.env.PORT || 5000;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to the database and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // ===== ACTIVATE THE WORKER =====
    const { processTicket } = require('./worker');
    // Run the worker every 15 seconds
    setInterval(processTicket, 15000);
    // ===============================
  });
});