const express = require('express');
const router = express.Router();
const { createNotice, getNotices, getNoticeById, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, warden, admin } = require('../middleware/authMiddleware');
const { noticeValidation } = require('../middleware/validationMiddleware');

router.post('/', protect, warden, createNotice);
router.get('/', protect, getNotices);
router.get('/:id', protect, getNoticeById);
router.put('/:id', protect, warden, updateNotice);
router.delete('/:id', protect, admin, deleteNotice);

module.exports = router;