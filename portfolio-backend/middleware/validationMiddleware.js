import { body, validationResult } from 'express-validator';

// This is a reusable function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Define the specific validation rules for a project
export const validateProject = [
  // Title must not be empty
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.'),

  // Description must not be empty
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.'),

  // Tags must be a string (can be empty)
  body('tags')
    .isString()
    .withMessage('Tags must be a string.'),

  // Links must be valid URLs (but are optional)
  body('github_link')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid GitHub URL.'),
    
  body('live_link')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid live link URL.'),

  // This runs after all the rules to check for errors
  handleValidationErrors
];

export const validateBlog = [
  // Title must not be empty
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.'),

  // Excerpt must not be empty
  body('excerpt')
    .trim()
    .notEmpty()
    .withMessage('An excerpt is required.'),
    
  // Content must not be empty
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Main content is required.'),

  // is_published must be a boolean value
  body('is_published')
    .isBoolean()
    .withMessage('Published status must be a boolean (true or false).'),

  // This runs after all the rules to check for errors
  handleValidationErrors
];