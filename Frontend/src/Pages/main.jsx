import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './main.css'; 
import { Search, Bell, Compass, PlusSquare, CheckSquare, User, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { name: '다이어트', icon: '⚖️' }, { name: '운동', icon: '💪' },
  { name: '공부', icon: '✏️' }, { name: '돌봄', icon: '👨‍👩‍👧' },
  { name: '생활습관', icon: '📅' }, { name: '취미', icon: '🎲' },
  { name: '감정관리', icon: '❤️' }, { name: '외국어', icon: 'Aa' },
];

export default function Main() {
  const [activeMenu, setActiveMenu] = useState('홈');
  const [challenges, setChallenges] = useState([]); // 백엔드 데이터 저장소
  const navigate = useNavigate();

  // 1. 컴포넌트 실행 시 백엔드(3000번)에서 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:3000/api/challenges')
      .then(response => {
        setChallenges(response.data);
      })
      .catch(error => {
        console.error('데이터 로드 실패:', error);
      });
  }, []);

  // 2. 유저 아이콘 클릭 핸들러 (로그인 체크)
  const handleUserClick = () => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      // 로그인 O: 환영 메시지 & (추후) 마이페이지 이동
      const userInfo = JSON.parse(storedUser);
      alert(`${userInfo.nickname}님, 안녕하세요! (마이페이지로 이동합니다)`);
      // navigate('/mypage'); 
    } else {
      // 로그인 X: 로그인 페이지로 이동
      navigate('/login');
    }
  };

  // 3. 로그아웃 핸들러 (테스트용)
  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('로그아웃 되었습니다.');
    window.location.reload(); 
  };

  return (
    <div className="app-container">
      {/* 상단 헤더 */}
      <header>
        <div className="inner-container header-content">
          <div className="logo">
            <CheckSquare size={28} color="#ff4d4f" />
            <span>EveryChall</span>
          </div>

          <div className="search-bar">
            <Search size={20} color="#888" />
            <input type="text" className="search-input" placeholder="어떤 습관을 가지고 싶으신가요?" />
          </div>

          <nav className="pc-nav">
            {['홈', '탐색', '피드', '마이페이지'].map(menu => (
              <div 
                key={menu} 
                className={`pc-nav-item ${activeMenu === menu ? 'active' : ''}`}
                onClick={() => setActiveMenu(menu)}
              >
                {menu}
              </div>
            ))}
            <div className="icon-btn"><Bell size={24} color="#333" /></div>
            
            {/* ★ 핵심: 유저 아이콘 클릭 시 로그인 체크 */}
            <div 
              className="icon-btn" 
              onClick={handleUserClick}
              style={{ cursor: 'pointer' }}
            >
              <User size={24} color="#333" />
            </div>
            
            <button className="btn-primary">챌린지 개설</button>

            {/* 로그인 상태일 때만 보이는 로그아웃 버튼 */}
            {localStorage.getItem('user') && (
              <button 
                onClick={handleLogout} 
                style={{marginLeft: '10px', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', background: '#eee', border: 'none', borderRadius: '4px'}}
              >
                로그아웃
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="inner-container main-content">
        <div className="banner-section">
          <div className="banner">
            <div>
              <h2>지구의 날을 맞아<br />분리배출 실천해요</h2>
              <p>풀무원 X EveryCahll 콜라보레이션</p>
              <button className="btn-primary" style={{padding: '8px 16px', fontSize: '0.9rem'}}>자세히 보기</button>
            </div>
            <div style={{fontSize: '5rem'}}>🌏</div>
          </div>
          <div className="side-banner">
            <h3>신규 가입 혜택</h3>
            <p style={{color: '#666', marginTop: '10px', fontSize: '0.9rem'}}>지금 시작하면 1,000 포인트 즉시 지급!</p>
          </div>
        </div>

        <section style={{marginBottom: '60px'}}>
          <div className="section-title">
            카테고리별 챌린지
            <span className="view-all">전체보기 <ChevronRight size={16} style={{verticalAlign: 'middle'}}/></span>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="category-item">
                <div className="cat-icon">{cat.icon}</div>
                <span className="cat-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-title">
            🔥 실시간 인기 챌린지
          </div>
          <div className="card-grid">
            {/* ★ 핵심: 백엔드 데이터(challenges) 렌더링 */}
            {challenges.length > 0 ? (
              challenges.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-img-wrapper">
                    {/* 이미지가 있으면 보여주고 없으면 회색 박스 */}
                    {item.img ? (
                      <img src={item.img} alt={item.title} className="card-img" />
                    ) : (
                      <div style={{width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'}}>No Image</div>
                    )}
                    <span className="participants-badge">👤 {item.participants}명 참여중</span>
                  </div>
                  <div className="card-body">
                    <div className="card-cat">{item.category}</div>
                    <div className="card-title">{item.title}</div>
                    <div className="card-tags">
                      {Array.isArray(item.tags) ? item.tags.join(' · ') : '#챌린지'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888'}}>
                <p>등록된 챌린지가 없습니다.</p>
                <p style={{fontSize: '0.9rem'}}>DB에 데이터를 추가해보세요!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="mobile-bottom-nav">
        <div className="nav-item active"><Compass size={24} /><div>탐색</div></div>
        <div className="nav-item"><PlusSquare size={24} /><div>개설</div></div>
        <div className="nav-item"><CheckSquare size={24} /><div>인증</div></div>
        
        {/* ★ 모바일 하단바 클릭 시에도 로그인 체크 */}
        <div className="nav-item" onClick={handleUserClick}>
          <User size={24} /><div>MY</div>
        </div>
      </div>
    </div>
  );
}