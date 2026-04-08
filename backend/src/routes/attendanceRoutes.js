const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');
const { protect, warden, admin } = require('../middleware/authMiddleware');

router.post('/mark', protect, warden, markAttendance);
router.get('/', protect, getAttendance);
router.get('/student/:studentId', protect, warden, getStudentAttendance);
router.put('/:id', protect, warden, updateAttendance);
router.delete('/:id', protect, admin, deleteAttendance);

module.exports = router;