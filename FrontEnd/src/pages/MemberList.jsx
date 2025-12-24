import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // 스타일이 필요하다면

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ★ [추가] 연장 모달 상태 관리
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // 연장할 회원 정보
  const [extendMonths, setExtendMonths] = useState(1); // 기본 1개월

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/members');
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // ★ [추가] 연장 버튼 클릭 시 모달 열기
  const openExtendModal = (member) => {
    setSelectedMember(member);
    setExtendMonths(1); // 초기화
    setShowExtendModal(true);
  };

  // ★ [추가] 실제 연장 요청 보내기
  const handleExtendSubmit = async () => {
    if (!selectedMember) return;

    // 확인 메시지
    if (!window.confirm(`${selectedMember.name}님을 ${extendMonths}개월 연장하시겠습니까?`)) return;

    try {
      await axios.put(`/api/members/${selectedMember.id}/extend`, {
        months: extendMonths
      });
      
      alert('✅ 기간 연장이 완료되었습니다!');
      setShowExtendModal(false);
      fetchMembers(); // 목록 새로고침 (변경된 날짜 확인 위해)
      
    } catch (error) {
      alert('연장 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  // 검색 필터링
  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (member.name || '').includes(term) || (member.phone || '').includes(term);
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toISOString().split('T')[0];
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="member-list-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 상단 헤더 및 검색창 (기존 코드 유지) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>📋 전체 회원 리스트 ({filteredMembers.length}명)</h2>
        <button onClick={() => navigate('/admin')} style={btnStyle}>뒤로가기</button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
         <input 
           type="text" 
           placeholder="🔍 이름 또는 전화번호 검색..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           style={inputStyle}
         />
      </div>

      {/* 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={thStyle}>이름</th>
            <th style={thStyle}>전화번호</th>
            <th style={thStyle}>생년월일</th>
            <th style={thStyle}>락커</th>
            <th style={thStyle}>운동복</th>
            <th style={thStyle}>만료일</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>관리</th> {/* ★ 관리 컬럼 추가 */}
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => {
            const isExpired = new Date(member.membership_end_date) < new Date();
            return (
              <tr key={member.id} style={{ borderBottom: '1px solid #eee', color: isExpired ? '#999' : '#000' }}>
                <td style={tdStyle}>{member.name}</td>
                <td style={tdStyle}>{member.phone}</td>
                <td style={tdStyle}>{formatDate(member.birth_date)}</td>
                <td style={tdStyle}>{member.locker_number ? `#${member.locker_number}` : '-'}</td>
                <td style={tdStyle}>{member.use_clothes ? 'O' : 'X'}</td>
                <td style={tdStyle}>{formatDate(member.membership_end_date)}</td>
                <td style={tdStyle}>
                  {isExpired ? <span style={badgeRed}>만료됨</span> : <span style={badgeGreen}>이용중</span>}
                </td>
                {/* ★ 연장 버튼 추가 */}
                <td style={tdStyle}>
                  <button 
                    onClick={() => openExtendModal(member)}
                    style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + 연장
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ★ [추가] 기간 연장 모달 (심플 버전) */}
      {showExtendModal && selectedMember && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3>⏳ 기간 연장 ({selectedMember.name})</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              현재 만료일: {formatDate(selectedMember.membership_end_date)}
            </p>
            
            <div style={{ margin: '20px 0' }}>
  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>추가할 기간</label>
  <select 
    value={extendMonths} 
    onChange={(e) => setExtendMonths(Number(e.target.value))}
    style={{ width: '100%', padding: '10px' }}
  >
    {/* 1부터 12까지 반복해서 옵션 생성 */}
    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
      <option key={month} value={month}>{month}개월 추가</option>
    ))}
  </select>
</div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleExtendSubmit} className="submit-btn" style={{ flex: 1 }}>연장하기</button>
              <button onClick={() => setShowExtendModal(false)} className="close-btn" style={{ flex: 1, background: '#6c757d' }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 스타일 (기존과 동일하게 사용)
const thStyle = { padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' };
const tdStyle = { padding: '12px', textAlign: 'left' };
const btnStyle = { padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };
const badgeRed = { color: '#dc3545', fontWeight: 'bold', border: '1px solid #dc3545', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em' };
const badgeGreen = { color: '#28a745', fontWeight: 'bold', border: '1px solid #28a745', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em' };

export default MemberList;