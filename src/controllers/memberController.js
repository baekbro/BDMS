const pool = require('../config/db'); // DB 연결 설정

// 1. 회원 등록 (Create Member)
exports.createMember = async (req, res) => {
  try {
    const {
      name, 
      phone, 
      birth_date, 
      height, 
      weight, 
      locker_number, 
      use_clothes,
      // 금액 관련 필드
      membership_fee, 
      locker_fee, 
      clothes_fee,
      membership_months
    } = req.body;

    // [에러 해결 핵심] 빈 문자열('')이 들어오면 NULL로 변환
    // DB의 숫자형(Decimal, Int) 컬럼에 ''를 넣으면 에러가 나기 때문입니다.
    const finalHeight = height === '' ? null : height;
    const finalWeight = weight === '' ? null : weight;
    const finalLocker = locker_number === '' ? null : locker_number;
    const finalBirth = birth_date === '' ? null : birth_date;

    // 2. 금액 계산 (입력 없으면 0으로 처리)
    const mFee = parseInt(membership_fee) || 0;
    const lFee = parseInt(locker_fee) || 0;
    const cFee = parseInt(clothes_fee) || 0;
    const total_amount = mFee + lFee + cFee;

    // 3. 종료일 계산 로직
    const today = new Date();
    const monthsToAdd = parseInt(membership_months) || 1; 
    today.setMonth(today.getMonth() + monthsToAdd);
    // MySQL DATETIME 포맷으로 변환 (YYYY-MM-DD HH:mm:ss)
    const membership_end_date = today.toISOString().slice(0, 19).replace('T', ' ');

    // 4. SQL 쿼리 작성
    const sql = `
      INSERT INTO members 
      (name, phone, birth_date, height, weight, locker_number, use_clothes, membership_fee, locker_fee, clothes_fee, total_amount, membership_end_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 5. 값 배열 (변환된 변수 사용)
    const values = [
      name, 
      phone, 
      finalBirth, 
      finalHeight, // 빈 문자열 처리된 값
      finalWeight, // 빈 문자열 처리된 값
      finalLocker, // 빈 문자열 처리된 값
      use_clothes,
      mFee, 
      lFee, 
      cFee, 
      total_amount, 
      membership_end_date
    ];

    // 6. DB 실행
    const [result] = await pool.query(sql, values);

    return res.status(201).json({ 
      success: true, 
      message: '회원 등록이 완료되었습니다.',
      memberId: result.insertId 
    });

  } catch (error) {
    // 중복된 전화번호 에러 처리
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: '이미 등록된 전화번호입니다. 번호를 확인해주세요.' 
      });
    }

    console.error('회원가입 에러:', error);
    return res.status(500).json({ 
      success: false, 
      message: '서버 내부 오류가 발생했습니다.' 
    });
  }
};

// 2. 관리자 로그인 (Login)
exports.login = async (req, res) => {
  try {
    const { id, password } = req.body; 

    // admins 테이블 조회 (테이블명이 다르면 수정 필요)
    const sql = 'SELECT * FROM admins WHERE id = ? AND password = ?';
    const [rows] = await pool.query(sql, [id, password]);

    if (rows.length > 0) {
      // 로그인 성공
      return res.status(200).json({
        success: true,
        message: '로그인 성공',
        token: 'admin-dummy-token', // 임시 토큰
        admin: rows[0]
      });
    } else {
      // 로그인 실패
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 일치하지 않습니다.'
      });
    }
  } catch (error) {
    console.error('로그인 에러:', error);
    return res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
};

exports.getMembers = async (req, res) => {
  try {
    // 최신 가입순(DESC)으로 정렬해서 가져오기
    const sql = 'SELECT * FROM members ORDER BY id DESC';
    const [rows] = await pool.query(sql);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('회원 목록 조회 실패:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// memberController.js 맨 아래에 추가

// 4. 회원 기간 연장 (Update)
exports.extendMember = async (req, res) => {
  try {
    const { id } = req.params; // URL에서 회원 ID 가져옴
    const { months, payment_amount } = req.body; // 추가할 개월 수, 결제 금액

    // 1. 해당 회원의 현재 만료일 조회
    const [rows] = await pool.query('SELECT membership_end_date FROM members WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '회원을 찾을 수 없습니다.' });
    }

    const currentEndDate = new Date(rows[0].membership_end_date);
    const today = new Date();
    
    // 2. 날짜 계산 로직
    // 만약 이미 만료된 회원이라면 '오늘'부터 시작, 아니라면 '기존 만료일'에서 연장
    let newBaseDate = currentEndDate < today ? today : currentEndDate;
    
    // 개월 수 더하기
    newBaseDate.setMonth(newBaseDate.getMonth() + parseInt(months));
    const newEndDate = newBaseDate.toISOString().slice(0, 19).replace('T', ' ');

    // 3. DB 업데이트
    // (참고: 대시보드 매출 반영을 위해 total_amount도 누적하고 싶다면 total_amount = total_amount + ? 로 수정 가능)
    const sql = `
      UPDATE members 
      SET membership_end_date = ? 
      WHERE id = ?
    `;

    await pool.query(sql, [newEndDate, id]);

    return res.status(200).json({ 
      success: true, 
      message: `${months}개월 연장이 완료되었습니다.` 
    });

  } catch (error) {
    console.error('기간 연장 에러:', error);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};