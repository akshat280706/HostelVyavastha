const express = require('express');
const router = express.Router();
const { getDashboardStats, getChartData } = require('../controllers/dashboardController');
const { protect, warden } = require('../middleware/authMiddleware');

router.get('/stats', protect, warden, getDashboardStats);
router.get('/charts', protect, warden, getChartData);

module.exports = router;