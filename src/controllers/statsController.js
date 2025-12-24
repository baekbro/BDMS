const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // 1. [수정됨] 이번 달 총 매출 (기준을 만료일 -> 가입일로 변경)
    // created_at이 결제 시점이므로 이때 매출로 잡아야 합니다.
    const [revenueResult] = await pool.query(`
      SELECT SUM(total_amount) as total 
      FROM members 
      WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
    `, [currentMonth, currentYear]);

    // 2. 현재 이용중인 회원 수 (여기는 만료일 기준이 맞음)
    const [activeResult] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM members 
      WHERE membership_end_date > NOW()
    `);

    // 3. 이달의 신규 회원 수 (가입일 기준)
    const [newMemberResult] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM members 
      WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
    `, [currentMonth, currentYear]);

    // 4. 매출 상세 분석 (가입일 기준)
    const [categoryResult] = await pool.query(`
      SELECT 
        SUM(membership_fee) as membership,
        SUM(locker_fee) as locker,
        SUM(clothes_fee) as clothes
      FROM members 
      WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
    `, [currentMonth, currentYear]);

    const revenueByCategory = {
      MEMBERSHIP: parseInt(categoryResult[0].membership) || 0,
      LOCKER: parseInt(categoryResult[0].locker) || 0,
      CLOTHES: parseInt(categoryResult[0].clothes) || 0
    };

    // 5. 응답
    res.json({
      month: currentMonth,
      // null이면 0원으로 표시
      totalRevenue: parseInt(revenueResult[0].total) || 0,
      activeMembers: activeResult[0].count,
      newMembers: newMemberResult[0].count,
      revenueByCategory: revenueByCategory
    });

  } catch (error) {
    console.error('대시보드 통계 에러:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// statsController.js 맨 아래에 추가

// 2. 월별 히스토리 조회 (매출 or 회원수)
exports.getMonthlyHistory = async (req, res) => {
  try {
    const { type } = req.query; // 프론트에서 'revenue'(매출) 또는 'member'(회원)를 보냄
    let sql = '';

    if (type === 'revenue') {
      // 월별 총 매출 조회 (YYYY-MM 형식으로 그룹화)
      sql = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_amount) as value 
        FROM members 
        GROUP BY month 
        ORDER BY month DESC
      `;
    } else {
      // 월별 신규 회원 수 조회
      sql = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as value 
        FROM members 
        GROUP BY month 
        ORDER BY month DESC
      `;
    }

    const [rows] = await pool.query(sql);
    res.json(rows);

  } catch (error) {
    console.error('월별 기록 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};