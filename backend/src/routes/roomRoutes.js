const express = require('express');
const router = express.Router();
const { getRooms, getAvailableRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRooms)
  .post(protect, admin, createRoom);

router.get('/available', protect, getAvailableRooms);

router.route('/:id')
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

module.exports = router;