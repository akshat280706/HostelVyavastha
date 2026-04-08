const express = require('express');
const router = express.Router();
const { getStudents, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin, warden } = require('../middleware/authMiddleware');

router.route('/students')
  .get(protect, warden, getStudents);

router.route('/:id')
  .get(protect, warden, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;