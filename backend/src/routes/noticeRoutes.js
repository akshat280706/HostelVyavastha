const express = require('express');
const router = express.Router();
const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect, warden, admin } = require('../middleware/authMiddleware');

router.post('/', protect, warden, createNotice);
router.get('/', getNotices);
router.get('/:id', getNoticeById);
router.put('/:id', protect, warden, updateNotice);
router.delete('/:id', protect, admin, deleteNotice);

module.exports = router;