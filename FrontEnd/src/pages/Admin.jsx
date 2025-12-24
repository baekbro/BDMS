import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // CSS 파일이 있다면 유지

function Admin() {
  const navigate = useNavigate();
  
  // 1. 대시보드 통계 상태
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. 모달 상태 관리
  const [showModal, setShowModal] = useState(false);       // 회원 등록 모달
  const [showHistoryModal, setShowHistoryModal] = useState(false); // 히스토리 모달
  
  // 3. 히스토리 데이터 상태
  const [historyType, setHistoryType] = useState(''); // 'revenue' or 'member'
  const [historyData, setHistoryData] = useState([]);

  // 4. 회원 등록 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birth_date: '',
    height: '',
    weight: '',
    locker_number: '',
    use_clothes: false,
    register_months: 1, // 기본 1개월
    // 금액 3분할
    membership_fee: 0,
    locker_fee: 0,
    clothes_fee: 0
  });

  // 실시간 총 결제 금액 계산
  const totalAmount = 
    Number(formData.membership_fee) + 
    Number(formData.locker_fee) + 
    Number(formData.clothes_fee);

  // --- [API] 초기 통계 로드 ---
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
      navigate('/'); // 로그인 화면으로
    } else {
      fetchStats();
    }
  }, [navigate]);

  // --- [기능] 월별 히스토리 모달 열기 ---
  const openHistoryModal = async (type) => {
    try {
      // type: 'revenue' 또는 'member'
      const response = await axios.get(`/api/stats/history?type=${type}`);
      setHistoryType(type);
      setHistoryData(response.data);
      setShowHistoryModal(true);
    } catch (error) {
      console.error(error);
      alert('기록을 불러오는데 실패했습니다.');
    }
  };

  // --- [기능] 입력값 핸들러 (전화번호 자동 하이픈 포함) ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // 전화번호 자동 포맷팅 로직
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 3) {
        newValue = onlyNums;
      } else if (onlyNums.length <= 7) {
        newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      } else {
        newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
      }
      if (newValue.length > 13) newValue = newValue.slice(0, 13);
    }

    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // --- [기능] 회원 등록 요청 ---
  const handleRegister = async (e) => {
    e.preventDefault(); 
    
    if (!formData.name || !formData.phone) {
      alert('이름과 전화번호는 필수입니다.');
      return;
    }

    try {
      await axios.post('/api/members', {
        ...formData,
        total_amount: totalAmount // 총액은 계산된 값 전송 (백엔드에서도 재계산하지만 안전용)
      });

      alert('✅ 회원이 성공적으로 등록되었습니다!');
      
      // 초기화 및 새로고침
      setShowModal(false);
      fetchStats(); 
      setFormData({
        name: '', phone: '', birth_date: '', height: '', weight: '',
        locker_number: '', use_clothes: false, register_months: 1, 
        membership_fee: 0, locker_fee: 0, clothes_fee: 0
      });

    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message); // 중복된 번호
      } else {
        alert('등록 실패: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      {/* 상단 헤더 */}
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
            navigate('/');
          }} style={{backgroundColor: '#dc3545'}}>로그아웃</button>
        </div>
      </div>

      {/* 통계 카드 섹션 */}
      <div className="stats-grid">
        {/* 1. 매출 카드 (클릭 가능) */}
        <div 
          className="stat-card card-revenue"
          onClick={() => openHistoryModal('revenue')}
          style={{ cursor: 'pointer' }}
          title="클릭하여 월별 매출 확인"
        >
          <div className="stat-title">이번 달 총 매출</div>
          <div className="stat-value">{stats.totalRevenue.toLocaleString()}원</div>
        </div>

        {/* 2. 이용자 카드 */}
        <div className="stat-card card-member">
          <div className="stat-title">현재 이용중인 회원</div>
          <div className="stat-value">{stats.activeMembers}명</div>
        </div>

        {/* 3. 신규 회원 카드 (클릭 가능) */}
        <div 
          className="stat-card card-new"
          onClick={() => openHistoryModal('member')}
          style={{ cursor: 'pointer' }}
          title="클릭하여 월별 가입자 확인"
        >
          <div className="stat-title">이달의 신규 회원</div>
          <div className="stat-value">{stats.newMembers}명</div>
        </div>
      </div>

      {/* 매출 상세 분석 */}
      <div className="revenue-detail">
        <h3>💰 매출 상세 분석</h3>
        <ul className="revenue-list">
          <li className="revenue-item"><span>🏋️‍♂️ 회원권 매출</span><b>{stats.revenueByCategory?.MEMBERSHIP?.toLocaleString() || 0}원</b></li>
          <li className="revenue-item"><span>🔑 사물함 이용료</span><b>{stats.revenueByCategory?.LOCKER?.toLocaleString() || 0}원</b></li>
          <li className="revenue-item"><span>👕 운동복 대여료</span><b>{stats.revenueByCategory?.CLOTHES?.toLocaleString() || 0}원</b></li>
        </ul>
      </div>
      
      {/* 등록 버튼 */}
      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <button 
          style={{ padding: '15px 30px', fontSize: '18px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          + 신규 회원 등록하기
        </button>
      </div>

      {/* ▼▼▼ 1. 회원 등록 모달 ▼▼▼ */}
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
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" maxLength={13} required />
              </div>

              <div className="form-group" style={{display:'flex', gap:'10px'}}>
                <div style={{flex:1}}>
                  <label>생년월일</label>
                  <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                </div>
                <div style={{flex:1}}>
                   <label>등록 개월 수</label>
                   <select name="register_months" value={formData.register_months} onChange={handleChange}>
                     {/* 1~12개월 생성 루프 */}
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

      {/* ▼▼▼ 2. 월별 히스토리 모달 ▼▼▼ */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>
                📅 {historyType === 'revenue' ? '월별 매출 현황' : '월별 신규 회원'}
              </h2>
              <button className="close-btn" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                  <tr>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>기간(월)</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                      {historyType === 'revenue' ? '매출액' : '가입자 수'}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {historyData.length > 0 ? (
                    historyData.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{item.month}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: historyType === 'revenue' ? '#007bff' : '#28a745' }}>
                          {historyType === 'revenue' 
                            ? `${Number(item.value).toLocaleString()}원` 
                            : `${item.value}명`
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ padding: '20px', color: '#999' }}>기록이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={() => setShowHistoryModal(false)}
                style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;