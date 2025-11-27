import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; 
import { CheckSquare } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 백엔드(3000번)로 로그인 요청
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email, 
        password
      });

      // ★ [핵심] 로그인 성공 시 서버가 준 유저 정보를 브라우저에 저장
      localStorage.setItem('user', JSON.stringify(response.data.user)); 

      alert(`${response.data.user.nickname}님 환영합니다!`);
      navigate('/'); // 메인으로 이동

    } catch (error) {
      const msg = error.response?.data?.message || '로그인 실패';
      alert(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button 
          onClick={() => navigate(-1)} 
          style={{position: 'absolute', top: 20, right: 20, border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#888'}}
        >
          ✕
        </button>

        <div className="login-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <CheckSquare size={32} color="#ff4d4f" strokeWidth={2.5} />
          <span>Challenge</span>
        </div>

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

        <div className="login-links">
          <span className="link-item">아이디 찾기</span>
          <span className="divider">|</span>
          <span className="link-item">비밀번호 찾기</span>
          <span className="divider">|</span>
          <span 
            className="link-item" 
            style={{color: '#ff4d4f', fontWeight: 'bold'}}
            onClick={() => navigate('/signup')}
          >
            회원가입
          </span>
        </div>

        <div className="social-section">
          <span className="social-label">SNS 계정으로 간편하게 시작하기</span>
          <div className="social-buttons">
            <button className="btn-social btn-kakao"><span>카카오로 시작하기</span></button>
            <button className="btn-social btn-google"><span>Google로 시작하기</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}