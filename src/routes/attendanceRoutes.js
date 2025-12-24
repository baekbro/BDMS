const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST /api/attendance/check-in
router.post('/check-in', attendanceController.checkIn);

module.exports = router;