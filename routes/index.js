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

router.post('/verifyToken', userController.verifyToken);

router.get(
  '/categories',
  passport.authenticate('jwt', { session: false }),
  categoryController.getAllCategories,
);

router.get(
  '/userProgress',
  passport.authenticate('jwt', { session: false }),
  userController.getUserProgress,
);

router.get(
  '/userScores',
  passport.authenticate('jwt', { session: false }),
  userController.getUserScores,
);

router.get(
  '/submission',
  passport.authenticate('jwt', { session: false }),
  submissionController.getSubmission,
);

module.exports = router;
