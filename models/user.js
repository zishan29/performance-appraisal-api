const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  profilePicture: { type: String },
  department: { type: String },
  position: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
