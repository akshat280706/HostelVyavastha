const express = require('express');
const router = express.Router();
const { createFee, getFees, getFeeById, updateFee, deleteFee, getStudentFeeSummary } = require('../controllers/feeController');
const { protect, admin, warden } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createFee);
router.get('/', protect, getFees);
router.get('/student/:studentId/summary', protect, warden, getStudentFeeSummary);
router.get('/:id', protect, getFeeById);
router.put('/:id', protect, admin, updateFee);
router.delete('/:id', protect, admin, deleteFee);

module.exports = router;