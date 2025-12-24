// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', inputs);
      
      // 성공 시: 토큰을 브라우저에 저장하고 대시보드로 이동
      localStorage.setItem('token', res.data.token); 
      alert('로그인되었습니다.');
      navigate('/admin/dashboard');

    } catch (error) {
      alert('로그인 실패: ID나 비밀번호를 확인하세요.');
    }
  };

  

  const styles = {
    container: {
      height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: '#282c34'
    },
    form: {
      padding: '40px', background: 'white', borderRadius: '10px',
      display: 'flex', flexDirection: 'column', gap: '15px', width: '300px'
    },
    input: { padding: '10px', fontSize: '16px' },
    button: { padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={{textAlign: 'center', margin: 0}}>🔒 관리자 로그인</h2>
        <input 
          name="username" placeholder="ID" 
          onChange={handleChange} style={styles.input} 
        />
        <input 
          type="password" name="password" placeholder="Password" 
          onChange={handleChange} style={styles.input} 
        />
        <button type="submit" style={styles.button}>로그인</button>
      </form>
    </div>
  );
}

export default Login;