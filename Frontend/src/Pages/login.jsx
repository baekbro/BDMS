// src/Pages/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ★ 이동 훅 import
import './login.css'; 
import { CheckSquare } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ★ 네비게이트 함수 생성

  const handleLogin = (e) => {
    e.preventDefault();
    
    // [TODO] 백엔드(Node.js/Spring) 연동 시 여기에 axios 요청
    console.log('로그인 시도:', email, password);
    
    if(!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    alert('로그인 성공! 메인으로 이동합니다.');
    navigate('/'); // ★ 로그인 성공 시 메인 화면('/')으로 이동
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* ★ 뒤로 가기 (닫기) 버튼 추가 */}
        <button 
          onClick={() => navigate(-1)} // 이전 페이지로 이동
          style={{position: 'absolute', top: 20, right: 20, border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#888'}}
        >
          ✕
        </button>

        {/* 로고 클릭 시 홈으로 */}
        <div 
          className="login-logo" 
          onClick={() => navigate('/')} 
          style={{cursor: 'pointer'}}
        >
          <CheckSquare size={32} color="#ff4d4f" strokeWidth={2.5} />
          <span>Challenge</span>
        </div>

        {/* 이메일/비밀번호 입력 폼 */}
        <form className="login-form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="이메일" 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-login">로그인</button>
        </form>

        {/* 찾기 및 회원가입 링크 */}
        <div className="login-links">
          <span className="link-item">아이디 찾기</span>
          <span className="divider">|</span>
          <span className="link-item">비밀번호 찾기</span>
          <span className="divider">|</span>
          <span className="link-item" style={{color: '#ff4d4f', fontWeight: 'bold'}}>회원가입</span>
        </div>

        {/* 소셜 로그인 */}
        <div className="social-section">
          <span className="social-label">SNS 계정으로 간편하게 시작하기</span>
          <div className="social-buttons">
            <button className="btn-social btn-kakao">
              <span>카카오로 시작하기</span>
            </button>
            <button className="btn-social btn-google">
              <span>Google로 시작하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}