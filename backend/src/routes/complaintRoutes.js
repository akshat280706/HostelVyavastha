const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect, warden, admin } = require('../middleware/authMiddleware');
const { complaintValidation } = require('../middleware/validationMiddleware');

router.post('/', protect, complaintValidation.create, createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, warden, updateComplaint);
router.delete('/:id', protect, admin, deleteComplaint);

module.exports = router;