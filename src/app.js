// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 라우트 파일 불러오기
const memberRoutes = require('./routes/memberRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes')
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// 라우트 등록 (미들웨어)
// 이제 '/api/members'로 시작하는 주소는 memberRoutes 파일로 보냄
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Gym Management Server Running...');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});