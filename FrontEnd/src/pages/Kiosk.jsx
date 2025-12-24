// src/pages/Kiosk.jsx
import { useState } from 'react';
import axios from 'axios';
import './Kiosk.css';

function Kiosk() {
  const [inputNumber, setInputNumber] = useState('');
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [msgType, setMsgType] = useState(''); // 성공/실패 스타일 구분용 ('success' or 'error')

  const handleNumberClick = (num) => {
    if (inputNumber.length < 8) {
      setInputNumber((prev) => prev + num.toString());
    }
  };

  const handleDelete = () => {
    setInputNumber((prev) => prev.slice(0, -1));
  };

  const formatDisplay = (num) => {
    if (num.length > 4) {
      return num.slice(0, 4) + '-' + num.slice(4);
    }
    return num;
  };

  const handleCheckIn = async () => {
    if (inputNumber.length < 8) {
      setMessage('뒷번호 8자리를 모두 입력해주세요.');
      setMsgType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    const fullPhoneNumber = `010-${inputNumber.slice(0, 4)}-${inputNumber.slice(4)}`;

    try {
      const response = await axios.post('/api/attendance/check-in', {
        phone: fullPhoneNumber
      });
      
      const { name, daysLeft, locker } = response.data;
      setMessage(`✅ ${name}님 환영합니다!\n(남은기간: ${daysLeft}일)`);
      if(locker) setMessage((prev) => `${prev}\n🔑 사물함: ${locker}번`);
      setMsgType('success');

      setTimeout(() => {
        setInputNumber('');
        setMessage('');
      }, 3000);

    } catch (error) {
      if (error.response) {
         setMessage(`❌ ${error.response.data.message}`);
      } else {
         setMessage('❌ 서버 연결 오류');
      }
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kiosk-container">
      <h1 className="kiosk-title">💪 Gym Check-In</h1>
      
      {/* 번호 표시 화면 */}
      <div className="display-screen">
        {inputNumber ? (
          formatDisplay(inputNumber)
        ) : (
          <span className="placeholder">뒷번호 8자리 입력</span>
        )}
      </div>

      {/* 키패드 */}
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} className="key-btn" onClick={() => handleNumberClick(num)}>
            {num}
          </button>
        ))}
        <button className="key-btn btn-delete" onClick={handleDelete}>←</button>
        <button className="key-btn" onClick={() => handleNumberClick(0)}>0</button>
        <button className="key-btn btn-clear" onClick={() => setInputNumber('')}>C</button>
        
        <button 
          className="btn-action" 
          onClick={handleCheckIn}
          disabled={loading}
        >
          {loading ? '확인 중...' : '출석체크 ✔'}
        </button>
      </div>

      {/* 결과 메시지 (성공/실패에 따라 색상 다르게) */}
      {message && (
        <div className={`message-box ${msgType === 'success' ? 'msg-success' : 'msg-error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Kiosk;