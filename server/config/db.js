const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Make sure your MONGO_URI in .env is correct.');
    console.error('For Atlas: mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/attendance-tracker');
    process.exit(1);
  }
};

module.exports = connectDB;
