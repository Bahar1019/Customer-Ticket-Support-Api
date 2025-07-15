const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path if necessary

// Load env vars
dotenv.config();


// Add these debug lines
console.log('=== DEBUGGING ENV VARS ===');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('MONGODB_URL:', process.env.MONGODB_URL);
console.log('All env keys:', Object.keys(process.env).filter(key => key.includes('MONGO')));
console.log('=== END DEBUG ===');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createAgent = async () => {
  await connectDB();

  try {
    // Check if agent already exists
    const existingAgent = await User.findOne({ email: 'agent@support.com' });
    if (existingAgent) {
      console.log('Agent user already exists.');
      mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('agentpassword123', salt);

    // Create the agent user
    const agent = new User({
      name: 'Support Agent',
      email: 'agent@support.com',
      password: hashedPassword,
      role: 'agent', // Explicitly set the role
    });

    await agent.save();
    console.log('Agent user created successfully!');
  } catch (error) {
    console.error('Error creating agent user:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the function
createAgent();