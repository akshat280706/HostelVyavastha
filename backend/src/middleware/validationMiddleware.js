const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('hostel').notEmpty().withMessage('Hostel is required'),
    validateRequest
  ],
  
  login: [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    validateRequest
  ],
  
  update: [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
    body('roomNumber').optional().trim(),
    validateRequest
  ]
};

// Room validation rules
const roomValidation = {
  create: [
    body('roomNumber').notEmpty().withMessage('Room number required'),
    body('capacity').isInt({ min: 1, max: 6 }).withMessage('Capacity must be between 1-6'),
    body('type').isIn(['AC', 'Non-AC']).withMessage('Type must be AC or Non-AC'),
    body('price').isNumeric().withMessage('Price must be a number'),
    validateRequest
  ]
};

// Complaint validation rules
const complaintValidation = {
  create: [
    body('title').notEmpty().withMessage('Title required').trim(),
    body('description').notEmpty().withMessage('Description required').isLength({ min: 10 }),
    body('type').isIn(['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Food', 'Internet', 'Others']),
    validateRequest
  ],
  
  update: [
    body('status').optional().isIn(['pending', 'in-progress', 'resolved', 'rejected']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    validateRequest
  ]
};

// Leave validation rules
const leaveValidation = {
  create: [
    body('fromDate').isISO8601().withMessage('Valid from date required'),
    body('toDate').isISO8601().withMessage('Valid to date required'),
    body('reason').notEmpty().withMessage('Reason required').isLength({ min: 10 }),
    body('leaveType').isIn(['casual', 'medical', 'emergency', 'vacation']),
    validateRequest
  ],
  
  update: [
    body('status').optional().isIn(['pending', 'approved', 'rejected', 'cancelled']),
    body('rejectionReason').optional().isLength({ min: 5 }),
    validateRequest
  ]
};

// Attendance validation
const attendanceValidation = {
  mark: [
    body('studentId').notEmpty().withMessage('Student ID required'),
    body('status').isIn(['present', 'absent', 'late', 'half-day']),
    body('checkInTime').optional(),
    validateRequest
  ]
};

// Notice validation
const noticeValidation = {
  create: [
    body('title').notEmpty().withMessage('Title required'),
    body('content').notEmpty().withMessage('Content required'),
    body('category').optional().isIn(['general', 'emergency', 'event', 'maintenance', 'academic']),
    validateRequest
  ]
};

// Fee validation
const feeValidation = {
  create: [
    body('studentId').notEmpty().withMessage('Student ID required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('month').notEmpty().withMessage('Month required'),
    body('year').isInt({ min: 2020, max: 2030 }),
    validateRequest
  ]
};

module.exports = {
  userValidation,
  roomValidation,
  complaintValidation,
  leaveValidation,
  attendanceValidation,
  noticeValidation,
  feeValidation,
  validateRequest
};