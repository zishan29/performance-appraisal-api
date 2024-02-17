const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const Category = require('../models/category');

exports.signup = [
  body('firstName').custom(async (firstName) => {
    if (!firstName || firstName.length < 3) {
      throw new Error('firstName is too short');
    }
    return true;
  }),
  body('lastName').custom(async (lastName) => {
    if (!lastName || lastName.length < 3) {
      throw new Error('lastName is too short');
    }
    return true;
  }),
  body('email').custom(async (email) => {
    const userWithEmail = await User.findOne({ email });

    if (userWithEmail) {
      throw new Error('Email already in use');
    }
  }),
  body('password').isLength({ min: 5 }).withMessage('Password is too short'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((error) => {
        const { path, msg } = error;
        if (!errorMessages[path]) {
          errorMessages[path] = [];
        }
        errorMessages[path].push(msg);
      });

      res.status(400).json({ errors: errorMessages });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      try {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          userType: req.body.userType,
          department: req.body.department,
          position: req.body.position,
        });
        await newUser.save();
        const token = jwt.sign({ newUser }, process.env.SECRET_KEY, {
          expiresIn: '1d',
        });
        if (req.body.userType !== 'admin') {
          const AI = new Category({
            name: 'Administrative Bucket',
            facultyId: newUser._id, // Save user ID here
            totalForms: 7,
            maxScore: 2000,
          });
          await AI.save();
        }
        res
          .status(200)
          .json({ message: 'User created successfully', newUser, token });
      } catch (err) {
        res.status(400).json({ err });
      }
    }
  }),
];

exports.login = asyncHandler(async (req, res, next) => {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        res.status(403).json({
          info,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          next(err);
        }
        const userData = {
          _id: user._id,
          userType: user.userType,
        };
        const token = jwt.sign({ user: userData }, process.env.SECRET_KEY, {
          expiresIn: '1d',
        });

        res.status(200).json({ userData, token });
      });
    })(req, res, next);
  } catch (err) {
    res.status(403).json({
      err,
    });
  }
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    const { user } = req;

    res.status(200).json({ message: 'Token is valid', user });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
});
