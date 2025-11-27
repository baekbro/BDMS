const express = require('express');
const router = express.Router();
const { Challenge } = require('../models'); 

router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.findAll({
      order: [['createdAt', 'DESC']] 
    });
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

router.post('/', async (req, res) => {
  const { title, category, tags, img } = req.body;

  try {
    const newChallenge = await Challenge.create({
      title,
      category,
      participants: 1,
      tags, 
      img
    });
    res.status(201).json(newChallenge);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: '데이터 저장 실패' });
  }
});

module.exports = router;