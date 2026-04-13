const { body, validationResult } = require('express-validator');

// ================= VALIDATION RESULT =================
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


// ================= USER =================
const userValidation = {
  register: [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').notEmpty(),
    body('hostel').notEmpty(),
    validateRequest
  ],

  login: [
    body('email').isEmail(),
    body('password').notEmpty(),
    validateRequest
  ]
};


// ================= ROOM =================
const roomValidation = {
  create: [
    body('roomNumber').notEmpty(),
    body('capacity').isInt({ min: 1, max: 6 }),
    body('type').isIn(['AC', 'Non-AC']),
    body('price').isNumeric(),
    validateRequest
  ]
};


// ================= COMPLAINT =================
const complaintValidation = {
  create: [
    body('title').notEmpty(),
    body('description').isLength({ min: 10 }),
    body('type').isIn(['Plumbing','Electrical','Furniture','Cleaning','Food','Internet','Others']),
    validateRequest
  ]
};


// ================= ATTENDANCE =================
const attendanceValidation = {
  mark: [
    body('studentId').notEmpty(),
    body('status').isIn(['present','absent','late','half-day']),
    validateRequest
  ]
};


// ================= LEAVE =================
const leaveValidation = {
  create: [
    body('fromDate').isISO8601(),
    body('toDate').isISO8601(),
    body('reason').isLength({ min: 10 }),
    body('leaveType').isIn(['casual','medical','emergency','vacation']),
    validateRequest
  ]
};


module.exports = {
  userValidation,
  roomValidation,
  complaintValidation,
  attendanceValidation,
  leaveValidation,
  validateRequest
};

// const { body, validationResult } = require('express-validator');

// // Check validation results
// const validateRequest = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array(),
//       message: 'Validation failed'
//     });
//   }
//   next();
// };

// // User validations
// const userValidation = {
//   register: [
//     body('name').notEmpty().withMessage('Name is required').trim(),
//     body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//     body('phone').notEmpty().withMessage('Phone number required'),
//     body('hostel').notEmpty().withMessage('Hostel required'),
//     validateRequest
//   ],
  
//   login: [
//     body('email').isEmail().withMessage('Valid email required'),
//     body('password').notEmpty().withMessage('Password required'),
//     validateRequest
//   ],
  
//   update: [
//     body('name').optional().trim(),
//     body('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
//     body('roomNumber').optional(),
//     validateRequest
//   ]
// };

// // Room validations
// const roomValidation = {
//   create: [
//     body('roomNumber').notEmpty().withMessage('Room number required'),
//     body('capacity').isInt({ min: 1, max: 6 }).withMessage('Capacity must be 1-6'),
//     body('type').isIn(['AC', 'Non-AC']).withMessage('Type must be AC or Non-AC'),
//     body('price').isNumeric().withMessage('Price must be a number'),
//     validateRequest
//   ]
// };

// // Complaint validations
// const complaintValidation = {
//   create: [
//     body('title').notEmpty().withMessage('Title required').trim(),
//     body('description').notEmpty().withMessage('Description required').isLength({ min: 10 }),
//     body('type').isIn(['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Food', 'Internet', 'Others']),
//     validateRequest
//   ],
  
//   update: [
//     body('status').optional().isIn(['pending', 'in-progress', 'resolved', 'rejected']),
//     body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
//     validateRequest
//   ]
// };

// // Attendance validations
// const attendanceValidation = {
//   mark: [
//     body('studentId').notEmpty().withMessage('Student ID required'),
//     body('status').isIn(['present', 'absent', 'late', 'half-day']),
//     validateRequest
//   ]
// };

// // Notice validations
// const noticeValidation = {
//   create: [
//     body('title').notEmpty().withMessage('Title required'),
//     body('content').notEmpty().withMessage('Content required'),
//     body('category').optional().isIn(['general', 'emergency', 'event', 'maintenance', 'academic']),
//     validateRequest
//   ]
// };

// // Leave validations
// const leaveValidation = {
//   create: [
//     body('fromDate').isISO8601().withMessage('Valid from date required'),
//     body('toDate').isISO8601().withMessage('Valid to date required'),
//     body('reason').notEmpty().withMessage('Reason required').isLength({ min: 10 }),
//     body('leaveType').isIn(['casual', 'medical', 'emergency', 'vacation']),
//     validateRequest
//   ]
// };

// module.exports = {
//   userValidation,
//   roomValidation,
//   complaintValidation,
//   attendanceValidation,
//   noticeValidation,
//   leaveValidation,
//   validateRequest
// };