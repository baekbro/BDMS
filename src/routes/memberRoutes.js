// src/routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// POST /api/members 주소로 요청이 오면 createMember 함수 실행
router.post('/', memberController.createMember);
router.get('/', memberController.getMembers);
router.put('/:id/extend', memberController.extendMember);

module.exports = router;