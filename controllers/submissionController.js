const asyncHandler = require('express-async-handler');
const Submission = require('../models/submission');

exports.addSubmission = asyncHandler(async (req, res, next) => {
  try {
    const newSubmission = new Submission({
      name: req.body.submissionName,
      facultyId: req.user._id,
      categoryId: req.body.categoryId,
      score: req.body.score,
      inputData: req.body.inputData,
    });
    await newSubmission.save();
    res.status(200).json({ message: 'New submission created successfully' });
  } catch (err) {
    res.status(400).json({ err });
  }
});

exports.getSubmission = asyncHandler(async (req, res, next) => {
  try {
    const submission = await Submission.find({ name: req.body.name });
    res.status(200).json({ submission });
  } catch (err) {
    res.status(400).json({ err });
  }
});
