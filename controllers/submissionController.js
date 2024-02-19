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

exports.getCompletedForms = asyncHandler(async (req, res, next) => {
  try {
    const count = await Submission.countDocuments({
      categoryId: req.body.categoryId,
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error });
  }
});
