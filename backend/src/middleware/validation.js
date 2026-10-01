const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('email').isEmail().withMessage('Invalid email format.'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters long.')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least 1 uppercase letter and 1 special character.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const validatePasswordChange = [
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters long.')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least 1 uppercase letter and 1 special character.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = { validateRegister, validatePasswordChange };