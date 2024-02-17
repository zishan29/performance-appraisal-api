const mongoose = require('mongoose');

const { Schema } = mongoose;

const FormSchema = new Schema({
  form_id: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  marks: { type: Number, default: 0 },
  remark: { type: String },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Form', FormSchema);
