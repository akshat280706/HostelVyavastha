const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, warden, admin } = require('../middleware/authMiddleware');

// Student routes
router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);

// Staff routes
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, warden, updateComplaint);
router.delete('/:id', protect, admin, deleteComplaint);

module.exports = router;