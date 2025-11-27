const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// 1. 회원가입 (기존 코드)
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, nickname });
    res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

// ★ 2. 로그인 (새로 추가된 코드!)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 유저 찾기
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
    }

    // 비밀번호 확인 (DB의 암호화된 비번과 비교)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 로그인 성공! (비밀번호 제외하고 닉네임과 이메일만 반환)
    res.json({
      message: '로그인 성공',
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

module.exports = router;