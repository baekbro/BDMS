import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; // 기존 로그인 스타일 재사용
import { CheckSquare } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !nickname) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      // 백엔드로 회원가입 요청 보냄
      await axios.post('http://127.0.0.1:3000/api/auth/signup', {
        email,
        nickname,
        password
      });

      alert('회원가입 성공! 로그인 해주세요.');
      navigate('/login'); // 성공 시 로그인 페이지로 이동

    } catch (error) {
      // 에러 메시지 처리
      const msg = error.response?.data?.message || '회원가입 실패';
      alert(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 뒤로 가기 */}
        <button 
          onClick={() => navigate(-1)} 
          style={{position: 'absolute', top: 20, right: 20, border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#888'}}
        >
          ✕
        </button>

        <div className="login-logo">
          <CheckSquare size={32} color="#ff4d4f" strokeWidth={2.5} />
          <span>회원가입</span>
        </div>

        <form className="login-form" onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder="이메일" 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="닉네임 (이름)" 
            className="input-field"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-login">가입하기</button>
        </form>
      </div>
    </div>
  );
}