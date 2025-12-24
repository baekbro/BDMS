const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats (대시보드 데이터 조회)
router.get('/', statsController.getDashboardStats);

module.exports = router;