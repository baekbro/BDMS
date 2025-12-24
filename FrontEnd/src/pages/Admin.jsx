import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 모달 상태 (열림/닫힘)
  const [showModal, setShowModal] = useState(false);

  // 회원 등록 폼 데이터 (금액 부분 수정됨)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birth_date: '',
    height: '',
    weight: '',
    locker_number: '',
    use_clothes: false,
    register_months: 1,
    // [수정] 기존 payment_amount 하나에서 3개로 분리
    membership_fee: 0,
    locker_fee: 0,
    clothes_fee: 0
  });

  // [추가] 실시간 총 결제 금액 계산
  const totalAmount = 
    Number(formData.membership_fee) + 
    Number(formData.locker_fee) + 
    Number(formData.clothes_fee);

  // 1. 초기 데이터 로드 & 로그인 체크
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('통계 로드 실패', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('관리자 로그인이 필요합니다.');
      navigate('/admin');
    } else {
      fetchStats();
    }
  }, []);

  // 2. 입력값 변경 핸들러
  // 2. 입력값 변경 핸들러 (전화번호 자동 하이픈 기능 추가)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // ★ 전화번호 입력일 경우 자동 포맷팅 로직
    if (name === 'phone') {
      // 1. 숫자만 남기기
      const onlyNums = value.replace(/[^0-9]/g, '');
      
      // 2. 길이에 따라 하이픈(-) 추가
      if (onlyNums.length <= 3) {
        newValue = onlyNums;
      } else if (onlyNums.length <= 7) {
        newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      } else {
        newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
      }

      // 3. 최대 길이 제한 (010-1234-5678 → 13자리)
      if (newValue.length > 13) {
        newValue = newValue.slice(0, 13);
      }
    }

    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // 3. 회원 등록 API 호출
  const handleRegister = async (e) => {
    e.preventDefault(); 
    
    if (!formData.name || !formData.phone) {
      alert('이름과 전화번호는 필수입니다.');
      return;
    }

    try {
      // 서버로 보낼 때 총액 등은 서버 혹은 여기서 처리
      await axios.post('/api/members', {
        ...formData,
        // 필요하다면 총액도 같이 보낼 수 있음 (백엔드 로직에 따라 다름)
        total_amount: totalAmount 
      });

      alert('✅ 회원이 성공적으로 등록되었습니다!');
      
      // 모달 닫기 & 통계 새로고침 & 폼 초기화
      setShowModal(false);
      fetchStats(); 
      setFormData({
        name: '', phone: '', birth_date: '', height: '', weight: '',
        locker_number: '', use_clothes: false, register_months: 1, 
        // 금액 초기화
        membership_fee: 0, locker_fee: 0, clothes_fee: 0
      });

    } catch (error) {
      // [수정] 중복 에러(409) 처리 추가
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message); // "이미 등록된 전화번호입니다."
      } else {
        alert('등록 실패: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div className="admin-container">Loading...</div>;

  return (

    
    <div className="admin-container">
      <div className="dashboard-header">
        <h1>📊 {stats.month}월 현황 대시보드</h1>
        <div>
            <button 
      onClick={() => navigate('/members')} 
      style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
    >
      📋 회원 전체보기
    </button>
          <button className="refresh-btn" onClick={fetchStats} style={{marginRight: '10px'}}>새로고침</button>
          <button className="refresh-btn" onClick={() => {
            localStorage.removeItem('token');
            navigate('/admin');
          }} style={{backgroundColor: '#dc3545'}}>로그아웃</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card-revenue">
          <div className="stat-title">이번 달 총 매출</div>
          <div className="stat-value">{stats.totalRevenue.toLocaleString()}원</div>
        </div>
        <div className="stat-card card-member">
          <div className="stat-title">현재 이용중인 회원</div>
          <div className="stat-value">{stats.activeMembers}명</div>
        </div>
        <div className="stat-card card-new">
          <div className="stat-title">이달의 신규 회원</div>
          <div className="stat-value">{stats.newMembers}명</div>
        </div>
      </div>

      <div className="revenue-detail">
        <h3>💰 매출 상세 분석</h3>
        <ul className="revenue-list">
          <li className="revenue-item"><span>🏋️‍♂️ 회원권 매출</span><b>{stats.revenueByCategory?.MEMBERSHIP?.toLocaleString() || 0}원</b></li>
          <li className="revenue-item"><span>🔑 사물함 이용료</span><b>{stats.revenueByCategory?.LOCKER?.toLocaleString() || 0}원</b></li>
          <li className="revenue-item"><span>👕 운동복 대여료</span><b>{stats.revenueByCategory?.CLOTHES?.toLocaleString() || 0}원</b></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <button 
          style={{ padding: '15px 30px', fontSize: '18px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          + 신규 회원 등록하기
        </button>
      </div>

      {/* ▼▼▼ 모달 (Modal) ▼▼▼ */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>📝 신규 회원 등록</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>이름 *</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="홍길동" required />
              </div>
              
              <div className="form-group">
                <label>전화번호 *</label>
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" required />
              </div>

              <div className="form-group" style={{display:'flex', gap:'10px'}}>
                <div style={{flex:1}}>
                  <label>생년월일</label>
                  <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                </div>
                <div style={{flex:1}}>
   <label>등록 개월 수</label>
   <select name="register_months" value={formData.register_months} onChange={handleChange}>
     {/* 1부터 12까지 반복해서 옵션 생성 */}
     {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
       <option key={month} value={month}>{month}개월</option>
     ))}
   </select>
</div>
              </div>

              <div className="form-group" style={{display:'flex', gap:'10px'}}>
                 <div style={{flex:1}}>
                    <label>키 (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="175.5" />
                 </div>
                 <div style={{flex:1}}>
                    <label>몸무게 (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="70.0" />
                 </div>
              </div>

              <div className="form-group">
                <label>사물함 번호 (선택)</label>
                <input type="number" name="locker_number" value={formData.locker_number} onChange={handleChange} placeholder="배정할 락커 번호" />
              </div>
              
              <div className="form-group">
                  <label>
                    <input type="checkbox" name="use_clothes" checked={formData.use_clothes} onChange={handleChange} style={{width:'auto', marginRight:'10px'}} />
                    운동복 대여 포함
                  </label>
              </div>

              {/* [수정] 금액 입력 부분 분리 */}
              <hr style={{margin: '20px 0', border: '0', borderTop: '1px solid #eee'}} />
              <h4 style={{marginBottom: '15px'}}>결제 상세 정보</h4>

              <div className="form-group">
                <label>회원권 금액 (원)</label>
                <input type="number" name="membership_fee" value={formData.membership_fee} onChange={handleChange} placeholder="0" />
              </div>

              <div className="form-group" style={{display:'flex', gap:'10px'}}>
                <div style={{flex:1}}>
                    <label>사물함 이용료</label>
                    <input type="number" name="locker_fee" value={formData.locker_fee} onChange={handleChange} placeholder="0" />
                </div>
                <div style={{flex:1}}>
                    <label>운동복 대여료</label>
                    <input type="number" name="clothes_fee" value={formData.clothes_fee} onChange={handleChange} placeholder="0" />
                </div>
              </div>

              {/* 총액 자동 계산 표시 */}
              <div style={{ 
                  background: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
              }}>
                <span style={{fontWeight: 'bold'}}>총 결제 금액:</span>
                <span style={{fontSize: '1.2em', color: '#007bff', fontWeight: 'bold'}}>
                    {totalAmount.toLocaleString()} 원
                </span>
              </div>

              <button type="submit" className="submit-btn">등록 및 결제</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;