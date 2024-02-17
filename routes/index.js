const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const submissionController = require('../controllers/submissionController');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post(
  '/submissions',
  passport.authenticate('jwt', { session: false }),
  submissionController.addSubmission,
);

router.get(
  '/categories',
  passport.authenticate('jwt', { session: false }),
  categoryController.getAllCategories,
);

module.exports = router;
