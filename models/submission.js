const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubmissionSchema = new Schema({
  name: String,
  facultyId: { type: String, required: true },
  categoryId: { type: String, required: true },
  score: { type: Number, required: true },
  reviewStatus: { type: String, default: 'Pending' },
  reviewComment: { type: String },
});

module.exports = mongoose.model('Submission', SubmissionSchema);
