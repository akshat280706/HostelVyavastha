const express = require('express');
const router = express.Router();
const { applyLeave, getLeaves, getLeaveById, updateLeaveStatus, deleteLeave } = require('../controllers/leaveController');
const { protect, warden } = require('../middleware/authMiddleware');
const { leaveValidation } = require('../middleware/validationMiddleware');

router.post('/', protect, leaveValidation.create, applyLeave);
router.get('/', protect, getLeaves);
router.get('/:id', protect, getLeaveById);
router.put('/:id/status', protect, warden, updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

module.exports = router;