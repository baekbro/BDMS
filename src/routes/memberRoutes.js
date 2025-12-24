// src/routes/memberRoutes.js

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// 1. 회원가입
router.post('/', memberController.createMember);

// 2. 회원 목록 조회
router.get('/', memberController.getMembers);

// 3. 기간 연장
router.put('/:id/extend', memberController.extendMember);

// 4. ★ 관리자 로그인 (이게 빠져있었을 수 있음)
// 주의: 이 경우 프론트엔드에서 '/api/members/login'으로 요청해야 함.
// 만약 프론트가 '/api/login'을 쓴다면 1단계(server.js 수정) 방법을 쓰세요.
router.post('/login', memberController.login);

module.exports = router;