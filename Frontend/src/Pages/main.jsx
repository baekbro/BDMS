import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './main.css'; 
import { Search, Bell, Compass, PlusSquare, CheckSquare, User, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { name: '다이어트', icon: '⚖️' }, { name: '운동', icon: '💪' },
  { name: '공부', icon: '✏️' }, { name: '돌봄', icon: '👨‍👩‍👧' },
  { name: '생활습관', icon: '📅' }, { name: '취미', icon: '🎲' },
  { name: '감정관리', icon: '❤️' }, { name: '외국어', icon: 'Aa' },
];

const CHALLENGES = [
  { id: 1, title: '[하루도전] 할일 3가지 쓰기', category: '공식 챌린지', participants: 549, tags: ['매일', '기타'], img: 'https://via.placeholder.com/400x250/eee/888?text=ToDo' },
  { id: 2, title: '30분 걷기·달리기 (2km)', category: '공식 챌린지', participants: 298, tags: ['주3회', '2주동안'], img: 'https://via.placeholder.com/400x250/eee/888?text=Running' },
  { id: 3, title: '청소하기', category: '공식 챌린지', participants: 205, tags: ['주2회', '2주동안'], img: 'https://via.placeholder.com/400x250/eee/888?text=Cleaning' },
  { id: 4, title: '영양제 챙겨 먹기', category: '공식 챌린지', participants: 120, tags: ['매일', '2주동안'], img: 'https://via.placeholder.com/400x250/eee/888?text=Vitamin' },
  { id: 5, title: '경제 뉴스 기사 읽기', category: '공식 챌린지', participants: 85, tags: ['주5회', '4주동안'], img: 'https://via.placeholder.com/400x250/eee/888?text=News' },
  { id: 6, title: '하루 물 1L 마시기', category: '공식 챌린지', participants: 340, tags: ['매일', '습관'], img: 'https://via.placeholder.com/400x250/eee/888?text=Water' },
];

export default function Main() {
  const [activeMenu, setActiveMenu] = useState('홈');
  const navigate = useNavigate(); 

  return (
    <div className="app-container">
      {/* 1. 상단 헤더 */}
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

          {/* PC용 네비게이션 메뉴 */}
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
            <div 
              className="icon-btn" 
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer' }}
            >
              <User size={24} color="#333" />
            </div>
            
            <button className="btn-primary">챌린지 개설</button>
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
            {CHALLENGES.map((item) => (
              <div key={item.id} className="card">
                <div className="card-img-wrapper">
                  <img src={item.img} alt={item.title} className="card-img" />
                  <span className="participants-badge">👤 {item.participants}명 참여중</span>
                </div>
                <div className="card-body">
                  <div className="card-cat">{item.category}</div>
                  <div className="card-title">{item.title}</div>
                  <div className="card-tags">{item.tags.join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <div className="mobile-bottom-nav">
        <div className="nav-item active"><Compass size={24} /><div>탐색</div></div>
        <div className="nav-item"><PlusSquare size={24} /><div>개설</div></div>
        <div className="nav-item"><CheckSquare size={24} /><div>인증</div></div>
        <div className="nav-item" onClick={() => navigate('/login')}>
          <User size={24} /><div>MY</div>
        </div>
      </div>
    </div>
  );
}