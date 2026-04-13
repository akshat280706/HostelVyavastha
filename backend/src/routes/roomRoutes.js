const express = require('express');
const router = express.Router();
const { getRooms, getAvailableRooms, getRoomById, createRoom, updateRoom, deleteRoom, assignStudent } = require('../controllers/roomController');
const { protect, admin, warden } = require('../middleware/authMiddleware');
const { roomValidation } = require('../middleware/validationMiddleware');

router.get('/', protect, getRooms);
router.get('/available', protect, getAvailableRooms);
router.get('/:id', protect, getRoomById);
router.post('/', protect, admin, roomValidation.create, createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);
router.post('/:id/assign', protect, warden, assignStudent);

module.exports = router;