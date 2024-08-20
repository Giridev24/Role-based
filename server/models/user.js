// orderModel.js
const mongoose = require('mongoose');

// Define the Mongoose schema for orders
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userrole:{
    type: String,
    required: true
  }
});

// Create the Mongoose model
const User = mongoose.model('User', userSchema);

// Export the Order model
module.exports = User;
