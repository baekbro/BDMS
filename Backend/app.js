const express = require('express');
const cors = require('cors');
const db = require('./models'); 
require('dotenv').config();

const challengeRoutes = require('./routes/challengeRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://127.0.0.1:8080', // 리액트 주소
  credentials: true // 쿠키/세션 허용
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ MySQL DB Connected & Tables Synced');
  })
  .catch((err) => {
    console.error('❌ DB Error:', err);
  });

app.use('/api/challenges', challengeRoutes);
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});