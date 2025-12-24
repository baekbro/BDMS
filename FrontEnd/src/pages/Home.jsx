import { Link } from 'react-router-dom';

function Home() {
  const styles = {
    container: {
      height: '100vh', display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', gap: '30px',
      backgroundColor: '#282c34', color: 'white'
    },
    button: {
      padding: '20px 40px', fontSize: '24px', fontWeight: 'bold',
      borderRadius: '15px', border: 'none', cursor: 'pointer',
      width: '300px', transition: '0.3s'
    },
    kioskBtn: { backgroundColor: '#00d8ff', color: '#282c34' }, // 리액트 색상
    adminBtn: { backgroundColor: '#f7df1e', color: '#282c34' }  // JS 색상
  };

  return (
    <div style={styles.container}>
      <h1>🏋️‍♂️ 헬스장 관리 시스템</h1>
      
      {/* 키오스크로 이동 */}
      <Link to="/kiosk">
        <button style={{...styles.button, ...styles.kioskBtn}}>
          📱 키오스크 모드 (회원용)
        </button>
      </Link>

      {/* 관리자로 이동 */}
      <Link to="/admin">
        <button style={{...styles.button, ...styles.adminBtn}}>
          👨‍💼 관리자 모드
        </button>
      </Link>
    </div>
  );
}

export default Home;