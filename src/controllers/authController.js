// src/controllers/authController.js
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'secret_key_gym_check'; // 실무에선 .env에 넣어야 함

// 로그인 처리
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. ID 확인
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
        const admin = rows[0];

        if (!admin) {
            return res.status(401).json({ message: '존재하지 않는 ID입니다.' });
        }

        // 2. 비밀번호 확인 (DB 해시값 vs 입력값 비교)
        // 주의: 현재 DB에 해시된 비번이 없다면 이 부분에서 에러가 날 수 있습니다.
        // 테스트를 위해 '임시'로 평문 비교 코드를 주석으로 넣어둘게요.
        
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        // const isMatch = (password === admin.password_hash); // (임시: 평문 저장시 사용)

        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
        }

        // 3. 토큰 발급 (JWT)
        const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '12h' });

        res.json({ message: '로그인 성공', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// (최초 1회용) 관리자 계정 생성 API - 이걸로 'admin/1234'를 만드세요!
exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hash]);
    res.json({ message: '관리자 생성 완료' });
};