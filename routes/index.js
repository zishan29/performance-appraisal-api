const express = require('express');
const passport = require('passport');
const multer = require('multer');
const userController = require('../controllers/userController');
const submissionController = require('../controllers/submissionController');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post(
  '/submissions',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  submissionController.addSubmission,
);

router.post('/verifyToken', userController.verifyToken);

router.get(
  '/userDetails',
  passport.authenticate('jwt', { session: false }),
  userController.getUserDetails,
);

router.post(
  '/updateUserDetails',
  passport.authenticate('jwt', { session: false }),
  userController.updateUserDetails,
);

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

router.put(
  '/submission',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  submissionController.editSubmission,
);

module.exports = router;
