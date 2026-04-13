const express = require('express');
const router = express.Router();
const { getStudents, getUserById, updateUser, deleteUser, getUserStats } = require('../controllers/userController');
const { protect, admin, warden } = require('../middleware/authMiddleware');

router.get('/students', protect, warden, getStudents);
router.get('/stats', protect, admin, getUserStats);
router.get('/:id', protect, warden, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;