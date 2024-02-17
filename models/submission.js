const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubmissionSchema = new Schema({
  name: String,
  facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  score: { type: Number, required: true },
  reviewStatus: { type: String, default: 'Pending' },
  reviewComment: { type: String },
  inputData: { type: Schema.Types.Mixed },
});

module.exports = mongoose.model('Submission', SubmissionSchema);
