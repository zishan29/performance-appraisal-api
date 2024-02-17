const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String,
  facultyId: String,
  completedForms: { type: Number, default: 0 },
  totalForms: Number,
  maxScore: Number,
  remark: { type: String },
});

module.exports = mongoose.model('Category', CategorySchema);
