const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find({
      facultyId: req.user._id,
    });
    res.status(200).json({ categories });
  } catch (err) {
    res.status(400).json({ err });
  }
});
