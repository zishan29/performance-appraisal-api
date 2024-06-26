const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const Submission = require('../models/submission');

exports.addSubmission = asyncHandler(async (req, res) => {
  let fileUrl;

  if (req.file) {
    try {
      const uniqueIdentifier = uuidv4();

      const imageBuffer = req.file.buffer.toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${imageBuffer}`,
        {
          public_id: uniqueIdentifier,
          folder: 'PerformanceAppraisal/certificates/',
        },
      );

      fileUrl = result.secure_url;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }

  try {
    const newSubmission = new Submission({
      name: req.body.submissionName,
      facultyId: req.user._id,
      categoryId: req.body.categoryId,
      score: req.body.score,
      inputData: req.body.inputData,
      evidence: fileUrl,
    });
    await newSubmission.save();
    res.status(200).json({ message: 'New submission created successfully' });
  } catch (err) {
    res.status(400).json({ err });
  }
});

exports.getSubmission = asyncHandler(async (req, res) => {
  try {
    const submission = await Submission.findOne({
      name: req.query.name,
      facultyId: req.query.userId,
    });
    res.status(200).json(submission);
  } catch (err) {
    res.status(400).json({ err });
  }
});

exports.editSubmission = async (req, res) => {
  let fileUrl;

  if (req.file) {
    try {
      const uniqueIdentifier = uuidv4();

      const imageBuffer = req.file.buffer.toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${imageBuffer}`,
        {
          public_id: uniqueIdentifier,
          folder: 'PerformanceAppraisal/certificates/',
        },
      );

      fileUrl = result.secure_url;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }

  const newSubmission = {
    name: req.body.submissionName,
    facultyId: req.user._id,
    categoryId: req.body.categoryId,
    score: req.body.score,
    inputData: req.body.inputData,
    evidence: fileUrl,
  };

  Submission.findOneAndUpdate(
    { name: req.body.submissionName },
    newSubmission,
    { new: true, omitUndefined: true, runValidators: true },
  )
    .then((updateSubmission) => {
      if (updateSubmission) {
        res.status(200).json({ message: 'Submission updated successfully' });
      } else {
        res.status(404).json({ message: 'Submission not found' });
      }
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};
