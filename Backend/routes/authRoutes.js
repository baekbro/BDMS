const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // 암호화 도구
const { User } = require('../models');

// 회원가입 (POST /api/auth/signup)
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    // 1. 이메일 중복 체크
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }

    // 2. 비밀번호 암호화 (Salt 사용)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. DB 저장
    await User.create({
      email,
      password: hashedPassword, // 암호화된 비번 저장
      nickname
    });

    res.status(201).json({ message: '회원가입 성공!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

module.exports = router;