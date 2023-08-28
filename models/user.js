// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Schema definition
});

const User = mongoose.model('User', userSchema);

module.exports = User;
