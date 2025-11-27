const express = require('express');
const router = express.Router();
const { Challenge } = require('../models'); 

// 1. 모든 챌린지 가져오기 (GET)
router.get('/', async (req, res) => {
  try {
    // SELECT * FROM Challenges;
    const challenges = await Challenge.findAll({
      order: [['createdAt', 'DESC']] // 최신순 정렬
    });
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

// 2. 챌린지 추가하기 (POST)
router.post('/', async (req, res) => {
  const { title, category, tags, img } = req.body;

  try {
    // INSERT INTO Challenges (...) VALUES (...);
    const newChallenge = await Challenge.create({
      title,
      category,
      participants: 1,
      tags, // JSON 타입으로 자동 변환되어 저장됨
      img
    });
    res.status(201).json(newChallenge);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: '데이터 저장 실패' });
  }
});

module.exports = router;