const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Registration validation rules
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
    
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
    
  body('incomeBracket')
    .optional()
    .isIn(['0-25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', '150k+'])
    .withMessage('Invalid income bracket'),
    
  handleValidationErrors
];

// Login validation rules
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

// Profile update validation rules
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
    
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),
    
  body('incomeBracket')
    .optional()
    .isIn(['0-25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', '150k+'])
    .withMessage('Invalid income bracket'),
    
  body('profile.businessType')
    .optional()
    .isIn(['freelancer', 'consultant', 'contractor', 'small-business', 'other'])
    .withMessage('Invalid business type'),
    
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  handleValidationErrors
};
