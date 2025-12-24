const pool = require('../config/db');

exports.checkIn = async (req, res) => {
    try {
        const { phone } = req.body; // 프론트에서 전화번호(010-xxxx-xxxx)를 보냄

        // 1. 회원 조회 (만료일도 같이 가져옴)
        const [users] = await pool.query(
            'SELECT id, name, membership_end_date, locker_number FROM members WHERE phone = ?',
            [phone]
        );

        // 회원이 없는 경우
        if (users.length === 0) {
            return res.status(404).json({ message: '등록되지 않은 회원입니다.' });
        }

        const user = users[0];
        const today = new Date();
        const endDate = new Date(user.membership_end_date);

        // 2. 만료일 체크
        // 오늘 날짜가 만료일보다 크다면? -> 입장 불가
        if (today > endDate) {
            // 실패 로그도 남길지, 그냥 리턴할지는 선택 (여기선 리턴만)
            return res.status(400).json({ 
                message: '회원권이 만료되었습니다.', 
                name: user.name,
                endDate: user.membership_end_date 
            });
        }

        // 3. 출석 로그 기록 (성공)
        await pool.query(
            'INSERT INTO attendance_logs (member_id, status) VALUES (?, ?)',
            [user.id, 'SUCCESS']
        );

        // 4. 성공 응답 (프론트에서 "XXX님 환영합니다! (남은기간: N일)" 띄우기 위함)
        // 남은 일수 계산
        const diffTime = Math.abs(endDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        res.status(200).json({
            message: '출석 확인되었습니다.',
            name: user.name,
            locker: user.locker_number, // "사물함 10번 쓰세요" 안내용
            daysLeft: diffDays
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};